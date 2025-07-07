
import { FaHome, FaUserCog } from 'react-icons/fa';
import { BiLaptop } from 'react-icons/bi';
import { MdCompareArrows } from 'react-icons/md';

const Profile = () => {
  return (
    <div className="w-64 h-screen bg-[#0d1117] text-white flex flex-col justify-between p-6">
      {/* Profile Section */}
      <div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <h3 className="text-lg font-semibold">Guest User</h3>
            <p className="text-sm text-gray-400">Coder</p>
          </div>
        </div>

        <hr className="border-gray-600 mb-6" />

        {/* Navigation Links */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 hover:text-blue-400 cursor-pointer">
            <FaHome className="text-xl" />
            <span className="text-md font-medium">Home</span>
          </div>

          <div className="flex items-center space-x-3 hover:text-blue-400 cursor-pointer">
            <BiLaptop className="text-xl" />
            <span className="text-md font-medium">POTD Challenge</span>
          </div>

          <div className="flex items-center space-x-3 hover:text-blue-400 cursor-pointer">
            <MdCompareArrows className="text-xl" />
            <span className="text-md font-medium">Compare Profiles</span>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-black px-4 py-3 flex items-center space-x-3 rounded-md hover:bg-gray-900 cursor-pointer">
        <FaUserCog className="text-xl" />
        <span className="font-semibold text-sm">Profile Settings</span>
      </div>
    </div>
  );
};

export default Profile;


