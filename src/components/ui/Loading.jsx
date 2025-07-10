import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 border-l-4 border-l-gray-200"
        >
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mt-1" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
                <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16" />
                <div className="h-5 bg-gray-200 rounded-full animate-pulse w-12" />
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;