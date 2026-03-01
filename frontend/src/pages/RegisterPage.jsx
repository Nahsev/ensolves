import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "").replace(/\/+notes\/*$/, "");
export default function RegisterPage() {

  useEffect(() => {
    localStorage.removeItem("username");
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter a username and a password.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("User registered successfully");
      await handleLogin();
    } catch (err) {
      console.log(err);
      alert("Error connecting to server");
    }
  };

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") return;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("username", username);
      localStorage.setItem("token", data.token);

      navigate(`/${username}`);
    } catch (err) {
      console.log(err);
      alert("Error connecting to server");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleRegister}>Register</button>
        <button type="button" onClick={handleLogin}>Login</button>

      </form>
    </div>
  );
}
