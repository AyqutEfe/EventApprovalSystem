import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { petitionService } from "../../services/petitionService";
import toast from "react-hot-toast";

import { format } from "date-fns";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Turkish } from "flatpickr/dist/l10n/tr.js";

import Modal from "../../components/Modal";

const schema = z.object({
    eventName: z.string().min(1, "Etkinlik adı boş olamaz"),
    eventStartDate: z.string().min(1, "Etkinlik başlangıç tarihi boş olamaz"),
    eventEndDate: z.string().min(1, "Etkinlik bitiş tarihi boş olamaz"),
    eventStartTime: z.string().min(1, "Etkinlik başlangıç saati boş olamaz"),
    eventEndTime: z.string().min(1, "Etkinlik bitiş saati boş olamaz"),
    location: z.string().min(1, "Etkinlik yeri boş olamaz"),
    eventContent: z.string().min(1, "Etkinlik içeriği boş olamaz"),
    supportInfo: z.string().optional(),
});

export default function CreatePetitionPage() {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [conflictMessage, setConflictMessage] = useState("");
    const [pendingData, setPendingData] = useState(null);
    const [speakers, setSpeakers] = useState([]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const startDate = watch("eventStartDate");
    const dateRangeRef = useRef(null);

    const addSpeaker = () => {
        setSpeakers([...speakers, { fullName: "", title: "", company: "" }]);
    };

    const removeSpeaker = (index) => {
        setSpeakers(speakers.filter((_, i) => i !== index));
    };

    const updateSpeaker = (index, field, value) => {
        const updated = [...speakers];
        updated[index] = { ...updated[index], [field]: value };
        setSpeakers(updated);
    };

    const checkConflictsAndSubmit = async (data) => {
        // Konuşmacıları JSON olarak ekle
        const filledSpeakers = speakers.filter(
            (s) => s.fullName.trim() || s.title.trim(),
        );
        const submitData = {
            ...data,
            speakerInfo:
                filledSpeakers.length > 0
                    ? JSON.stringify(filledSpeakers)
                    : null,
        };

        setLoading(true);
        try {
            const { data: events } = await petitionService.checkDate(
                data.eventStartDate,
                data.eventEndDate,
            );

            if (events && events.length > 0) {
                const eventNames = events.map((e) => e.eventName).join(", ");
                setConflictMessage(
                    `Bu tarihler arasında ${eventNames} adlı etkinlik(ler) var. Yine de talep göndermek istiyor musunuz?`,
                );
                setPendingData(submitData);
                setModalOpen(true);
                setLoading(false);
            } else {
                doSubmit(submitData);
            }
        } catch (error) {
            toast.error("Tarih kontrolü yapılamadı.");
            setLoading(false);
        }
    };

    const doSubmit = async (dataToSubmit) => {
        setLoading(true);
        setModalOpen(false);
        try {
            await petitionService.create(dataToSubmit);
            toast.success("Dilekçe başarıyla oluşturuldu!");
            navigate("/petitions/my");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Dilekçe oluşturulurken hata oluştu";
            toast.error(message);
        } finally {
            setLoading(false);
            setPendingData(null);
        }
    };

    const inputClass =
        "w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition shadow-sm";

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-ink">
                    Yeni Dilekçe Oluştur
                </h1>
                <p className="text-slate-600 mt-1">
                    Etkinlik bilgilerini girerek yeni bir dilekçe oluşturun
                </p>
            </div>

            <div className="paper-card p-8">
                <form
                    onSubmit={handleSubmit(checkConflictsAndSubmit)}
                    className="space-y-6"
                >
                    {/* Etkinlik Adı */}
                    <div>
                        <label className="block text-sm font-bold text-ink mb-1.5">
                            Etkinliğin İsmi
                        </label>
                        <input
                            {...register("eventName")}
                            className={inputClass}
                            placeholder="Örn: Bilgisayar Mühendisliği Semineri"
                        />
                        {errors.eventName && (
                            <p className="text-rose-600 font-medium text-xs mt-1">
                                {errors.eventName.message}
                            </p>
                        )}
                    </div>

                    {/* Gizli Alanlar - React Hook Form State İçin */}
                    <input type="hidden" {...register("eventStartDate")} />
                    <input type="hidden" {...register("eventEndDate")} />
                    <input type="hidden" {...register("eventStartTime")} />
                    <input type="hidden" {...register("eventEndTime")} />

                    {/* Tarih ve Saat seçim alanı */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Tarih Seçimi */}
                        <div>
                            <label className="block text-sm font-bold text-ink mb-1.5">
                                Etkinlik Tarih Aralığı
                            </label>
                            <div className="relative">
                                <Flatpickr
                                    ref={dateRangeRef}
                                    options={{
                                        mode: "range",
                                        locale: Turkish,
                                        dateFormat: "Y-m-d",
                                        minDate: "today",
                                    }}
                                    className={`${inputClass} ${startDate ? "pr-10" : ""}`}
                                    placeholder="Başlangıç ve Bitiş Tarihi"
                                    onChange={(dates) => {
                                        if (dates.length > 0) {
                                            setValue(
                                                "eventStartDate",
                                                format(dates[0], "yyyy-MM-dd"),
                                            );
                                            clearErrors("eventStartDate");
                                        } else {
                                            setValue("eventStartDate", "");
                                        }

                                        if (dates.length === 2) {
                                            setValue(
                                                "eventEndDate",
                                                format(dates[1], "yyyy-MM-dd"),
                                            );
                                            clearErrors("eventEndDate");
                                        } else {
                                            setValue("eventEndDate", "");
                                        }
                                    }}
                                />
                                {startDate && (
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition cursor-pointer p-1"
                                        onClick={() => {
                                            setValue("eventStartDate", "");
                                            setValue("eventEndDate", "");
                                            dateRangeRef.current?.flatpickr?.clear();
                                        }}
                                        title="Tarihi Temizle"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {(errors.eventStartDate || errors.eventEndDate) && (
                                <p className="text-rose-600 font-medium text-xs mt-1">
                                    Lütfen tarih aralığını tam olarak seçiniz.
                                </p>
                            )}
                        </div>

                        {/* Saat Seçimi */}
                        <div>
                            <label className="block text-sm font-bold text-ink mb-1.5">
                                Etkinlik Saat Aralığı
                            </label>
                            <div
                                className={`flex items-center gap-2 ${inputClass} !py-0 h-[50px]`}
                            >
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true,
                                        locale: Turkish,
                                    }}
                                    className="w-full bg-transparent focus:outline-none text-ink text-center h-full"
                                    placeholder="Başlangıç"
                                    onChange={(dates) => {
                                        if (dates.length > 0) {
                                            setValue(
                                                "eventStartTime",
                                                format(dates[0], "HH:mm"),
                                            );
                                            clearErrors("eventStartTime");
                                        } else {
                                            setValue("eventStartTime", "");
                                        }
                                    }}
                                />
                                <span className="text-slate-400 font-bold">
                                    -
                                </span>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true,
                                        locale: Turkish,
                                    }}
                                    className="w-full bg-transparent focus:outline-none text-ink text-center h-full"
                                    placeholder="Bitiş"
                                    onChange={(dates) => {
                                        if (dates.length > 0) {
                                            setValue(
                                                "eventEndTime",
                                                format(dates[0], "HH:mm"),
                                            );
                                            clearErrors("eventEndTime");
                                        } else {
                                            setValue("eventEndTime", "");
                                        }
                                    }}
                                />
                            </div>
                            {(errors.eventStartTime || errors.eventEndTime) && (
                                <p className="text-rose-600 font-medium text-xs mt-1">
                                    Lütfen saat aralığını eksiksiz seçiniz.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Etkinlik Yeri */}
                    <div>
                        <label className="block text-sm font-bold text-ink mb-1.5">
                            Etkinlik Yeri
                        </label>
                        <input
                            {...register("location")}
                            className={inputClass}
                            placeholder="Örn: Balkan Yerleşkesi Amfi"
                        />
                        {errors.location && (
                            <p className="text-rose-600 font-medium text-xs mt-1">
                                {errors.location.message}
                            </p>
                        )}
                    </div>

                    {/* Etkinliğin İçeriği */}
                    <div>
                        <label className="block text-sm font-bold text-ink mb-1.5">
                            Etkinliğin İçeriği
                        </label>
                        <textarea
                            {...register("eventContent")}
                            rows={4}
                            className={`${inputClass} resize-none`}
                            placeholder="Etkinlik hakkında detaylı açıklama..."
                        />
                        {errors.eventContent && (
                            <p className="text-rose-600 font-medium text-xs mt-1">
                                {errors.eventContent.message}
                            </p>
                        )}
                    </div>

                    {/* Destek Bilgisi */}
                    <div>
                        <label className="block text-sm font-bold text-ink mb-1.5">
                            Etkinliğe Destek Veren Kurum ve Desteğin Niteliği
                            <span className="text-slate-400 font-normal ml-1">
                                (opsiyonel)
                            </span>
                        </label>
                        <textarea
                            {...register("supportInfo")}
                            rows={2}
                            className={`${inputClass} resize-none`}
                            placeholder="Örn: Trakya Üniversitesi — Salon ve teknik ekipman desteği"
                        />
                    </div>

                    {/* Konuşmacılar — Dinamik Liste */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-ink">
                                Konuşmacılar
                                <span className="text-slate-400 font-normal ml-1">
                                    (opsiyonel)
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={addSpeaker}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-ink bg-paper-input border border-slate-300 rounded-lg hover:bg-paper-bg transition cursor-pointer shadow-sm"
                            >
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
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Konuşmacı Ekle
                            </button>
                        </div>

                        {speakers.length === 0 && (
                            <p className="text-slate-400 text-xs italic">
                                Henüz konuşmacı eklenmedi.
                            </p>
                        )}

                        <div className="space-y-3">
                            {speakers.map((speaker, index) => (
                                <div
                                    key={index}
                                    className="bg-paper-input border border-slate-300 rounded-xl p-4 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeSpeaker(index)}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                        title="Konuşmacıyı Sil"
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
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <p className="text-xs font-bold text-slate-500 mb-2">
                                        Konuşmacı {index + 1}
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                Adı Soyadı
                                            </label>
                                            <input
                                                type="text"
                                                value={speaker.fullName}
                                                onChange={(e) =>
                                                    updateSpeaker(
                                                        index,
                                                        "fullName",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-3 py-2 bg-paper-input border border-slate-300 rounded-lg text-ink text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                                                placeholder="Örn: Prof. Dr. Ahmet Yılmaz"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                Şirket/Kurum
                                            </label>
                                            <input
                                                type="text"
                                                value={speaker.company}
                                                onChange={(e) =>
                                                    updateSpeaker(
                                                        index,
                                                        "company",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-3 py-2 bg-paper-input border border-slate-300 rounded-lg text-ink text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                                                placeholder="Örn: Trakya Üniversitesi"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                Ünvanı
                                            </label>
                                            <input
                                                type="text"
                                                value={speaker.title}
                                                onChange={(e) =>
                                                    updateSpeaker(
                                                        index,
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-3 py-2 bg-paper-input border border-slate-300 rounded-lg text-ink text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                                                placeholder="Örn: Öğretim Üyesi"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/petitions/my")}
                            className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-ink hover:bg-paper-bg bg-paper-input border border-slate-300 shadow-sm rounded-xl transition cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-ink hover:bg-slate-800 text-white font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                            {loading ? "İşleniyor..." : "Dilekçe Oluştur"}
                        </button>
                    </div>
                </form>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setPendingData(null);
                }}
                onConfirm={() => doSubmit(pendingData)}
                title="Takvim Çakışması"
                message={conflictMessage}
                confirmText="Yine De Gönder"
                confirmColor="blue"
                loading={loading}
            />
        </div>
    );
}
