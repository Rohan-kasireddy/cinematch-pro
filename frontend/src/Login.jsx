import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem("user", email);
      navigate("/");
    } else {
      alert("Enter details");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
          className="w-full h-full object-cover opacity-50"
          alt="Login background"
        />
      </div>

      <div className="relative z-10 bg-black bg-opacity-70 p-8 rounded w-80">
        <h2 className="text-2xl mb-4 text-center text-red-500">CineMatch</h2>

        <input
          className="w-full p-2 mb-3 bg-gray-800 text-white rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-red-600 p-2 hover:bg-red-700 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
