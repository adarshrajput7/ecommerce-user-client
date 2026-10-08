// import { useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, FreeMode } from "swiper/modules";
// import { Infinity as InfinityIcon } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/free-mode";

// import clothesImg from "../assets/category-images/clothes-image.png";
// import clotheImg from "../assets/category-images/clothe-image.png";
// import activeImg from "../assets/category-images/active-life-image.png";
// import footwearImg from "../assets/category-images/footwear-image.png";
// import mobileImg from "../assets/category-images/mobile-image.png";
// import { useNavigate } from "react-router-dom";

// const categories = [
//   { id: 1, title: "Footwear", img: footwearImg, path:"/collections-footwear" },
//   { id: 2, title: "Clothing", img: clotheImg, path:"/collections-clothing" },
//   { id: 3, title: "Accessories", img: mobileImg, path: "/collections-mobiles"},
//   { id: 4, title: "Active Lifestyle", img: activeImg, path:"/collections-lifestyle" },
// ];

// const CategoryHome = () => {
//   const [progress, setProgress] = useState(0);
//   const [activeIndex, setActiveIndex] = useState(1);
//     const swiperRef = useRef(null);
//     const navigate = useNavigate()

//   const handleSeek = (e) => {
//     const bar = e.currentTarget.getBoundingClientRect();
//     const clientX = e.clientX || (e.touches && e.touches[0].clientX);
//     const nextProgress = Math.max(0, Math.min(1, (clientX - bar.left) / bar.width));
//     swiperRef.current?.setProgress(nextProgress, 200);
//   };

//   // Reusable Card Component
//   const CategoryCard = ({ item }) => (
//   <div
//     className="group relative w-full overflow-hidden rounded-2xl cursor-pointer"
//     onClick={() => navigate(item.path)}
//   >
//     {/* Image */}
//     <img
//       src={item.img}
//       alt={item.title}
//       className="w-full aspect-4/5 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
//     />

//     {/* Modern Overlay */}
//     <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

//     {/* Title */}
//     <p className="absolute top-[8%] left-1/2 -translate-x-1/2 text-xl md:text-2xl text-white font-bold text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap transition-all duration-500 group-hover:tracking-wide">
//       {item.title}
//     </p>

//     {/* Shop Button */}
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         navigate(item.path);
//       }}
//       className="absolute bottom-4 left-1/2 -translate-x-1/2
//         bg-white text-black font-medium text-sm
//         rounded-full px-5 py-2.5 shadow-md
//         transition-all duration-300
//         group-hover:bg-black group-hover:text-white
//         group-hover:px-6 group-hover:shadow-xl
//         active:scale-95"
//     >
//       Shop Now
//     </button>

//     {/* Subtle Border */}
//     <div className="absolute inset-0 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-white/30 pointer-events-none" />
//   </div>
// );


//   return (
//     <div className="w-full py-8 px-4">
//       <h1 className="text-center font-bold text-2xl mb-6">Elevate Your Everyday</h1>

//       {/* 1. Desktop View (PC): Simple 4 Grid, No Slider */}
//       <div className="hidden lg:grid lg:grid-cols-4 gap-4">
//         {categories.map((item) => (
//           <CategoryCard key={item.id} item={item} />
//         ))}
//       </div>

//       {/* 2. Mobile & Tablet View (< lg): Swiper with Scrollbar */}
//       <div className="block lg:hidden select-none">
//         <Swiper
//           onSwiper={(s) => (swiperRef.current = s)}
//           onProgress={(_, prog) => setProgress(prog)}
//           onSlideChange={(s) => setActiveIndex(s.realIndex + 1)}
//           modules={[Navigation, FreeMode]}
//           spaceBetween={16}
//           slidesPerView={1.2}
//           freeMode={{ enabled: true, momentum: true }}
//           breakpoints={{
//             480: { slidesPerView: 1.5 },
//             640: { slidesPerView: 2.3 },
//           }}
//         >
//           {categories.map((item) => (
//             <SwiperSlide key={item.id}>
//               <CategoryCard item={item} />
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         {/* Bottom Controls (Mobile/Tablet Only) */}
//         <div className="flex items-center gap-3 mt-6 max-w-xs mx-auto">
//           <span className="text-xs text-neutral-600 min-w-7.5">
//             {activeIndex}/{categories.length}
//           </span>

//           <button onClick={() => swiperRef.current?.slidePrev()} className="text-sm px-1 cursor-pointer">‹</button>
//           <button onClick={() => swiperRef.current?.slideNext()} className="text-sm px-1 cursor-pointer">›</button>

//           {/* Patla Black Scrollbar + Lucide Icon */}
//           <div
//             onPointerDown={handleSeek}
//             onPointerMove={(e) => e.buttons === 1 && handleSeek(e)}
//             className="relative flex-1 py-3 cursor-pointer touch-none"
//           >
//             <div className="w-full h-[1.5px] bg-neutral-200">
//               <div
//                 className="h-full bg-black"
//                 style={{ width: `${progress * 100}%` }}
//               />
//             </div>

