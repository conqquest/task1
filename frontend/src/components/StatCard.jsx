export default function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white border border-black p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-black flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-[#666]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-black">{value}</h3>
          {trend && (
            <span className="text-xs font-medium text-black">
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
