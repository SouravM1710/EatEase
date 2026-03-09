const StatsCard = ({ icon, title, value, change, changeType, gradient }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>

            <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-3">{icon}</div>

                {/* Title */}
                <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>

                {/* Value */}
                <p className="text-3xl font-bold mb-2">{value}</p>

                {/* Change indicator */}
                {change && (
                    <div className="flex items-center gap-1 text-sm">
                        <span>{changeType === "up" ? "↑" : "↓"}</span>
                        <span className="font-medium">{change}</span>
                        <span className="opacity-75">vs last week</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatsCard
