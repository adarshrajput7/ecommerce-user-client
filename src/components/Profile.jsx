import { useDispatch, useSelector } from "react-redux";
import { MapPin, Phone, Check, Trash, Loader, LogOut, Save, SquarePlus, Loader2, ArrowRight, LucideTruck, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, } from "./ui/alert-dialog";
import { useState } from "react";
import axios from "../api/axios";
// import { toast } from "react-toastify";
import { logout, setLoading, setUser } from "@/redux/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import Order from "./cart/Orders";
import toast from "react-hot-toast";

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useSelector(store => store.auth)
    console.log(user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [editAddress, setEditAddress] = useState({
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        phone: "",

    });

    const logoutHandler = async () => {
        try {

            const res = await axios.get(`/api/auth/logout`, {
                withCredentials: true
            })

            if (res.data.success) {
                dispatch(logout())
                toast.success(res.data.message)
                navigate('/')
            }

        } catch (error) {
            console.error("🚀 ~ logoutHnadler ~ error:", error)
            toast.error(error.response?.data?.message || "Internal server error")
        }
    }

    const deleteAddressHandle = async (id) => {
        try {

            const res = await axios.delete(`/api/auth/users/me/addresses/${id}`, {
                withCredentials: true
            })

            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
            }

        } catch (error) {
            console.error("🚀 ~ deleteAddressHandle ~ error:", error)
            toast.error(error.response?.data?.message || "Internal server error")
        }
    }

    const editAddressEvent = async (e) => {
        e.preventDefault()
        setEditAddress({
            ...editAddress,
            [e.target.name]: e.target.value,
        });
        console.log('cahnge', editAddress)
    }


    const addAddressHandler = async () => {
        try {
            setLoading(true)
            const res = await axios.post(`/api/auth/users/me/addresses`, {
                "street": editAddress.street,
                "city": editAddress.city,
                "state": editAddress.state,
                "pincode": editAddress.pincode,
                "country": editAddress.country,
                "phone": editAddress.phone,
                "isDefault": false
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }, withCredentials: true
            })

            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                setEditAddress({
                    street: "",
                    city: "",
                    state: "",
                    pincode: "",
                    country: "",
                    phone: "",

                });
                setIsOpen(false)
            }

        } catch (error) {
            console.error("🚀 ~ addAddressHandler ~ error:", error);

            const responseData = error.response?.data;

            if (responseData?.errors?.length) {
                responseData.errors.forEach((err) => {
                    toast.error(err.msg);
                });
            } else if (responseData?.message) {
                toast.error(responseData.message);
            } else if (responseData?.detail) {
                toast.error(responseData.detail);
            } else {
                toast.error("Something went wrong!");
            }
        }

        finally { setLoading(false) }
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const firstName = user.fullName?.firstName || "";
    const lastName = user.fullName?.lastName || "";

    // const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();



    return (
        <section className="flex min-h-[50vh] items-center justify-center bg-slate-50 p-4 sm:p-6 mt-20">



            <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">

                <div className="flex items-center p-3 gap-1 text-sm text-gray-600">
                    <span onClick={()=>navigate('/')}>Home</span><ChevronRight size={14} /><span className="text-gray-600">Profile</span>
                </div>

                <Button variant="none" onClick={() => navigate('/cart/order')} className={`lg:w-1/4 ml-4 lg:mt-10 mt-5 bg-gray-100  hover:bg-gray-200`}>View My Orders <LucideTruck /> <ArrowRight /></Button>

                {/* Content */}
                <div className="p-5 sm:p-8 items-center">

                    <div className="mb-5 flex items-center justify-between">
                        <div className="w-full">
                            <div className="flex justify-between">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Account Information
                                </h2>
                                <Button onClick={logoutHandler} variant="outline" className="gap-2 border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                                    <LogOut size={17} />
                                    Logout
                                </Button>

                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Your personal account details
                            </p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {/* Full Name */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Full Name
                            </p>
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {firstName} {lastName}
                            </p>
                        </div>

                        {/* Username */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Username
                            </p>
                            <p className="truncate text-sm font-semibold text-slate-800">
                                @{user.username}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Email Address
                            </p>
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {user.email}
                            </p>
                        </div>


                    </div>




                    {/* Address */}
                    <div className="mt-5 ">
                        <Button onClick={() => setIsOpen(true)} className='mb-2 text-black'><SquarePlus /> Add Address</Button>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-800">Saved Addresses</h2>
                            <span className="text-sm text-slate-400">
                                {user.addresses?.length}/4
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {user.addresses?.map((address, index) => (
                                <div key={address._id || index} className="relative rounded-xl border border-slate-200 p-4 hover:border-indigo-3 transition">
                                    <div className="absolute right-4">
                                        {/* <button onClick={() => deleteAddressHandle(address._id)} className="text-red-500"><Trash /></button> */}
                                        <button
                                            onClick={() => deleteAddressHandle(address._id)} className="  text-red-500  p-2 rounded-full  transition-all duration-150  hover:bg-red-100  hover:text-red-600  hover:scale-110  active:scale-75  active:rotate-12  active:bg-red-200  active:shadow-[0_0_20px_rgba(239,68,68,0.7)]">
                                            <Trash size={20} />
                                        </button>


                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <MapPin size={18} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Address {index + 1}
                                                </p>

                                                {address.isDefault && (
                                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                                        <Check size={13} />
                                                        Default
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm text-slate-600">
                                                {address.street}, {address.city}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {address.state} - {address.pincode}, {address.country}
                                            </p>

                                            {address.phone && (
                                                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Phone size={13} />
                                                    {address.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* //add address alert */}
                            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <h2 className="text-lg font-semibold"> Add Address </h2>
                                    </AlertDialogHeader>


                                    <div className="space-y-2.5">
                                        <div>
                                            <label htmlFor="street" className="mb-1 block text-xs font-medium text-gray-600">
                                                Street
                                            </label>
                                            <input
                                                id="street"
                                                type="text"
                                                placeholder="Street"
                                                name="street"
                                                value={editAddress.street}
                                                onChange={editAddressEvent}
                                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="mb-1 block text-xs font-medium text-gray-600">
                                                City
                                            </label>
                                            <input
                                                id="city"
                                                type="text"
                                                placeholder="City"
                                                name="city"
                                                value={editAddress.city}
                                                onChange={editAddressEvent}
                                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="state" className="mb-1 block text-xs font-medium text-gray-600">
                                                State
                                            </label>
                                            <input
                                                id="state"
                                                type="text"
                                                placeholder="State"
                                                name="state"
                                                value={editAddress.state}
                                                onChange={editAddressEvent}
                                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="pincode" className="mb-1 block text-xs font-medium text-gray-600">
                                                Pincode
                                            </label>
                                            <input
                                                id="pincode"
                                                type="text"
                                                placeholder="Pincode"
                                                name="pincode"
                                                value={editAddress.pincode}
                                                onChange={editAddressEvent}
                                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="country" className="mb-1 block text-xs font-medium text-gray-600">
                                                Country
                                            </label>
                                            <input
                                                id="country"
                                                type="text"
                                                placeholder="Country"
                                                name="country"
                                                value={editAddress.country}
                                                onChange={editAddressEvent}
                                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="mb-1 block text-xs font-medium text-gray-600">
                                                Phone
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                placeholder="Phone"
                                                name="phone"
                                                value={editAddress.phone}
                                                onChange={editAddressEvent}
                                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                                            />
                                        </div>

                                        <label className="flex items-center gap-2 pt-1 text-xs text-gray-600">
                                            <input
                                                type="checkbox"
                                                className="h-3.5 w-3.5 accent-cyan-500"
                                            />
                                            Make this default address
                                        </label>
                                    </div>


                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>

                                        <AlertDialogAction onClick={() => addAddressHandler()} className="bg-[#00FFFF] text-[#666666] hover:bg-[#00e6e6]"> {
                                            loading ? <><Loader2 className="animate-spin" /> Saving...</> : <><Save /> Save Address</>
                                        }


                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>



                    </div>


                </div>



            </div>

        </section>
    );
};

export default Profile;


