import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          .animate-float {
            animation: float 3s infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in-out;
          }
        `}
      </style>

      <div className="text-center animate-fadeIn">
        <img
          src="https://yemca-services.net/404.png"
          alt="404 Illustration"
          className="mx-auto w-80 animate-float shadow-xl rounded-lg"
        />
        <h1 className="text-7xl font-extrabold text-blue-700 mt-6">
          Looks Like You're Lost!
        </h1>
        <p className="text-xl text-gray-700 mt-2">
          We can't seem to find the page you're looking for.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform transition hover:scale-105 hover:bg-blue-700"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
