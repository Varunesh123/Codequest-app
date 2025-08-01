import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      navigate('/login'); // Navigate to login page after successful registration
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-400 px-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-4xl font-semibold mb-2">Register</h2>
        <p className="text-lg mb-6 text-gray-600">Create your account</p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full mb-4 p-2 border rounded"
          value={user.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={user.password}
          onChange={handleChange}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-3 rounded-full font-semibold mb-4"
        >
          Register
        </button>

        <p className="text-center text-gray-600 mb-6">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 cursor-pointer underline"
          >
            Login here
          </span>
        </p>

        <p className="text-center text-gray-500 mb-4">Continue with Social Media</p>

        <div className="flex justify-around">
          <button className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2">
            <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
            Google
          </button>
          <button className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2">
            <img src="https://img.icons8.com/ios-filled/24/github.png" alt="GitHub" />
            Github
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
