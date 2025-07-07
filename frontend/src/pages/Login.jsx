import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
    }
  };

  const handleSendOtp = async () => {
    // Send email to backend
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    alert(data.message);
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: code })
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-400 px-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-4xl font-semibold mb-2">Login</h2>
        <p className="text-lg mb-6 text-gray-600">Welcome Back</p>
        <p className="font-semibold text-center mb-4">
          We need to verify you before getting started!
        </p>

        <div className="flex items-center border-b mb-4">
          <input
            type="email"
            placeholder="Email"
            className="flex-1 p-2 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp} className="p-2 text-xl">➤</button>
        </div>

        <div className="flex justify-between mb-6">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              maxLength={1}
              type="text"
              className="w-12 h-12 border text-center text-xl rounded"
              value={otp[i]}
              onChange={(e) => handleOtpChange(i, e.target.value)}
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOtp}
          className="w-full bg-black text-white py-3 rounded-full font-semibold mb-6"
        >
          Verify OTP
        </button>

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

export default Login;