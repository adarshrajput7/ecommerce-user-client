import { IoIosRemoveCircleOutline } from "react-icons/io";
import { Button } from "../ui/button";
import { useCart } from "./CartContext";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, ChevronRight, Loader2, LucideTruck, MapPin, Phone, Save } from "lucide-react";
import axios from "../../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import { setOrderRedux, setTriggerRefresh } from "@/redux/orderSlice";
// import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import usePageTitle from "@/hooks/usePageTitle";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { setLoading, setUser } from "@/redux/authSlice";

const Cart = () => {
    const { cartItems } = useCart();
    console.log('Cart ITEMS LADLE', cartItems)
    const { user, loading } = useSelector((store) => store.auth);
    // console.log("🏡",user.addresses)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    usePageTitle('Cart', '/icons/about.png');
    const [isOpen, setIsOpen] = useState(false);
    const [editAddress, setEditAddress] = useState({
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        phone: "",
    });

    useEffect(() => {
        if (user?.addresses?.[0]) {
            setEditAddress({
                street: user.addresses[0].street || "",
                city: user.addresses[0].city || "",
                state: user.addresses[0].state || "",
                pincode: user.addresses[0].pincode || "",
                country: user.addresses[0].country || "",
                phone: user.addresses[0].phone || "",
            });
        }
    }, [user]);


    // const totalAmount = cartItems.reduce(
    //     (total, item) => total + (item.price?.amount || 0) * (item.qty || 1),
    //     0
    // );

    const totalAmount = cartItems.reduce(
        (total, item) => total + (item.price?.amount || 0) * (item.quantity || 1),
        0
    );


    const [qty, setQty] = useState({});


    const createOrder = async () => {
        if (!user?.addresses?.length) {
            toast.error("Add address to continue order");
            return
        }

        try {

            const res = await axios.post(`/api/order`, {
                "shippingAddress": {
                    "street": user.addresses[0].street,
                    "city": user.addresses[0].city,
                    "state": user.addresses[0].state,
                    "pincode": user.addresses[0].pincode,
                    "country": user.addresses[0].country,
                    "phone": user.addresses[0].phone
                }
            }, {
                headers: {
                    "Content-Type": "application/json"
                }, withCredentials: true
            })

            if (res.data.success) {

                const deleteCart = await axios.delete(`/api/cart/`, {
                    withCredentials: true
                })
                console.log("🟩", deleteCart)
                toast.success(res.data.message)
                console.log("👽 order", res.data)
                dispatch(setOrderRedux(res.data))
                dispatch(setTriggerRefresh())
                navigate('/cart/order')
            }

        } catch (error) {
            console.error("🚀 ~ createOrder ~ error:", error)
        }
    }

    const removeProduct = async (id) => {
        try {
            const res = await axios.delete(`/api/cart/delete/${id}`, {
                withCredentials: true
            })

            console.log(res.data)

            if (res.data.success) {
                console.log("❌")
                toast.success(res.data.message)
                dispatch(setTriggerRefresh())
            }

        } catch (error) {
            console.log("🚀 ~ removeProduct ~ error:", error)
        }
    }

    const updateCartQty = async (productId, newQty) => {
        if (newQty > 5) {
            toast.error("Maximum quantity is 5");
            return;
        }


        try {
            const res = await axios.patch(
                `/api/cart/items/${productId}`,
                {
                    qty: newQty
                },
                {
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setTriggerRefresh());
            }
        } catch (error) {
            console.error(
                "🚀 ~ updateCartQty ~ error:",
                error.response?.data || error
            );
        }
    };

    const editAddressEvent = async (e) => {
        e.preventDefault()
        setEditAddress({
            ...editAddress,
            [e.target.name]: e.target.value,
        });
        console.log('cahnge', editAddress)
    }

    const changeAddressHandler = async (id) => {
        try {
             dispatch(setLoading(true));
            const res = await axios.patch(`/api/auth/me/update/${id}`, {
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

            console.log("mera sona bahar", res.data)

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

        finally {  dispatch(setLoading(true)); }
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!cartItems?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
                    <div className="mb-4 text-5xl text-[#00FFFF]">🛒</div>

                    <h2 className="text-xl font-semibold text-zinc-800">
                        Your Cart is Empty
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        You haven't added any products to your cart yet.
                        Explore our collection and find something you love.
                    </p>

                    <button
                        onClick={() => navigate('/collections')}
                        className="mt-6 w-full rounded-xl bg-[#00FFFF] px-5 py-3 font-semibold text-zinc-900 transition hover:opacity-80"
                    >
                        Continue Shopping
                    </button>

                    <Button
                        onClick={() => navigate("/cart/order")}
                        className="mt-5 lg:mt-10 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-zinc-50 py-6 font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100"
                    >
                        <LucideTruck size={20} className="text-zinc-700" />
                        View My Orders
                        <ArrowRight size={18} className="text-zinc-600" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>

            <motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                    mass: 0.8,
                }}>

                <div className="flex px-4 sm:px-6 lg:flex-row lg:px-20 xl:px-40  items-center gap-1 text-sm text-gray-600 mt-20 ">
                    <span onClick={() => navigate('/')}>Home</span><ChevronRight size={14} /><span className="text-gray-600">Cart</span>
                </div>

                <div className="mt-2 flex w-full flex-col gap-8 px-4 pb-10 sm:px-6 lg:flex-row lg:px-20 xl:px-40">
                    {/* <button className="absolute lg:top-20 left-5 flex"><ChevronLeft /><span>Back</span></button> */}



                    {/* Left - Cart */}
                    <div className="w-full  bg-gray-100 lg:w-1/2">
                        <div className="p-4">

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Your Bag{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    {cartItems.length} items
                                </span>
                            </h1>
                        </div>

                        {cartItems.map((item) => (

                            <div
                                key={item.cartItemId}
                                className="flex h-44 border-b border-gray-300 sm:h-52"
                            >
                                <div className="w-2/5 p-3 sm:w-1/2">
                                    <img
                                        src={item.images?.[0]?.url}
                                        alt={item.title}
                                        className="h-full w-full  object-contain"
                                    />
                                </div>

                                <div className="flex w-3/5 flex-col justify-around px-2 sm:w-1/2">
                                    <h2 className="line-clamp-2 text-lg font-bold sm:text-2xl">
                                        {item.title}
                                    </h2>

                                    <p className="font-bold">
                                        {item.price?.currency} {item.price?.amount}
                                    </p>

                                    <p className="text-sm">Size: {item.size}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center rounded border border-gray-300">

                                            <Button onClick={() => {
                                                const currentQty = qty[item._id] || item.quantity || 1;
                                                const newQty = Math.max(1, currentQty - 1);

                                                setQty((prev) => ({
                                                    ...prev,
                                                    [item._id]: newQty
                                                }));

                                                updateCartQty(item._id, newQty);
                                            }}
                                                className="rounded-none px-2"
                                            >
                                                −
                                            </Button>

                                            <span className="px-3 text-sm font-semibold">
                                                {qty[item._id] || item.quantity || 1}
                                            </span>

                                            <Button
                                                onClick={() => {
                                                    const currentQty = qty[item._id] || item.quantity || 1;
                                                    const newQty = Math.min(5, currentQty + 1);

                                                    setQty((prev) => ({
                                                        ...prev,
                                                        [item._id]: newQty
                                                    }));

                                                    updateCartQty(item._id, newQty);
                                                }}
                                                className="rounded-none px-2"
                                            >
                                                +
                                            </Button>

                                        </div>




                                        <button onClick={() => removeProduct(item._id)} className="flex items-center gap-1 text-sm text-red-500 underline">
                                            <IoIosRemoveCircleOutline />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right - Summary */}
                    <div className="w-full lg:sticky lg:top-24 lg:h-fit lg:w-[30vw] xl:w-[25vw]">
                        <div className="flex flex-col gap-5">

                            {/* Address */}
                            {user?.addresses?.length > 0 ? (
                                <div className="rounded-xl border bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-800">
                                            Deliver to:
                                        </p>

                                        <button onClick={() => setIsOpen(true)} className="rounded-md border px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50">
                                            Change
                                        </button>

                                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <h2 className="text-lg font-semibold"> Change Address </h2>
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
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction onClick={() =>
                                                        changeAddressHandler(user?.addresses?.[0]?._id)} className="bg-[#00FFFF] text-[#666666] hover:bg-[#00e6e6] border border-[#666666] rounded-sm"> {
                                                            loading ? <><Loader2 className="animate-spin" /> Saving...</> : <>Change Address</>}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>



                                    </div>

                                    <div className="mt-3">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-800">
                                                {user?.fullName?.firstName}{" "}
                                                {user?.fullName?.lastName}
                                            </p>

                                            {user.addresses[0].isDefault && (
                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                                    Default
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-gray-600 flex gap-1 items-center"><MapPin size={20} className="bg-[#00FFFF] p-1 rounded-sm text-black" />
                                            {user.addresses[0].street},{" "}
                                            {user.addresses[0].city},{" "}
                                            {user.addresses[0].state} -{" "}
                                            {user.addresses[0].pincode},{" "}
                                            {user.addresses[0].country}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600 flex gap-1 items-center"><Phone size={20} className="bg-[#00FFFF] p-1 rounded-sm text-black" />
                                            {user.addresses[0].phone}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="w-full  bg-white border border-blue-400 py-2 rounded-xstext-sm hover:bg-gray-200"
                                >
                                    Add Address
                                </button>
                            )}

                            {/* Price */}
                            <div className="rounded-xl border bg-white p-5 shadow-sm">
                                <h2 className="mb-4 text-lg font-bold">
                                    Price Details
                                </h2>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <p>Items ({cartItems.length})</p>
                                    <p>₹{totalAmount.toLocaleString()}</p>
                                </div>

                                <div className="mt-3 flex justify-between text-sm text-gray-600">
                                    <p>Delivery</p>
                                    <p className="text-green-600">FREE</p>
                                </div>

                                <div className="mt-4 flex justify-between border-t pt-4">
                                    <p className="font-bold">Total Amount</p>
                                    <p className="font-bold">
                                        ₹{totalAmount.toLocaleString()}
                                    </p>
                                </div>

                                <button onClick={createOrder} className="mt-5 w-full rounded-md bg-[#00FFFF] py-3 font-bold text-gray-900 transition hover:bg-cyan-300">
                                    Order Now
                                </button>
                            </div>

                        </div>
                        <Button
                            onClick={() => navigate("/cart/order")}
                            className="mt-5 lg:mt-10 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-zinc-50 py-6 font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100"
                        >
                            <LucideTruck size={20} className="text-zinc-700" />
                            View My Orders
                            <ArrowRight size={18} className="text-zinc-600" />
                        </Button>
                    </div>
                </div>

            </motion.div>
        </>
    );
};

export default Cart;
