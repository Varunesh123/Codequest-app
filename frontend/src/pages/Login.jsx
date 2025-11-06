import React, { useState } from 'react';
import { FaGoogle, FaGithub, FaCode, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      console.log('Login response data:', data);
      
      if (res.ok) {
        const user = data.data?.user;
        const token = data.data?.token;

        if (user) {
          localStorage.setItem('userId', user._id);
          localStorage.setItem('userName', user.username);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userData', JSON.stringify(user)); // store full user object
        }

        if (token) {
          localStorage.setItem('authToken', token);
        }
        alert(data.message || 'Login successful!');
        // Handle successful login (e.g., save token, redirect)
        navigate('/home');
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }

    } catch (error) {
      alert('Failed to login. Please try again.');
      console.error('Login error:', error);
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
          
          <form onSubmit={handleLogin}>
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
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Input Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-gray-300 font-medium">Password</label>
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer text-sm">
                  Forgot password?
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-slate-700/70 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-8">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-600/50 bg-slate-700/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="ml-2 text-gray-400 text-sm cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold mb-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

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
            <span 
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
              onClick={() => navigate('/register')}
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;