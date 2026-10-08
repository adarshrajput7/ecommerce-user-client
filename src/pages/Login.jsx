import axios from "../api/axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
import { setLoading, setUser } from "../redux/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { setTriggerRefresh } from "@/redux/orderSlice";
import toast from "react-hot-toast";

export default function Login() {

    const dispatch = useDispatch()
    const { user, loading } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        usernameOrEmail: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(setLoading(true))
            const res = await axios.post('/api/auth/login', {
                usernameOrEmail: form.usernameOrEmail,
                password: form.password
            },

                {
                    headers: {
                        'Content-Type': 'application/json'
                    }, withCredentials: true
                })

            if (res.data.success) {
                dispatch(setUser(res.data.user))
                dispatch(setTriggerRefresh())
                toast.success(res.data.message)
                setForm({
                    usernameOrEmail: "",
                    password: "",
                });
                navigate('/')
                console.log(res)
            }

            // } catch (error) {
            //     console.log("login handler error:", error);
            //     if (error.response?.status) {
            //         toast.error(error.response.data.message);
            //     } else {
            //         toast.error(error.response?.data?.message || 'Login Failed!');
            //     }
        } catch (error) {
            console.log("login handler error:", error);
            console.log("Response data:", error.response?.data);   // ← ye add karo

            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data?.msg ||
                error.response?.data?.errors?.[0]?.msg ||
                'Login Failed!';

            toast.error(msg);
        } finally { dispatch(setLoading(false)) }

    };

    const handleGoogleAuth = () => {
        console.log("Google Auth clicked");
        // Firebase / Google OAuth yahan connect karein
    };

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center lg:px-0 px-3 bg-black/10">
                {/* //   <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"> */}
                <div className="w-full max-w-md">

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-8">
                        {/* <X onClick={() => setLoginOpen(false)} className="ml-auto block" /> */}
                        {/* Header */}
                        <div className="text-center mb-7">
                            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>

                            <p className="mt-2 text-sm text-slate-500">Login to your account</p>
                        </div>

                        {/* Google Auth */}
                        <button type="button" onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3   rounded-lg border border-slate-300 bg-white px-4 py-3   text-sm font-medium text-slate-700   hover:bg-slate-50 transition">
                            <FcGoogle size={22} />
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="text-xs text-slate-400">OR</span>

                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username / Email */}
                            <div>
                                <label
                                    htmlFor="usernameOrEmail"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    Username or Email
                                </label>

                                <input
                                    id="usernameOrEmail"
                                    type="text"
                                    name="usernameOrEmail"
                                    value={form.usernameOrEmail}
                                    onChange={handleChange}
                                    placeholder="Username or email"
                                    required
                                    className="w-full rounded-lg border border-slate-300
                           px-4 py-3 text-sm
                           outline-none transition
                           focus:border-[#00cccc]
                           focus:ring-2 focus:ring-[#00ffff]/20"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <a
                                        href="/forgot-password"
                                        className="text-xs text-[#666666] hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full rounded-lg border border-slate-300
                             px-4 py-3 pr-16 text-sm
                             outline-none transition
                             focus:border-[#00cccc]
                             focus:ring-2 focus:ring-[#00ffff]/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2
                             -translate-y-1/2
                             text-xs font-medium
                             text-[#666666]
                             hover:text-slate-900"
                                    >
                                        {showPassword ? <Eye /> : <EyeOff />}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button type="submit" className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold bg-[#00FFFF] text-[#666666] hover:bg-[#00e6e6] transition flex items-center justify-center">
                                {loading ? (<Loader2 className="animate-spin" />) : ("Login")}
                            </button>
                        </form>

                        {/* Register */}
                        <p className="text-center text-sm text-slate-500 mt-6">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="font-medium text-blue-500 hover:underline"
                            >
                                Create Account
                            </a>
                        </p>
                    </div>
                </div>
            </div>


        </>
    );
}





