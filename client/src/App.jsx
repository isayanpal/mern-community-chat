import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }
  }, []);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("chat message");
    };
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching user data:", error.message);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      fetchUserData(response.data.token);
    } catch (error) {
      console.log("Error registering:", error.message);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      fetchUserData(response.data.token);
    } catch (error) {
      console.log("Error logging in:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("chat message", inputMessage);
      setInputMessage("");
    }
  };
  return (
    <div>
      <h1>Community Chat</h1>
      {user ? (
        <div>
          <Logout onLogout={handleLogout} />
          <div>
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      ) : (
        <div>
          <Register onRegister={handleRegister} />
          <Login onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;
