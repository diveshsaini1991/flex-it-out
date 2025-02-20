import React, { useRef, useEffect, useState } from "react";
import * as poseDetection from "@mediapipe/pose";
import * as drawingUtils from "@mediapipe/drawing_utils";
import * as cameraUtils from "@mediapipe/camera_utils";

function Squat({ darkMode }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [angle, setAngle] = useState(0);
  const [position, setPosition] = useState("None");
  const [feedback, setFeedback] = useState("None");

  // Create refs to maintain state across renders
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const angleBufferRef = useRef([]);
  const positionRef = useRef("None");

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    // Setup canvas
    const canvasElement = canvasRef.current;
    canvasElement.width = 640;
    canvasElement.height = 480;

    // Initialize pose detection
    poseRef.current = new poseDetection.Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    poseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    poseRef.current.onResults(onResults);

    // Initialize camera
    if (videoRef.current) {
      cameraRef.current = new cameraUtils.Camera(videoRef.current, {
        onFrame: async () => {
          if (poseRef.current) {
            await poseRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current.start();
    }

    // Cleanup function
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, []);

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
    if (!canvasRef.current) return;

    const canvasElement = canvasRef.current;
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
      drawingUtils.drawConnectors(
        canvasCtx,
        landmarks,
        poseDetection.POSE_CONNECTIONS,
        { color: "#00FF00", lineWidth: 2 }
      );

      drawingUtils.drawLandmarks(canvasCtx, landmarks, {
        color: "#FF0000",
        lineWidth: 1,
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
      const currentAngle = (leftAngle + rightAngle) / 2;

      // Smooth angle using a buffer
      const bufferSize = 5;
      angleBufferRef.current.push(currentAngle);
      if (angleBufferRef.current.length > bufferSize) {
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
        setCounter((prevCounter) => prevCounter + 1);
      } else if (smoothedAngle < 100) {
        positionRef.current = "down";
        setPosition("down");
      }

      // Update angle
      setAngle(Math.round(smoothedAngle));
    }

    canvasCtx.restore();
  };

  return (
    <div className="squat-counter ">
      <h1>Squat Counter</h1>
      <div className="flex flex-wrap justify-center gap-4 md:flex-nowrap ">
        <div className="video-container relative shadow-2xl">
          <video
            ref={videoRef}
            width="640"
            height="480"
            autoPlay
            style={{ display: "none" }}
          />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="border-2 border-gray-400 rounded-lg"
          />
        </div>
        <div
          className={`stats p-6 rounded-lg w-full md:w-64 ${
            darkMode ? "bg-gray-800" : "bg-white shadow-2xl"
          }`}
        >
          <div className="stat-item mb-4 ">
            <h3 className="text-lg font-medium">Squats</h3>
            <p className="text-3xl font-bold">{counter}</p>
          </div>
          <div className="stat-item mb-4">
            <h3 className="text-lg font-medium">Knee Angle</h3>
            <p className="text-3xl font-bold">{angle}°</p>
          </div>
          <div className="stat-item mb-4">
            <h3 className="text-lg font-medium">Position</h3>
            <p className="text-xl">{position}</p>
          </div>
          <div className="stat-item">
            <h3 className="text-lg font-medium">Feedback</h3>
            <p className="text-sm mt-2">{feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Squat;
