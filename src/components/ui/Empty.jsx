import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ onCreateTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-md p-12 text-center"
    >
      <div className="bg-gradient-to-r from-primary-100 to-primary-200 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
        <ApperIcon name="CheckSquare" className="w-12 h-12 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Get started by creating your first task. Stay organized and boost your productivity!
      </p>
      <Button onClick={onCreateTask} variant="accent" size="lg">
        <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
        Create Your First Task
      </Button>
    </motion.div>
  );
};

export default Empty;