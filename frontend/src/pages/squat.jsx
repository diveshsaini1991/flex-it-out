 


import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import axios from "axios"; // Make sure to install axios: npm install axios

function Squat() {
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

  // Use refs to maintain state between renders
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const angleBufferRef = useRef([]);
  const positionRef = useRef("None");
  const durationTimerRef = useRef(null);

  useEffect(() => {
    if (!workoutStarted) return;

    // Update workout duration every second
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

    // Check knee-ankle alignment
    const kneeAnkleAlignment =
      (Math.abs(leftKnee.x - leftAnkle.x) +
        Math.abs(rightKnee.x - rightAnkle.x)) /
      2;
    if (kneeAnkleAlignment > 0.1) {
      feedback.push("Keep knees aligned with ankles");
    }

    // Check back alignment
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

    // Draw the camera feed on the canvas
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.poseLandmarks) {
      const landmarks = results.poseLandmarks;

      // Draw pose landmarks and connectors
      drawConnectors(
        canvasCtx,
        landmarks,
        Pose.POSE_CONNECTIONS,
        { color: "#00FF00", lineWidth: 2 }
      );

      // Draw landmarks with larger red dots
      drawLandmarks(canvasCtx, landmarks, {
        color: "#FF0000",
        lineWidth: 2, // Increase line width for better visibility
        radius: 4, // Increase radius to make the dots larger
      });

      // Calculate angles for both legs
      const leftHip = landmarks[23];
      const leftKnee = landmarks[25];
      const leftAnkle = landmarks[27];
      const rightHip = landmarks[24];
      const rightKnee = landmarks[26];
      const rightAnkle = landmarks[28];

      const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      const angle = (leftAngle + rightAngle) / 2;

      // Smooth angle using a buffer
      angleBufferRef.current.push(angle);
      if (angleBufferRef.current.length > 5) {
        angleBufferRef.current.shift();
      }
      const smoothedAngle =
        angleBufferRef.current.reduce((a, b) => a + b, 0) /
        angleBufferRef.current.length;

      // Update form feedback
      const formFeedback = analyzeForm(landmarks);
      setFeedback(formFeedback);

      // Detect squat position and count reps
      if (smoothedAngle > 150 && positionRef.current === "down") {
        positionRef.current = "up";
        setPosition("up");
        setCounter((prev) => prev + 1);
      } else if (smoothedAngle < 100) {
        positionRef.current = "down";
        setPosition("down");
      }

      // Update angle
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

    // Only save if there were squats performed
    if (counter > 0) {
      await saveWorkout();
      setSavedCounter(counter);
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
      // Get auth token from localStorage
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">Squat Counter</h1>

      {!workoutStarted ? (
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={startWorkout}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition duration-300 text-xl"
          >
            Start Workout
          </button>

          {saveStatus && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                saveStatus.success ? "bg-green-800" : "bg-red-800"
              }`}
            >
              {saveStatus.message}
            </div>
          )}

          {savedCounter > 0 && (
            <div className="mt-6 text-center">
              <h3 className="text-xl text-blue-300">Last Workout</h3>
              <p className="text-2xl font-bold text-green-400 mt-2">
                {savedCounter} squats in {formatTime(workoutDuration)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-[320px] md:w-[640px] h-auto rounded-lg shadow-lg border-4 border-blue-500"
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
          </div>

          <div className="mt-6 w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-300">
                Workout Stats
              </h2>
              <div className="text-xl font-bold text-yellow-300">
                {formatTime(workoutDuration)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-lg mt-4">
              <p className="flex justify-between border-b border-gray-700 pb-2">
                Squats: <span className="font-bold text-green-400">{counter}</span>
              </p>
              <p className="flex justify-between border-b border-gray-700 pb-2">
                Angle: <span className="font-bold text-yellow-400">{angle}°</span>
              </p>
              <p className="flex justify-between border-b border-gray-700 pb-2">
                Position:{" "}
                <span className="font-bold text-purple-400">{position}</span>
              </p>
              <p className="flex justify-between border-b border-gray-700 pb-2">
                Feedback:{" "}
                <span className="font-bold text-red-400">{feedback}</span>
              </p>
            </div>

            <button
              onClick={endWorkout}
              disabled={isSaving}
              className={`mt-6 w-full py-3 ${
                isSaving ? "bg-gray-600" : "bg-red-600 hover:bg-red-700"
              } text-white font-bold rounded-lg shadow-lg transition duration-300 text-xl`}
            >
              {isSaving ? "Saving..." : "End & Save Workout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Squat;