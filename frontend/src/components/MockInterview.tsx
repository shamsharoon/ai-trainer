import React, { useEffect, useRef, useState } from "react";
import Logo from "../Prepifi.png";
import { useLocation } from "react-router-dom";
import axios from "axios";

// async function startInterview() {
//   try {
//     const csrfToken = await axios.get("http://localhost:8000/csrf/", {
//       withCredentials: true, // Ensure cookies are sent
//     });

//     const response = await axios.post(
//       "http://localhost:8000/start",
//       {  }, // Request body if needed
//       {
//         headers: {
//           "X-CSRFToken": csrfToken.data.csrfToken, // Pass CSRF token
//         },
//         withCredentials: true, // Include cookies
//       }
//     );

//     console.log("Interview started:", response.data);
//   } catch (error) {
//     console.error(
//       "Error starting interview:",
//       error.response?.data || error.message
//     );
//   }
// }

function MockInterview() {
  const videoRef = useRef(null);
  const location = useLocation();
  const formData = location.state?.formData || {}; // Extract the passed formData
  const [transcription, setTranscription] = useState("");

  const startInterview = async () => {
    try {
      const csrfResponse = await axios.get("http://localhost:8000/csrf/", {
        withCredentials: true,
      });

      const csrfToken = csrfResponse.data.csrfToken;

      console.log(formData);

      const response = await axios.post(
        "http://localhost:8000/start",
        { formData }, // Pass formData to the backend
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Transcription:", response.data.message);
      setTranscription(response.data.message); // Set the transcription in state

      console.log("Interview started:", response.data.message);
    } catch (error) {
      console.error(
        "Error starting interview:",
        error.response?.data || error.message
      );
    }
  };

  startInterview();

  useEffect(() => {
    // Request access to the user's camera
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false, // Set to true if you need audio
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
    enableCamera();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Logo */}
      <img src={Logo} alt="Prepifi Logo" className="w-40 mb-4" />

      {/* Main Interview Container */}
      <div className="flex flex-row justify-evenly w-[80%] bg-white shadow-md rounded-lg p-8">
        {/* Interviewer Video Section */}
        <div className="flex flex-col items-center justify-center w-[45%] h-[300px] bg-gray-300 rounded-lg relative">
          <img
            src="https://imgcdn.stablediffusionweb.com/2024/10/5/b787d704-676a-4116-969f-71cedf2e92e8.jpg"
            alt="Interviewer Avatar"
            className="absolute bottom-24 w-32 h-32 rounded-full border-white"
          />
          <span className="absolute bottom-16 text-lg text-center font-semibold rounded-full">
            Onyx AI
          </span>
        </div>

        {/* Candidate Video Section */}
        <div className="flex items-center justify-center w-[45%] h-[300px] bg-gray-300 rounded-lg relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted // Mute the video to prevent feedback
            className="w-full h-full object-cover rounded-lg"
          ></video>
        </div>
      </div>

      {/* Transcript Section */}
      <div className="w-[80%] mt-6">
        <h3 className="text-lg font-semibold mb-2">Transcript:</h3>
        <p className="bg-white p-4 shadow rounded-lg">
          {transcription || "No transcription yet."}
        </p>
      </div>

      {/* End Interview Button */}
      <div>
        <button
          className="mt-6 mr-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-gray-800"
          onClick={startInterview}
        >
          Done Speaking
        </button>

        <button
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-gray-800"
          onClick={() => console.log("End Interview")}
        >
          End Interview
        </button>
      </div>
    </div>
  );
}

export default MockInterview;
