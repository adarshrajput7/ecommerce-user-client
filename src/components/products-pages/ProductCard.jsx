import { Heart, X } from "lucide-react";
import { memo, useState } from "react";
import { IoBagAddOutline } from "react-icons/io5";
import {  useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";
import axios from "../../api/axios";
// import { toast } from "react-toastify";
import { setTriggerRefresh } from "@/redux/orderSlice";
import { useDispatch, useSelector } from "react-redux";
// import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";

const ProductCard = memo(({ item }) => {
  const navigate = useNavigate();
  const [openBag, setOpenBag] = useState(false)
  const [selectedSize, setSelectedSize] = useState();


  // Skeleton Loading 
  // =========================
  if (!item) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

        {/* Product Image */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-gray-100">

          {/* Soft Skeleton */}
          <div className="absolute inset-0 animate-pulse bg-linear-to-br from-gray-200 via-gray-300 to-gray-200" />

          {/* Soft Glass Highlight */}
          <div className="absolute inset-0 bg-linear-to-br from-white/50 via-transparent to-black/5" />

          {/* Wishlist */}
          <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300/70 bg-white/60 shadow-sm backdrop-blur-md sm:h-9 sm:w-9">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-500/50" />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white px-2.5 pb-3 pt-2.5 sm:px-3 sm:pb-4 sm:pt-3">

          {/* Category */}
          <div className="mb-2 h-2.5 w-24 animate-pulse rounded-full bg-gray-300 sm:h-3" />

          {/* Title */}
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-300 sm:h-5" />

          {/* Price + Button */}
          <div className="mt-2.5 flex items-center justify-between gap-2 sm:mt-3">

            {/* Price */}
            <div className="h-5 w-20 animate-pulse rounded-full bg-gray-300 sm:h-6 sm:w-24" />

            {/* Cart */}
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-gray-100 shadow-sm sm:h-9 sm:w-9">
              <div className="h-3.5 w-3.5 animate-pulse rounded-sm bg-gray-500/50 sm:h-4 sm:w-4" />
            </div>

          </div>
        </div>

        {/* Subtle Bottom Border */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gray-400 to-transparent" />

      </div>
    );
  }


  const image = item.images?.[4]?.thumbnail || item.images?.[0]?.url;
  const price = item.price?.amount || item.price;
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)
  console.log(user)
  const goToProduct = () => navigate(`/view/${item._id}`);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = (e) => {
    e.stopPropagation();
    // wishlist logic
    // toast.error("This Featured under process")
    toast.error("This Feature is under process.")
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    // add to bag logic
    setOpenBag(true)
  };

  const addToCart = async (id) => {
    if (!user) {
        toast.error("Please login to add items to cart");
        navigate("/login");          // ✅ ye sahi hai
        return;
    }

    if (!selectedSize) {
      toast.error("Please select the size")
      return;
    }
    try {

      const res = await axios.post(`/api/cart/items`, {
        "productId": id,
        "qty": 1,
        "size": selectedSize
      }, {
        headers: {
          "Content-Type": "application/json"
        }, withCredentials: true
      })

      if (res.data.success) {
        dispatch(setTriggerRefresh())
        toast.success(res.data.message)
        navigate('/cart')
      }
      console.log(res);


    } catch (error) {
      console.error("🚀 ~ addToCart ~ error:", error)
    }
  }

  return (
    <>
      {/* Product Card */}
      <div onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={goToProduct}
        className="group relative cursor-pointer overflow-hidden rounded-lg bg-zinc-100 border border-gray-200
          transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        {/* Product Image */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-[#f5f5f5]">
          <img
            src={
              isHovered
                ? item.images?.[2]?.url
                : item.images?.[4]?.url
            }
            // src={image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={handleWishlist}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full  text-gray-900  transition-all duration-200 hover:text-red-500 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
          >
            <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Product Details */}
        <div className="px-2.5 pb-3 pt-2.5 sm:px-3 sm:pb-4 sm:pt-3">
          <p className="mb-0.5 truncate font-bold uppercase tracking-wider text-gray-900 text-xs lg:text-sm">
            {item.category || "Women's Lifestyle"}
          </p>

          <h2 className="line-clamp-1 text-xs lg:text-sm font-normal text-gray-800 ">
            {item.title}
          </h2>

          <div className="mt-1 flex items-center justify-between gap-2 sm:mt-2">
            <p className="truncate  text-xs lg:text-sm font-bold text-gray-900 sm:text-base">
              ₹ {Number(price).toLocaleString("en-IN")}.00
            </p>

            {/* Add to Bag */}

            <button
              type="button"
              aria-label="Add to bag"
              onClick={handleAddToBag}
              className="group relative flex  shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border border-gray-300 bg-white px-1 py-1 lg:h-10 lg:px-2  text-gray-800 shadow-sm transition-all duration-300 ease-out hover:border-gray-500 hover:bg-gray-50 hover:text-black hover:shadow-md md:hover:px-3"
            >
              <IoBagAddOutline className="h-6 w-6 lg:h-7 lg:w-7 shrink-0 sm:h-6 sm:w-6" />

              <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-out group-hover:max-w-20 group-hover:opacity-100 md:inline-block">
                Add to Cart
              </span>
            </button>





          </div>
        </div>
      </div>


      {/* bag */}
      {/* <div className={`bg-indigo-100 lg:w-[50vw] lg:h-[30vw] w-[90vw] h-[50vh] fixed inset-0 m-auto z-50 transition-all duration-300 ease-out ${openBag ? "opacity-100 scale-100 pointer-events-auto"
        : "opacity-0 scale-95 pointer-events-none"}`} >
        <Button onClick={() => setOpenBag(false)} variant="none" className="absolute right-2 top-2">
          <X className="size-6 border-2 border-black rounded-full" />
        </Button>

        <div className="w-full h-fit overflow-hidden flex ">
          <div className="w-1/2 px-2 flex justify-center items-center lg:block hidden ">
            <img src="https://i.pinimg.com/736x/48/22/db/4822db571c444011615e286d49c15325.jpg" alt="" className="aspect-4/5 object-cover w-full p-5" />
          </div>

          <div className="pt-2 w-1/2 px-5 flex flex-col justify-around">
            <p className="border-b-2 border-[#00FFFF] inline-block">See full product details</p>
            <h1>Seam XVIII OG</h1>
            <p>₹ 6,999.00</p>
            <button className="bg-[#00FFFF] py-2 w-full rounded-full text-black font-bold bottom-0">Add To Bag</button>
          </div>
        </div>

      </div> */}

      {createPortal(
        <div className={`fixed inset-0 z-999 flex items-center justify-center p-10 bg-black/40 transition-all duration-300 ease-out ${openBag ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          {/* Modal Box */}
          <div className={`relative w-full max-w-85 md:max-w-2xl bg-[#EBECEE] md:bg-white shadow-xl flex flex-col md:flex-row overflow-hidden transition-transform duration-300 ${openBag ? "scale-100" : "scale-95"}`}>
            {/* Close Button */}
            <Button onClick={() => setOpenBag(false)} variant="none" className="absolute right-3 top-3 z-10 p-0 text-black hover:opacity-70">
              <X className="size-6 p-0.5 border-2 border-black rounded-full" />
            </Button>

            {/* Left: Product Image (PC Only) */}
            <div className="hidden md:flex w-1/2 bg-[#F3F4F6] items-center justify-center p-2">
              <img src={image} alt="Product" className="w-full aspect-square object-contain" />
            </div>

            {/* Right: Details & Options */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-around gap-3.5 text-black">
              <div>
                <a onClick={goToProduct} href="#" className="text-xs border-b-2 border-[#00FFFF] pb-0.5 inline-block">
                  See full product details
                </a>
                <h2 className="lg:text-2xl md:text-xl text-lg font-semibold mt-2 tracking-tight">{item?.title}</h2>
                <p className="text-sm font-semibold mt-1">₹ {Number(price).toLocaleString("en-IN")}.00</p>
              </div>

              {/* Size Radio Group */}
              <div className="text-xs">
                <p className="font-semibold mb-1.5">Size:</p>
                <div className="flex flex-wrap gap-1.5 font-medium">
                  {(item?.category?.toUpperCase() === "FOOTWEAR"
                    ? ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]
                    : ["CLOTHING", "ACTIVE_LIFESTYLE"].includes(item?.category?.toUpperCase())
                      ? ["S", "M", "L"]
                      : []).map((sz) => (
                        <label key={sz} className="cursor-pointer">
                          <input type="radio" name="size" value={sz} checked={selectedSize === sz} onChange={(e) => setSelectedSize(e.target.value)} className="sr-only" />
                          <span className={`w-10 h-7 flex items-center justify-center transition ${selectedSize === sz
                            ? "bg-black text-white" : "bg-white/70 text-gray-800"}`}>{sz}
                          </span>
                        </label>
                      ))}
                </div>
              </div>

              {/* CTA Button */}
              <button onClick={() => addToCart(item._id)} className="w-full mt-2 py-2 lg:py-2.5 bg-[#00FFFF] hover:bg-[#00e6e6] text-black  rounded-full lg:text-sm text-sm transition">Add to Bag</button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </>
  );
});

export default ProductCard;