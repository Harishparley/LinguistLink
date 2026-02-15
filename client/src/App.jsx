// client/src/App.jsx
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Mic, MicOff } from 'lucide-react'; // simple icons

const socket = io.connect("http://localhost:5000");

function App() {
  const [status, setStatus] = useState("Connecting...");
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs to keep track of the microphone stream without re-rendering
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => setStatus("Connected! 🟢"));
    return () => socket.off("connect");
  }, []);

  const startRecording = async () => {
    try {
      // 1. Get microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Create the recorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      // 3. When audio data is available (every few milliseconds)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Send the blob directly to the server
          socket.emit('audio-stream', event.data);
        }
      };

      // 4. Start recording (send data every 1000ms = 1 second)
      // Note: We can lower this to 250ms later for lower latency
      mediaRecorder.start(1000);
      setIsRecording(true);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop recording
      // Stop all audio tracks (turns off the red dot in browser tab)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white font-sans">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">LinguistLink 🎙️</h1>
      
      <div className="p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-center w-80">
        <p className="text-lg mb-6 font-mono text-green-400">{status}</p>

        {/* The Big Microphone Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-6 rounded-full transition-all duration-300 shadow-lg ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 animate-pulse" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
        </button>

        <p className="mt-6 text-gray-400 text-sm">
          {isRecording ? "Transmitting Audio..." : "Click to Start"}
        </p>
      </div>
    </div>
  );
}

export default App;