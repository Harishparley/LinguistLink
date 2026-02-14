// client/src/App.jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// connect to the backend
const socket = io.connect("http://localhost:5000");

function App() {
  const [status, setStatus] = useState("Connecting...");
  const [myId, setMyId] = useState("");

  useEffect(() => {
    // listen for the connection event
    socket.on("connect", () => {
      setStatus("Connected! 🟢");
      setMyId(socket.id);
    });

    // cleanup on unmount
    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white font-sans">
      <h1 className="text-4xl font-bold mb-4 text-blue-400">LinguistLink 🎙️</h1>
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center border border-gray-700">
        <p className="text-xl mb-2">Connection Status:</p>
        <p className="text-2xl font-bold text-green-400 animate-pulse">{status}</p>
        <p className="mt-4 text-gray-400 text-sm">Your Socket ID:</p>
        <code className="bg-black px-2 py-1 rounded text-yellow-300">{myId || "Waiting..."}</code>
      </div>
    </div>
  );
}

export default App;