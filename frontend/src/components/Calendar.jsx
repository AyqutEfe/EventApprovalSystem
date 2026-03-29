import { useState, useMemo } from "react";
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    isSameMonth,
    isSameDay,
    isToday,
} from "date-fns";
import { tr } from "date-fns/locale";
import StatusBadge from "./StatusBadge";

const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const statusColors = {
    PENDING_ADVISOR: "bg-amber-200 text-ink",
    PENDING_ADMIN: "bg-blue-200 text-ink",
    APPROVED: "bg-emerald-200 text-ink",
};

export default function Calendar({ petitions = [] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    // Tarihe göre etkinlikleri grupla
    const eventsByDate = useMemo(() => {
        const map = {};
        petitions.forEach((p) => {
            if (!p.eventStartDate) return;
            const start = new Date(p.eventStartDate);
            const end = new Date(p.eventEndDate || p.eventStartDate);
            // Ignore time portion for date mapping
            let current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            
            while (current <= endDay) {
                const dateKey = format(current, "yyyy-MM-dd");
                if (!map[dateKey]) map[dateKey] = [];
                map[dateKey].push(p);
                current.setDate(current.getDate() + 1);
            }
        });
        return map;
    }, [petitions]);

    // Takvim günlerini oluştur
    const days = [];
    let day = calStart;
    while (day <= calEnd) {
        days.push(day);
        day = addDays(day, 1);
    }

    // Seçili günün etkinlikleri
    const selectedDateKey = selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : null;
    const selectedEvents = selectedDateKey
        ? eventsByDate[selectedDateKey] || []
        : [];

    return (
        <div>
            {/* Takvim Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink">
                    {format(currentMonth, "MMMM yyyy", { locale: tr })}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            setCurrentMonth(subMonths(currentMonth, 1))
                        }
                        className="p-2 rounded-lg bg-paper-input border border-slate-300 shadow-sm hover:bg-paper-bg text-slate-700 hover:text-ink transition cursor-pointer"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date())}
                        className="px-3 py-1.5 text-sm font-bold rounded-lg bg-paper-input border border-slate-300 shadow-sm hover:bg-paper-bg text-slate-700 hover:text-ink transition cursor-pointer"
                    >
                        Bugün
                    </button>
                    <button
                        onClick={() =>
                            setCurrentMonth(addMonths(currentMonth, 1))
                        }
                        className="p-2 rounded-lg bg-paper-input border border-slate-300 shadow-sm hover:bg-paper-bg text-slate-700 hover:text-ink transition cursor-pointer"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Lejant */}
            <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="text-xs text-slate-500">
                        Danışman Bekleniyor
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500/80" />
                    <span className="text-xs text-slate-500">
                        Müdür Bekleniyor
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-slate-500">Onaylandı</span>
                </div>
            </div>

            <div className="paper-card crumpled pinned pt-8 pb-2 px-3 rotate-[0.5deg] overflow-hidden">
                <div className="pin"></div>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-slate-300 relative z-10">
                    {WEEKDAYS.map((d) => (
                        <div
                            key={d}
                            className="py-1.5 text-center text-[10px] font-medium text-slate-500 uppercase tracking-wider"
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Takvim Gövdesi */}
                <div className="grid grid-cols-7">
                    {days.map((day, i) => {
                        const dateKey = format(day, "yyyy-MM-dd");
                        const dayEvents = eventsByDate[dateKey] || [];
                        const inMonth = isSameMonth(day, currentMonth);
                        const isSelected =
                            selectedDate && isSameDay(day, selectedDate);
                        const today = isToday(day);

                        return (
                            <div
                                key={i}
                                onClick={() =>
                                    setSelectedDate(
                                        isSameDay(day, selectedDate)
                                            ? null
                                            : day,
                                    )
                                }
                                className={`min-h-[76px] p-2 border-b border-r border-slate-300 cursor-pointer transition-colors
                  ${inMonth ? "" : "opacity-30"}
                  ${isSelected ? "bg-yellow-500/20 ring-1 ring-inset ring-amber-600" : "hover:bg-paper-input"}
                `}
                            >
                                <div
                                    className={`text-xs font-medium mb-0.5 w-6 h-6 flex items-center justify-center rounded-full
                  ${today ? "bg-ink text-white" : "text-ink"}
                `}
                                >
                                    {format(day, "d")}
                                </div>

                                <div className="space-y-1">
                                    {dayEvents.slice(0, 3).map((ev, j) => (
                                        <div
                                            key={j}
                                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate ${statusColors[ev.status] || "bg-slate-200 text-ink"}`}
                                            title={`${ev.eventName} — ${ev.clubName}`}
                                        >
                                            {ev.eventName}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[10px] text-slate-500 px-1.5">
                                            +{dayEvents.length - 3} daha
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Seçili Gün Detayı */}
            {selectedDate && (
                <div className="mt-4 paper-card crumpled pinned pt-8 pb-4 px-4 -rotate-[0.5deg]">
                    <div className="pin"></div>
                    <h3 className="text-base font-bold text-ink mb-2 relative z-10">
                        {format(selectedDate, "d MMMM yyyy, EEEE", {
                            locale: tr,
                        })}
                    </h3>

                    <div className="relative z-10">
                        {selectedEvents.length === 0 ? (
                            <p className="text-slate-600 text-sm">
                                Bu tarihte planlanmış etkinlik bulunmuyor.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {selectedEvents.map((ev) => (
                                    <div
                                        key={ev.id}
                                        className="flex items-center justify-between bg-paper-input border border-slate-300 shadow-sm rounded-xl p-4"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-ink font-bold truncate">
                                                    {ev.eventName}
                                                </h4>
                                                <StatusBadge
                                                    status={ev.status}
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <svg
                                                        className="w-3.5 h-3.5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                    {ev.clubName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg
                                                        className="w-3.5 h-3.5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    {ev.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg
                                                        className="w-3.5 h-3.5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    {ev.createdByUsername}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
