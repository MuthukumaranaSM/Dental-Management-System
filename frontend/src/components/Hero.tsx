import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Transform Your Dental Practice
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Streamline your dental practice management with our comprehensive solution
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300">
                Get Started
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="w-full h-96 bg-blue-500 rounded-lg shadow-2xl transform rotate-3"></div>
              <div className="absolute top-0 left-0 w-full h-96 bg-blue-400 rounded-lg shadow-2xl transform -rotate-3"></div>
              <div className="absolute top-0 left-0 w-full h-96 bg-white rounded-lg shadow-2xl">
                {/* Add your hero image here */}
                <div className="w-full h-full flex items-center justify-center text-blue-600">
                  <span className="text-2xl font-semibold">Hero Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero; 
