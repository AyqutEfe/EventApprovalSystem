import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login({ username, password });
            const { token, username: user, role } = response.data;
            login(token, user, role);
            toast.success("Giriş başarılı!");
            navigate("/dashboard");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper-desk flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo / Başlık */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <h1 className="text-4xl font-black text-ink tracking-tight mb-2">
                        KYCUBYO
                        <br />
                        <span className="text-2xl font-bold tracking-wide uppercase text-slate-700">Etkinlik Onay</span>
                    </h1>
                    <p className="text-slate-600 mt-1 font-medium">
                        Hesabınıza giriş yapın
                    </p>
                </div>

                {/* Form Kartı */}
                <div className="paper-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-bold text-ink mb-1.5"
                            >
                                Kullanıcı Adı
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition shadow-sm"
                                placeholder="Kullanıcı adınız"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-bold text-ink mb-1.5"
                            >
                                Şifre
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition shadow-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-paper-input border-2 border-ink text-ink font-bold text-lg rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] active:translate-y-[4px] active:shadow-none"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Giriş yapılıyor...
                                </span>
                            ) : (
                                "Giriş Yap"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-600 text-sm mt-6">
                        Hesabınız yok mu?{" "}
                        <Link
                            to="/register"
                            className="text-ink font-bold hover:underline transition"
                        >
                            Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
