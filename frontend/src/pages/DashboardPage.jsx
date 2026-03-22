import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { petitionService } from "../services/petitionService";
import Calendar from "../components/Calendar";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [petitions, setPetitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const fetchCalendarData = async () => {
        try {
            const response = await petitionService.getCalendar();
            setPetitions(response.data);
        } catch (error) {
            toast.error("Takvim verileri yüklenirken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    // İstatistikler
    const stats = {
        total: petitions.length,
        approved: petitions.filter((p) => p.status === "APPROVED").length,
        pendingAdvisor: petitions.filter((p) => p.status === "PENDING_ADVISOR")
            .length,
        pendingAdmin: petitions.filter((p) => p.status === "PENDING_ADMIN")
            .length,
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-ink">
                    Hoş geldiniz,{" "}
                    <span className="text-slate-700">{user?.username}</span>
                </h1>
                <p className="text-slate-600 mt-1">
                    Etkinlik takvimini inceleyin
                </p>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-4 gap-6 mb-8 mt-4">
                <div className="paper-card crumpled pinned pt-8 pb-4 px-4 rotate-[1deg]">
                    <div className="pin"></div>
                    <p className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-1 relative z-10">
                        Toplam Etkinlik
                    </p>
                    <p className="text-3xl font-bold text-ink relative z-10">
                        {stats.total}
                    </p>
                </div>
                <div className="paper-card crumpled pinned pt-8 pb-4 px-4 -rotate-[1deg]">
                    <div className="pin"></div>
                    <p className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-1 relative z-10">
                        Onaylanmış
                    </p>
                    <p className="text-3xl font-bold text-emerald-800 relative z-10">
                        {stats.approved}
                    </p>
                </div>
                <div className="paper-card crumpled pinned pt-8 pb-4 px-4 rotate-[2deg]">
                    <div className="pin"></div>
                    <p className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-1 relative z-10">
                        Danışman Onayı Bekliyor
                    </p>
                    <p className="text-3xl font-bold text-amber-800 relative z-10">
                        {stats.pendingAdvisor}
                    </p>
                </div>
                <div className="paper-card crumpled pinned pt-8 pb-4 px-4 -rotate-[2deg]">
                    <div className="pin"></div>
                    <p className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-1 relative z-10">
                        Müdür Onayı Bekliyor
                    </p>
                    <p className="text-3xl font-bold text-sky-800 relative z-10">
                        {stats.pendingAdmin}
                    </p>
                </div>
            </div>

            {/* Takvim */}
            <Calendar petitions={petitions} />
        </div>
    );
}
