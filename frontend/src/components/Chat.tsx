import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add user input to chat logs
    setLogs((prev) => [...prev, `User: ${input}`]);

    try {
      // Send input to the /hello API
      const response = await axios.get("/hello");
      setLogs((prev) => [...prev, `Bot: ${response.data}`]);
    } catch (error) {
      setLogs((prev) => [...prev, "Bot: Error fetching response"]);
    }

    setInput(""); // Clear input
  };

  return (
    <div className="p-4 bg-gray-100 h-screen">
      <h1 className="text-3xl font-bold text-blue-600">AI Interview Trainer</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 w-full h-20 resize-none rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Type your question..."
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
      <div className="mt-4 bg-white p-4 rounded shadow overflow-y-auto h-96">
        {logs.map((log, index) => (
          <p key={index} className="mb-2">
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
