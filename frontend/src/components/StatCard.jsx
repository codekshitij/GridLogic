const StatCard = ({ title, value, unit, trend, icon: Icon }) => (
  <div className="bg-[#111] border border-white/5 p-4 rounded-2xl hover:border-f1-red/50 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
        {title}
      </span>
      {Icon && (
        <Icon
          size={16}
          className="text-gray-600 group-hover:text-f1-red transition-colors"
        />
      )}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-black italic">{value}</span>
      <span className="text-xs font-bold text-gray-600">{unit}</span>
    </div>
    {trend && (
      <div
        className={`text-[10px] mt-2 font-bold ${trend > 0 ? "text-green-500" : "text-red-500"}`}
      >
        {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs Prev. Lap
      </div>
    )}
  </div>
);

export default StatCard;
