import { useNavigate } from 'react-router-dom'

const ThankyouMessage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['🔸', '⭐', '🔹', '🔶', '⬥', '▸'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Badge decorative edges */}
            <div className="absolute inset-0 -z-10">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-emerald-500 rounded-sm"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-42px)`,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-6px',
                    marginTop: '-6px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
          Thank You & Welcome Aboard!
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 mb-12 animate-fade-in-delay">
          Your trip's booked — can't wait to have you on this adventure! 🛳️ Get ready to explore & make memories.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            View trip details
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to homepage
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.9s both;
        }
      `}</style>
    </div>
  )
}

export default ThankyouMessage