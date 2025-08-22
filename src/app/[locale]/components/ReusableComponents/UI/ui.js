import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg p-8 m-4">
      {children}
    </div>
  );
};



const Input = ({ ...props }) => {
  return (
    <input
      className="w-full bg-gray-700 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-2 transition duration-300"
      {...props}
    />
  );
};



const Textarea = ({ ...props }) => {
  return (
    <textarea
      className="w-full bg-gray-700 bg-opacity-50 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-2 transition duration-300"
      {...props}
    />
  );
};



const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
    >
      {children}
    </button>
  );
};

export  {
    Card,
    Input,
    Textarea,
    Button
};