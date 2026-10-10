import axios from "../api/axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
import { setLoading, setUser } from "../redux/authSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
    const [form, setForm] = useState({ username: "", firstName: "", lastName: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()
    const { user, loading } = useSelector(store => store.auth)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Register Data:", form);
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`/api/auth/register`, {
                username: form.username,
                email: form.email,
                password: form.password,
                fullName: {
                    firstName: form.firstName,
                    lastName: form.lastName
                },
                role: 'user',

            }, {
                headers: {
                    'Content-Type': 'application/json'
                }, withCredentials: true
            })

            if (res.data.success) {
                console.log("✅ User Register Data", res.data)
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                setForm({
                    username: "", firstName: "", lastName: "", email: "", password: ""
                });
                navigate('/')
            }


        } catch (error) {
            console.error("🚀 ~ handleSubmit ~ error:", error)
            if (error.response?.status) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.response?.data?.message || 'Registration failed!');
            }
        } finally { dispatch(setLoading(false)) }
    };

    const handleGoogleAuth = () => {
        toast.error("Limits Reached")
    };

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center lg:px-0 px-5 bg-black/10">
            <div className="w-full max-w-xs">
                <div className="bg-white rounded-sm shadow-xl border border-slate-200 p-3 sm:p-5">
                    <div className="text-center mb-3">
                        <h1 className="text-lg font-bold text-slate-900">
                            Create Account
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-400 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                        <FcGoogle size={18} />
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 my-2">
                        <div className="h-px flex-1 bg-slate-300" />
                        <span className="text-[10px] text-slate-400">OR</span>
                        <div className="h-px flex-1 bg-slate-300" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2.5">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none transition focus:border-[#00cccc] focus:ring-2 focus:ring-[#00ffff]/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none transition focus:border-[#00cccc] focus:ring-2 focus:ring-[#00ffff]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none transition focus:border-[#00cccc] focus:ring-2 focus:ring-[#00ffff]/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none transition focus:border-[#00cccc] focus:ring-2 focus:ring-[#00ffff]/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-xs outline-none transition focus:border-[#00cccc] focus:ring-2 focus:ring-[#00ffff]/20"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                                >
                                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            </div>

                            <p className="mt-1 text-[10px] text-slate-400">
                                Password must be at least 8 characters.
                            </p>
                        </div>

                        <label className="flex items-start gap-2 text-xs text-slate-500">
                            <input
                                type="checkbox"
                                required
                                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 accent-[#00FFFF] focus:ring-blue-500"
                            />
                            <span>
                                I agree to the{" "}
                                <a href="" className="text-blue-600 hover:underline">
                                    Terms & Conditions
                                </a>
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="w-full rounded-sm px-3 py-2 text-xs font-semibold bg-[#00FFFF] text-[#666666] hover:bg-[#00e6e6] transition flex items-center justify-center border border-[#666666]"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 mt-3">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}