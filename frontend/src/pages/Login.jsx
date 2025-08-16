import React, { useState } from 'react';
import { FaGoogle, FaGithub, FaCode, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setIsOtpSent(true);
      alert(data.message || 'OTP sent successfully!');
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 4) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      });
      const data = await res.json();
      alert(data.message || 'Login successful!');
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <FaCode className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">
            Continue your coding journey
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-600/50 shadow-2xl">
          
          {/* Verification Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
            <FaShieldAlt className="text-blue-400" />
            <span className="text-gray-300 font-medium">Secure Verification Required</span>
          </div>

          {/* Email Input Section */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-3">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-4 pl-12 pr-20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <button 
                onClick={handleSendOtp}
                disabled={!email || isLoading}
                className="absolute inset-y-0 right-0 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-r-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Send</>
                )}
              </button>
            </div>
          </div>

          {/* OTP Input Section */}
          <div className="mb-8">
            <label className="block text-gray-300 font-medium mb-3">
              Verification Code
              {isOtpSent && <span className="text-green-400 text-sm ml-2">✓ Code sent</span>}
            </label>
            <div className="flex justify-between gap-3">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  type="text"
                  className="w-14 h-14 bg-slate-700/50 border border-slate-600/50 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
                  value={otp[i]}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={otp.join('').length !== 4 || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold mb-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-800/80 to-slate-700/80 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('Google')}
              className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <FaGoogle className="text-red-400 group-hover:scale-110 transition-transform" />
              Google
            </button>
            <button 
              onClick={() => handleSocialLogin('GitHub')}
              className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <FaGithub className="text-gray-300 group-hover:scale-110 transition-transform" />
              GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              By continuing, you agree to our{' '}
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Terms of Service</span>
              {' '}and{' '}
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;