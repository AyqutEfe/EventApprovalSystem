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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
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
                    <div className="flex flex-col">
                        <h1 className="text-ink font-black text-3xl tracking-tight leading-none mb-1">
                            KYCUBYO
                        </h1>
                        <p className="text-slate-600 font-bold text-sm tracking-wide uppercase">
                            Etkinlik Onay
                        </p>
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
                                        <span
                                            className={
                                                isActive ? "text-ink" : ""
                                            }
                                        >
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
                <div className="p-4 border-t border-slate-300 flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-full max-w-[140px] mb-4 group cursor-default">
                        {/* Red Wax Seal Background */}
                        <svg viewBox="0 0 100 100" className="w-full h-auto drop-shadow-md text-[#8B0000]">
                            <path
                                fill="currentColor"
                                d="M50,4 C65,2 80,10 88,22 C95,33 97,48 93,62 C88,77 75,88 60,94 C46,98 30,95 18,84 C6,72 2,55 5,40 C8,25 20,12 35,6 C40,4 45,5 50,4 Z"
                            />
                            <path
                                fill="none"
                                stroke="#5c0000"
                                strokeWidth="2"
                                d="M50,12 C62,10 74,16 80,26 C86,35 88,47 84,58 C80,70 70,78 58,83 C46,87 34,84 24,76 C14,66 11,52 13,40 C16,28 26,18 38,13 C42,11 46,12 50,12 Z"
                            />
                            <circle cx="50" cy="50" r="34" fill="#A52A2A" />
                            <path
                                fill="none"
                                stroke="#cc3333"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                d="M50,17 A33,33 0 1,1 49.9,17"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center inset-0 text-[#f5f5dc] transform -rotate-[5deg] px-6">
                            <span className="text-[12px] font-black tracking-widest uppercase drop-shadow-sm text-center leading-tight line-clamp-2">
                                {user?.username}
                            </span>
                            <span className="text-[7px] font-bold tracking-widest uppercase mt-1 opacity-90 text-center line-clamp-1">
                                {roleLabels[user?.role] || user?.role}
                            </span>
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
