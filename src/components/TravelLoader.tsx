
const TravelLoader = () => {
  return (
    <div className="relative flex items-center justify-start h-[2.8rem] w-[2.8rem]">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 left-0 flex items-center justify-start h-full w-full"
          style={{
            transform: `rotate(${i * 45}deg)`,
          }}
        >
          <div
            className="h-[20%] w-[20%] rounded-full bg-[#183153] shadow-[0_0_20px_rgba(18,31,53,0.3)] animate-dot-pulse"
            style={{
              animationDelay: `${-0.875 + i * 0.125}s`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default TravelLoader;