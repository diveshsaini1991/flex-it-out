import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import axios from "axios";
 

function Squat({ darkMode }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [angle, setAngle] = useState(0);
  const [position, setPosition] = useState("None");
  const [feedback, setFeedback] = useState("None");
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [savedCounter, setSavedCounter] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const angleBufferRef = useRef([]);
  const positionRef = useRef("None");
  const durationTimerRef = useRef(null);

  useEffect(() => {
    if (!workoutStarted) return;

    durationTimerRef.current = setInterval(() => {
      if (workoutStartTime) {
        const duration = Math.floor((Date.now() - workoutStartTime) / 1000);
        setWorkoutDuration(duration);
      }
    }, 1000);

    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, [workoutStarted, workoutStartTime]);

  useEffect(() => {
    poseRef.current = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    poseRef.current.onResults(onResults);

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !poseRef.current) return;

    if (workoutStarted && !cameraRef.current) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await poseRef.current.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
    } else if (!workoutStarted && cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
  }, [workoutStarted]);

  const calculateAngle = (a, b, c) => {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  };

  const analyzeForm = (landmarks) => {
    const feedback = [];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

     
    const kneeAnkleAlignment =
      (Math.abs(leftKnee.x - leftAnkle.x) +
        Math.abs(rightKnee.x - rightAnkle.x)) /
      2;
    if (kneeAnkleAlignment > 0.1) {
      feedback.push("Keep knees aligned with ankles");
    }

    
    const backAlignment =
      (Math.abs(leftShoulder.x - leftHip.x) +
        Math.abs(rightShoulder.x - rightHip.x)) /
      2;
    if (backAlignment > 0.1) {
      feedback.push("Keep back straight");
    }

    return feedback.length > 0 ? feedback.join(" | ") : "Good form!";
  };

  const onResults = (results) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.poseLandmarks) {
      const landmarks = results.poseLandmarks;

      drawConnectors(
        canvasCtx,
        landmarks,
        Pose.POSE_CONNECTIONS,
        { color: "#00FF00", lineWidth: 2 }
      );

      drawLandmarks(canvasCtx, landmarks, {
        color: "#FF0000",
        lineWidth: 2,
        radius: 4,
      });

      const leftHip = landmarks[23];
      const leftKnee = landmarks[25];
      const leftAnkle = landmarks[27];
      const rightHip = landmarks[24];
      const rightKnee = landmarks[26];
      const rightAnkle = landmarks[28];

      const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      const angle = (leftAngle + rightAngle) / 2;

      angleBufferRef.current.push(angle);
      if (angleBufferRef.current.length > 5) {
        angleBufferRef.current.shift();
      }
      const smoothedAngle =
        angleBufferRef.current.reduce((a, b) => a + b, 0) /
        angleBufferRef.current.length;

      const formFeedback = analyzeForm(landmarks);
      setFeedback(formFeedback);

      if (smoothedAngle > 150 && positionRef.current === "down") {
        positionRef.current = "up";
        setPosition("up");
        setCounter((prev) => prev + 1);
      } else if (smoothedAngle < 100) {
        positionRef.current = "down";
        setPosition("down");
      }

      setAngle(Math.round(smoothedAngle));
    }

    canvasCtx.restore();
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setWorkoutStartTime(Date.now());
    setCounter(0);
    angleBufferRef.current = [];
    positionRef.current = "None";
    setPosition("None");
    setSaveStatus(null);
  };

  const endWorkout = async () => {
    setWorkoutStarted(false);

    if (counter > 0) {
      await saveWorkout();
      setSavedCounter(counter);
    }

    if (counter > 0) {
      await saveWorkout();
      setSavedCounter(counter);
      
     
      try {
       
        
        const response = await axios.get(
          "http://localhost:3000/api/challenges",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
       
        const attemptedChallenges = response.data.attempted.filter(
          challenge => challenge.type === "squat"    
        );
          
        for (const challenge of attemptedChallenges) {
          if (counter >= challenge.target) {
             
            await axios.post(
              `http://localhost:3000/api/challenges/complete/${challenge._id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );
            
            
            setSaveStatus({
              success: true,
              message: `Challenge completed: ${challenge.title}!`,
            });
          }
        }
      } catch (error) {
        console.error("Error checking challenges:", error);
      }
    }

    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
  };
 
 




  const saveWorkout = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setSaveStatus({
          success: false,
          message: "You must be logged in to save workouts",
        });
        return;
      }

      const workoutData = {
        type: "squat",
        count: counter,
        duration: workoutDuration,
      };

      const response = await axios.post(
        "http://localhost:3000/api/workouts/addworkout",
        workoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true, 
        }
      );

      setSaveStatus({
        success: true,
        message: "Workout saved successfully!",
      });
    } catch (error) {
      console.error("Error saving workout:", error);
      setSaveStatus({
        success: false,
        message: error.response?.data?.message || "Error saving workout",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-6`}>
      <h1 className={`text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>
        Squat Counter
      </h1>

      <div className="max-w-7xl mx-auto">
        {!workoutStarted ? (
          <div className="flex flex-col items-center">
            <button
              onClick={startWorkout}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Workout
            </button>

            {saveStatus && (
              <div className={`mt-4 p-3 rounded-lg ${saveStatus.success ? "bg-green-800" : "bg-red-800"} text-white`}>
                {saveStatus.message}
              </div>
            )}

            {savedCounter > 0 && (
              <div className="mt-6 text-center">
                <h3 className="text-xl text-blue-400">Last Workout</h3>
                <p className="text-2xl font-bold text-green-500 mt-2">
                  {savedCounter} squats in {formatTime(workoutDuration)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-auto rounded-lg shadow-lg border-4 border-blue-500"
                width="640"
                height="480"
                autoPlay
              ></video>
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                width="640"
                height="480"
              ></canvas>
            </div>

            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-blue-400">Workout Stats</h2>
                <div className="text-xl font-bold text-yellow-400">
                  {formatTime(workoutDuration)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-lg mt-4">
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                  <p>Squats</p>
                  <p className="font-bold text-green-500">{counter}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                  <p>Angle</p>
                  <p className="font-bold text-yellow-500">{angle}°</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                  <p>Position</p>
                  <p className="font-bold text-purple-500">{position}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                  <p>Feedback</p>
                  <p className="font-bold text-red-500">{feedback}</p>
                </div>
              </div>

              <button
                onClick={endWorkout}
                disabled={isSaving}
                className={`mt-6 w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all duration-300 ${
                  isSaving ? "opacity-50" : ""
                }`}
              >
                {isSaving ? "Saving..." : "End & Save Workout"}
              </button>
            </div>
          </div>
        )}

        <div className={`mt-12 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">How to Perform Squats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <video className="rounded-lg shadow-lg" muted loop autoPlay controls>
              <source src="https://videos.pexels.com/video-files/4065502/4065502-uhd_2560_1440_30fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                <h3 className="font-bold text-lg">1. Starting Position</h3>
                <p>Stand with your feet shoulder-width apart.</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                <h3 className="font-bold text-lg">2. Lowering Down</h3>
                <p>Lower your body until your thighs are parallel to the ground.</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                <h3 className="font-bold text-lg">3. Pushing Up</h3>
                <p>Push through your heels to return to the starting position.</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} hover:scale-105 transition-all duration-300`}>
                <h3 className="font-bold text-lg">4. Form Tips</h3>
                <p>Keep your back straight and chest up throughout the movement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Squat;