import React, { useState } from 'react';
import { 
  FaArrowLeft, 
  FaUser, 
  FaBell, 
  FaMoon, 
  FaSun, 
  FaLock, 
  FaHome, 
  FaSave 
} from 'react-icons/fa';

const ProfileSetting = ({ userData = {
  name: 'Guest User',
  email: 'guest@example.com',
  bio: 'Full Stack Developer',
  notifications: true,
  theme: 'dark'
}, onBack, handlePageNavigation }) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    bio: userData.bio,
    notifications: userData.notifications,
    theme: userData.theme
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    // Password validation
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (passwordData.newPassword.length < 8) {
        setError('New password must be at least 8 characters long');
        return;
      }
    }

    // Simulate save
    console.log('Saving profile:', formData);
    if (passwordData.newPassword) {
      console.log('Updating password');
    }
    setSuccess('Profile updated successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-300 group"
            >
              <FaArrowLeft className="text-gray-400 group-hover:text-white" />
              <span className="text-gray-400 group-hover:text-white font-medium">Back to Profile</span>
            </button>
          </div>
          <button
            onClick={() => handlePageNavigation && handlePageNavigation('/home')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300"
          >
            <FaHome className="text-gray-400" />
            <span className="text-gray-300">Home</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 lg:p-8 rounded-2xl border border-slate-500/50">
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
            Profile Settings
          </h1>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
              {success}
            </div>
          )}

          {/* Profile Information Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <FaUser className="text-blue-400" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-slate-600"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-slate-600"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-slate-600"
                    placeholder="Tell us about yourself"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Notification and Theme Settings */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <FaBell className="text-green-400" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className="text-gray-300">Enable Email Notifications</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-gray-300 text-sm font-medium">Theme</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        formData.theme === 'dark' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      <FaMoon />
                      Dark
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        formData.theme === 'light' 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      <FaSun />
                      Light
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <FaLock className="text-red-400" />
              Change Password
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 border border-slate-600"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 border border-slate-600"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 border border-slate-600"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105"
            >
              <FaSave />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;