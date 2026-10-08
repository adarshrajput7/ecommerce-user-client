import { useEffect, useState } from "react";
import { FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from "../api/axios";
import { useCart } from "./cart/CartContext";
import { setSearchOpen } from "@/redux/authSlice";

const Navbar = ({ transparent }) => {
  const navigate = useNavigate();
  const { user, isSearchOpen } = useSelector((store) => store.auth);
  // const [qty, setQty] = useState(1);
  const { cartItems } = useCart();
  const dispatch = useDispatch()

  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    const shouldLock = menuOpen || isSearchOpen;

    if (shouldLock) {
      window.lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      window.lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      window.lenis?.start();
      document.body.style.overflow = "";
    };
  }, [menuOpen, isSearchOpen]);




  useEffect(() => {
    const getCartProducts = async () => {
      try {
        const cartRes = await axios.get("/api/cart/", { withCredentials: true });
        const items = cartRes.data.cart.items;
        // console.log("💗 Cart Items:", items);

        const productIds = items.map((item) => item.productId);
        // console.log("💗 Product IDs:", productIds);

        const productResponses = await Promise.all(
          productIds.map((productId) =>
            axios.get(`/api/product/${productId}`, { withCredentials: true })
          )
        );

        const products = productResponses.filter((res) => res.data.success).map((res) => res.data.data);
        // console.log("💗 All Products:", products);
      } catch (error) {
        console.error("🚀 ~ getCartProducts ~ error:", error);
      }
    };

    getCartProducts();
  }, []);

  return (
    // <nav className={`fixed top-0 left-0 w-full z-200 ${transparent ? "bg-transparent text-white" : "bg-white text-black"}`}>
    <nav className={`absolute top-0 left-0 w-full z-200 ${menuOpen ? "bg-white text-black!" : ''} ${transparent ? "lg:bg-transparent text-white lg:text-white hover:bg-white hover:text-black" : "bg-white text-black"} group`}>

      <div className="relative flex items-center justify-between px-4 lg:px-10 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* Hamburger */}
          {menuOpen ? <button onClick={() => setMenuOpen(false)} className="lg:hidden self-end ">
            <FiX size={28} />
          </button> : <button onClick={() => setMenuOpen(true)} className="lg:hidden">
            <FiMenu size={28} />
          </button>}

          {/* Search Icon */}
          {isSearchOpen ? <X size={27} onClick={() => dispatch(setSearchOpen(false))} className="lg:hidden cursor-pointer" /> : <FiSearch size={27} onClick={() => dispatch(setSearchOpen(true))} className="lg:hidden cursor-pointer" />}
          {/* <FiSearch size={27} onClick={() => dispatch(setSearchOpen(true))} className="lg:hidden cursor-pointer" /> */}

          {/* SAME MENU */}
          <div className={`flex gap-6 fixed lg:static top-0 z-50 left-0 h-full mt-15 lg:mt-0 lg:h-auto w-full lg:w-auto flex-col lg:flex-row items-start lg:items-center bg-white  lg:bg-transparent p-6 lg:p-0 transition-transform duration-300 ${menuOpen ? "translate-x-0 flex justify-between" : "-translate-x-full lg:translate-x-0"}`}>

            {/* Close */}
            {/* <button onClick={() => setMenuOpen(false)} className="lg:hidden self-end mb-2">
              <FiX size={28} />
            </button> */}

            {/* MENU ITEMS */}
            <div className={`lg:flex w-full gap-5 z-300 cursor-pointer text-4xl lg:text-base font-medium ${menuOpen ? "text-gray-500 pl-1 flex flex-col mt-5" : ''}`}>
              <p onClick={() => { navigate("/collections"); setMenuOpen(false) }} className="flex justify-between items-center"><span>Featured</span> <IoIosArrowRoundForward  className={`${menuOpen ? '': "hidden"}`} /></p>
              <p onClick={() => {navigate("/collections-all-women"); setMenuOpen(false)}} className="flex justify-between items-center"><span>Women</span> <IoIosArrowRoundForward  className={`${menuOpen ? '': "hidden"}`} /></p>
              <p onClick={() =>{ navigate("/collections-all-men"); setMenuOpen(false)}} className="flex justify-between items-center"><span>Men</span> <IoIosArrowRoundForward  className={`${menuOpen ? '': "hidden"}`} /></p>
            </div>

            <div className={`mb-15 text-gray-600 text-xs flex flex-col gap-2 ${menuOpen ? '': "hidden"}`}>
              <p>About us</p>
              <p>My account</p>
              <p>Cart</p>
              <p>Contact us</p>
              <p>Return policy</p>
            </div>
          </div>

          {/* Overlay */}
          {menuOpen && (
            <div onClick={() => setMenuOpen(false)} className="fixed inset-0 lg:hidden" />
          )}
        </div>

        {/* LOGO */}
        <div onClick={() => navigate("/")} className="absolute left-1/2 -translate-x-1/2 cursor-pointer">
          <div className="w-14 h-14">
            <p className="h-9 w-9">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120.83">
                <path d="M48.95 0l-.36 11.78c-6.07.78-10.76 5.97-10.76 12.25 0 3.91 1.81 7.39 4.64 9.65C36.13 36.6 31.74 43 31.74 50.44c0 9.05 6.52 16.58 15.12 18.14l-.37 11.98h7.38l-.37-11.98c8.6-1.56 15.12-9.09 15.12-18.14 0-7.43-4.4-13.84-10.73-16.76 2.83-2.26 4.64-5.75 4.64-9.65 0-6.28-4.69-11.47-10.76-12.25L51.41 0h-2.46zm-7.13 23.64c0-4.03 2.86-7.4 6.66-8.19l-.5 16.25c-3.55-.97-6.16-4.21-6.16-8.07m-5.17 26.28c0-6.67 4.83-12.21 11.18-13.32l-.81 26.48c-5.95-1.42-10.37-6.77-10.37-13.15m27.05-.01c0 6.38-4.42 11.73-10.37 13.15l-.81-26.48c6.35 1.11 11.18 6.65 11.18 13.32m-5.16-26.26c0 3.86-2.61 7.1-6.16 8.07l-.5-16.25c3.8.79 6.66 4.15 6.66 8.19M0 109.26c0-6.96 5.27-11.52 11.52-11.52s11.57 4.56 11.57 11.52-5.32 11.57-11.57 11.57S0 116.22 0 109.26zm18.48 0c0-4.23-3.2-7.2-6.96-7.2s-6.91 2.96-6.91 7.2 3.15 7.24 6.91 7.24 6.96-2.96 6.96-7.24zM47.74 107.7v12.56h-4.61v-12.28c0-3.57-2.16-5.74-4.99-5.74s-6.35 1.65-6.35 6.21v11.81h-4.61V98.29h4.61v3.39c1.27-2.73 4.8-3.95 7.15-3.95 5.55 0 8.84 3.72 8.8 9.97zM73.85 111.14h-17.5c.61 3.57 3.25 5.41 6.77 5.41 2.59 0 4.99-1.18 6.21-3.2l3.67 1.83c-1.93 3.67-5.88 5.64-10.07 5.64-6.35 0-11.34-4.66-11.34-11.62s5.08-11.48 11.34-11.48 11.01 4.52 11.01 11.43c0 .61-.05 1.27-.09 1.98zm-4.52-3.72c-.47-3.43-2.96-5.41-6.35-5.41s-5.93 1.74-6.58 5.41h12.93zM100 111.09c0 5.74-4.89 9.74-11.57 9.74s-11.66-4-11.66-9.69c0-3.95 2.35-7.29 5.83-8.56-1.88-1.13-3.2-3.1-3.2-5.74 0-4.42 3.72-7.71 9.03-7.71s8.98 3.29 8.98 7.71c0 2.63-1.32 4.61-3.2 5.74 3.48 1.32 5.79 4.61 5.79 8.51zm-4.84-.33c0-3.48-3.06-5.93-6.73-5.93s-6.82 2.49-6.82 5.88 2.96 5.79 6.82 5.79 6.73-2.54 6.73-5.74zM84.2 97.26c0 2.16 1.83 3.81 4.23 3.81s4.23-1.65 4.23-3.81-1.83-3.95-4.23-3.95-4.23 1.79-4.23 3.95z" fill="currentColor" />
              </svg>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Desktop Search */}
          <div onClick={() => dispatch(setSearchOpen(true))}
            className={`hidden lg:flex items-center gap-2 w-80 border-2 bg-transparent px-3 py-1.5 rounded cursor-pointer z-10000 ${transparent ? "border-white group-hover:border-black" : "border-black"}`}>
            <Search size={18} className={transparent ? "text-white group-hover:text-black" : "text-black"}
            />
            <input type="text" readOnly placeholder="Search For Products" className={`w-full bg-transparent outline-none cursor-pointer ${transparent ? "placeholder:text-white text-white group-hover:placeholder:text-black " : "placeholder:text-black text-black"}`} />
          </div>



          {/* Cart */}
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <MdOutlineShoppingBag size={29} />
            {cartItems.length > 0 && (
              <span className="absolute -right-2 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#00FFFF] text-xs font-bold text-black">{cartItems.length}</span>
            )}
          </div>

          {/* bag panel */}
          <div className={`bg-white lg:w-[25vw] w-full h-screen fixed right-0 top-0 z-50 transform transition-transform duration-700 ease-in-out ${bagOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex justify-between items-center p-3 text-black">
              <h1 className="text-3xl font-bold">Your Bag <span className="text-gray-600 text-sm">total items: {cartItems.length}</span></h1>
              <Button variant="none" onClick={() => setBagOpen(false)}>
                <X className="size-8 border-3 border-black rounded-full" />
              </Button>
            </div>

            {/* <div className="max-h-[80vh] overflow-y-auto w-full pb-20">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="w-full flex h-50 border-b-2 border-gray-600">
                  <div className="w-1/2 p-3">
                    <img src={item.images?.[0]?.url} alt="" className="aspect-4/5 object-cover h-full" />
                  </div>
                  <div className="w-1/2 text-black flex flex-col justify-around px-2">
                    <h1 className="text-2xl font-bold line-clamp-3">{item.title}</h1>
                    <p className="font-bold">{item.price?.currency} {item.price?.amount}</p>
                    <p>Size: {item.size}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded w-fit">
                        <Button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-2.5 py-0.5 text-sm font-bold text-gray-700 rounded-none">-</Button>
                        <span className="px-2 text-sm font-semibold">{qty}</span>
                        <Button type="button" onClick={() => setQty(Math.min(5, qty + 1))} className="px-2.5 py-0.5 text-sm font-bold text-gray-700 rounded-none">+</Button>
                      </div>
                      <p className="mr-1 text-red-500 cursor-pointer underline flex items-center gap-1"><IoIosRemoveCircleOutline /> Remove</p>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            <button className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full w-[calc(100%-2rem)] text-black py-3 bg-[#00FFFF] font-bold flex items-center justify-center">Continue Order <IoIosArrowRoundForward size={30} /></button>
          </div>

          {/* User */}
          {user ? (
            <Avatar onClick={() => navigate("/profile")} className="cursor-pointer">
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="Profile" /> */}
              {/* <AvatarFallback>CN</AvatarFallback> */}
              <AvatarFallback className="relative overflow-hidden bg-blue-500/20 backdrop-blur-xl border border-blue-300/40 text-blue-900 dark:text-blue-100 font-bold text-lg shadow-lg">
                <span className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30"></span>
                <span className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent"></span>
                <span className="relative z-10">
                  {user?.fullName?.firstName?.[0]?.toUpperCase() || "U"}
                </span>
              </AvatarFallback>
            </Avatar>
          ) : (
            <FiUser size={29} className="cursor-pointer" onClick={() => navigate("/login")} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;