//             <div
//               className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-black p-0.5 rounded-full border border-black shadow-xs flex items-center justify-center pointer-events-none"
//               style={{ left: `${progress * 100}%` }}
//             >
//               <InfinityIcon size={12} strokeWidth={2.2} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryHome;


import { useState, useRef, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import clotheImg from "../assets/category-images/clothe-image.png";
import activeImg from "../assets/category-images/active-life-image.png";
import footwearImg from "../assets/category-images/footwear-image.png";
import mobileImg from "../assets/category-images/mobile-image.png";
import { IoNavigateSharp } from "react-icons/io5";

const categories = [
  { id: 1, title: "Footwear", img: footwearImg, path: "/collections-footwear" },
  { id: 2, title: "Clothing", img: clotheImg, path: "/collections-clothing" },
  { id: 3, title: "Accessories", img: mobileImg, path: "/collections-mobiles" },
  { id: 4, title: "Active Lifestyle", img: activeImg, path: "/collections-lifestyle" },
];

// Component ke bahar, taaki har re-render pe dobara mount na ho
const CategoryCard = memo(({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative w-full overflow-hidden rounded-2xl cursor-pointer"
      onClick={() => navigate(item.path)}
    >
      {/* Image */}
      <img
        src={item.img}
        alt={item.title}
        draggable={false}
        decoding="async"
        className="w-full aspect-4/5 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Modern Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

      {/* Title */}
      <p className="absolute top-[8%] left-1/2 -translate-x-1/2 text-xl md:text-2xl text-white font-bold text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap transition-all duration-500 group-hover:tracking-wide">
        {item.title}
      </p>

      {/* Shop Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(item.path);
        }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2
          bg-white text-black font-medium text-sm
          rounded-full px-5 py-2.5 shadow-md
          transition-all duration-300
          group-hover:bg-black group-hover:text-white
          group-hover:px-6 group-hover:shadow-xl
          active:scale-95"
      >
        Shop Now
      </button>

      {/* Subtle Border */}
      <div className="absolute inset-0 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-white/30 pointer-events-none" />
    </div>
  );
});

const CategoryHome = () => {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const swiperRef = useRef(null);

  const handleSeek = (e) => {
    const bar = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const nextProgress = Math.max(0, Math.min(1, (clientX - bar.left) / bar.width));
    swiperRef.current?.setProgress(nextProgress, 200);
  };

  return (
    <div className="w-full py-8 px-2 lg:px-4">
      <h1 className="text-center font-bold text-2xl mb-6">Elevate Your Everyday</h1>

      {/* 1. Desktop View (PC): Simple 4 Grid, No Slider */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {categories.map((item) => (
          <CategoryCard key={item.id} item={item} />
        ))}
      </div>

      {/* 2. Mobile & Tablet View (< lg): Swiper with Scrollbar */}
      <div className="block lg:hidden select-none">
        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          onProgress={(_, prog) => setProgress(Math.min(Math.max(prog, 0), 1))}
          onSlideChange={(s) => setActiveIndex(s.realIndex + 1)}
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.2}
          threshold={5}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.6,
            momentumVelocityRatio: 0.8,
          }}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2.3 },
          }}
        >
          {categories.map((item) => (
            <SwiperSlide key={item.id}>
              <CategoryCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Controls (Mobile/Tablet Only) */}
        <div className="flex items-center gap-1 mt-6 max-w-md">
          <span className="lg:text-xl text-sm text-neutral-600 min-w-8">
            {activeIndex}/{categories.length}
          </span>

          <button onClick={() => swiperRef.current?.slidePrev()} className="text-2xl px-1 cursor-pointer">‹</button>
          <button onClick={() => swiperRef.current?.slideNext()} className="text-2xl px-1 cursor-pointer">›</button>

          {/* Patla Black Scrollbar + Lucide Icon */}
          <div
            onPointerDown={handleSeek}
            onPointerMove={(e) => e.buttons === 1 && handleSeek(e)}
            className="relative flex-1 py-3 cursor-pointer touch-none"
          >
            <div
              className="w-full h-1 bg-gray-400"
              style={{ clipPath: "polygon(0 0, 100% 40%, 100% 60%, 0 100%)" }}
            >
              <div
                className="h-full bg-black"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2  text-black p-0.3  shadow-xs cursor-grab active:cursor-grabbing flex items-center justify-center"
              style={{ left: `${progress * 100}%` }}
            >
              {/* <InfinityIcon size={14} strokeWidth={2.2} /> */}
              {/* <BiExpandHorizontal size={25}/> */}
              <IoNavigateSharp size={30} className=" rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHome;