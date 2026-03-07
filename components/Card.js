export default function Card({ card, onClick, disabled }) {
  const bgColors = {
    red: "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]",
    blue: "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]",
    green: "bg-green-600 shadow-[0_0_10px_rgba(22,163,74,0.5)]",
    yellow: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
    black: "bg-gray-900 border-cyan-400 border-2 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
  };

  return (
    <div 
      onClick={!disabled ? onClick : null}
      className={`${bgColors[card.color]} w-16 h-24 sm:w-20 sm:h-32 rounded-xl flex flex-col items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:-translate-y-4 hover:scale-110 active:scale-95'}`}
    >
      <span className="text-xs uppercase opacity-80">{card.color !== 'black' ? card.color : 'Wild'}</span>
      <span className="text-2xl sm:text-3xl">{card.value}</span>
    </div>
  );
}
