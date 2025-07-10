import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary to-primary-700 p-2 rounded-lg">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-xs text-gray-500">Organize your tasks efficiently</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <>
                <div className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.emailAddress}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <div className="text-sm text-gray-600">
                Stay productive, stay focused
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;