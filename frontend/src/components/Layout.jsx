import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const navItems = {
    PRESIDENT: [
        { to: "/dashboard", label: "Takvim", icon: "calendar" },
        { to: "/petitions/my", label: "Dilekçelerim", icon: "list" },
        { to: "/petitions/create", label: "Yeni Dilekçe", icon: "plus" },
    ],
    ADVISOR: [
        { to: "/dashboard", label: "Takvim", icon: "calendar" },
        { to: "/advisor/petitions", label: "Gelen Dilekçeler", icon: "inbox" },
    ],
    ADMIN: [
        { to: "/dashboard", label: "Takvim", icon: "calendar" },
        { to: "/admin/petitions/pending", label: "Bekleyenler", icon: "clock" },
        {
            to: "/admin/petitions/all",
            label: "Tüm Dilekçeler",
            icon: "archive",
        },
        { to: "/admin/clubs", label: "Kulüp Yönetimi", icon: "building" },
    ],
};

const roleLabels = {
    PRESIDENT: "Kulüp Başkanı",
    ADVISOR: "Danışman",
    ADMIN: "Müdür Yardımcısı",
};

const icons = {
    calendar: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    list: (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
        </svg>
    ),
    plus: (
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
                d="M12 4v16m8-8H4"
            />
        </svg>
    ),
    inbox: (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
        </svg>
    ),
    clock: (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
    archive: (
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
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
        </svg>
    ),
    building: (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
        </svg>
    ),
};

export default function Layout({ children }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const items = navItems[user?.role] || [];

    const handleLogout = () => {
        logout();
        toast.success("Çıkış yapıldı");
        navigate("/login");
    };

    return (
        <div className="min-h-screen text-ink flex">
            {/* Sidebar */}
            <aside className="w-64 bg-paper-bg border-r border-slate-300 shadow-sm flex flex-col fixed h-full z-10">
                {/* Logo */}
                <div className="p-6 border-b border-slate-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center shadow-md rotate-[2deg]">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-ink font-bold text-sm">
                                KYCUBYO
                            </h1>
                            <p className="text-slate-500 text-xs">
                                Etkinlik Onay
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `relative flex items-center px-4 py-3 rounded-lg text-sm font-bold transition-colors duration-200 outline-none focus:outline-none ${
                                    isActive
                                        ? "text-ink bg-transparent"
                                        : "text-slate-600 hover:bg-paper-input hover:text-ink"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <svg 
                                            className="absolute inset-0 w-full h-full text-yellow-400/60 pointer-events-none" 
                                            preserveAspectRatio="none" 
                                            viewBox="0 0 100 100"
                                        >
                                            <path 
                                                d="M 2 50 C 30 20 70 20 98 50 C 70 80 30 80 2 60 Z" 
                                                fill="currentColor" 
                                            />
                                        </svg>
                                    )}
                                    <div className="relative z-10 flex items-center gap-3">
                                        <span className={isActive ? "text-ink" : ""}>
                                            {icons[item.icon]}
                                        </span>
                                        {item.label}
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-slate-300">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-ink text-sm font-bold shadow-sm border border-slate-300">
                            {user?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-ink text-sm font-bold truncate">
                                {user?.username}
                            </p>
                            <p className="text-slate-500 text-xs font-medium">
                                {roleLabels[user?.role] || user?.role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 cursor-pointer"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
