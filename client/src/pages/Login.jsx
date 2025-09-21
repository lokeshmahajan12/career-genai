import { useState } from "react";
import { api } from "../lib/api"; // make sure api baseURL is correct
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    try {
      setLoading(true);
      setMessage("");

      // ✅ Use full backend route
      const { data } = await api.post("/api/auth/login", { email, password });

      // Save token
      localStorage.setItem("token", data.token);

      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        nav("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Invalid credentials, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 card">
      <h2 className="text-2xl font-bold">Welcome back</h2>

      {message && (
        <div
          className={`mt-3 p-2 rounded text-sm ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <input
        className="input mt-4"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input mt-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="btn btn-primary w-full mt-4"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm mt-3">
        No account?{" "}
        <a className="underline text-blue-600" href="/register">
          Sign up
        </a>
      </p>
    </div>
  );
}
