
import axios from '../../api/axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, CheckCircle2, CircleX, ChevronRight } from 'lucide-react';

// Swiper React components और styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import FeaturedSwiper from '../FeaturedSwiper';
// import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setTriggerRefresh } from '@/redux/orderSlice';
import toast from 'react-hot-toast';
import usePageTitle from '@/hooks/usePageTitle';
import { FaCcMastercard, FaCcVisa, FaGooglePay } from 'react-icons/fa6';
import { SiAmericanexpress } from "react-icons/si";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

const ProductsView = () => {
    const params = useParams();
    const id = params?.id;


    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState();
    const [selectedImage, setSelectedImage] = useState(0);
    const { user } = useSelector((store) => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const sizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
    const sizes = product?.category === "FOOTWEAR" ? ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'] : product?.category === "CLOTHING" ? ['S', 'M', 'L'] : product?.category === "ACTIVE_LIFESTYLE" ? ['S', 'M', 'L'] : [];



    useEffect(() => {
        const getProductById = async () => {
            try {
                const res = await axios.get(`/api/product/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setProduct(res.data.data);
                    console.log(res.data.data);


                }
            } catch (error) {
                console.error("🚀 ~ getProductById ~ error:", error);
            }
        };

        if (id) {
            getProductById();
        }
    }, [id]);



    const addToCart = async () => {
        if (!user) {
            toast.error('Please login first');
            navigate('/login');
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
                toast.success('Add To Catt')
                navigate('/cart')
            }
            console.log(res);


        } catch (error) {
            console.error("🚀 ~ addToCart ~ error:", error)
        }
    }


    const images = product?.images?.length >= 5
        ? product.images.map(img => img?.url || img)
        : [
            product?.image || product?.images?.[0]?.url || product?.images?.[0]
        ];

    console.log("images:", images);
    usePageTitle(
        product ? `${product.title}` : 'Loading... | MyApp', '/favicon.icon'
    );


    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 mt-15 md:mt-10 mb-20 lg:mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-10">

                {/* LEFT SECTION: IMAGES */}
                <div className="lg:col-span-7">

                    {/* 1. MOBILE VIEW: Swiper Carousel (md screen se choti screens par dikhega) */}
                    {/* <div className="block md:hidden w-full">
                        <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            spaceBetween={10}
                            slidesPerView={1}
                            className="w-full h-90 bg-[#f8f8f8] rounded-xl overflow-hidden [&_.swiper-pagination-bullet-active]:bg-black"
                        >
                            {images.slice(0, 5).map((img, idx) => (
                                <SwiperSlide key={idx} className="flex items-center justify-center p-6">
                                    <img
                                        src={img}
                                        alt={`product-slide-${idx}`}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div> */}



                    {/* MOBILE VIEW: Swiper Carousel */}
                    <div className="block md:hidden w-full mt-4">
                        {/* <div className="flex items-center text-xs space-x-1.5 px-2">
                            <span className="hover:underline cursor-pointer">Home</span>
                            <span><ChevronRight size={15} /></span>
                            <span className="text-gray-900 font-medium truncate max-w-[70vw] ">
                                {product?.title || "Boom Rush"}
                            </span>
                        </div> */}
                        <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            spaceBetween={10}
                            slidesPerView={1}
                            className="w-full aspect-4/5 bg-[#f8f8f8] rounded- overflow-hidden [&_.swiper-pagination-bullet-active]:bg-black"
                        >
                            {images.slice(0, 5).map((img, idx) => (
                                <SwiperSlide
                                    key={idx}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <img
                                        src={img}
                                        alt={`product-slide-${idx}`}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>


                    {/* 2. DESKTOP / TABLET VIEW: Main Image + 4 Thumbnails (md screens aur upar) */}
                    <div className="hidden md:flex flex-col gap-4">

                        <div className="relative w-full h-112 lg:h-125 bg-[#f8f8f8] rounded-xl flex items-center justify-center p-0 overflow-hidden">

                            <img
                                src={images[selectedImage]}
                                alt={product?.name || "Product"}
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {images.slice(0, 5).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`bg-[#f8f8f8] h-24 sm:h-28 rounded-lg flex items-center justify-center p-2 border-2 transition-all duration-200 overflow-hidden ${selectedImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`thumbnail-${idx}`}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT SECTION: DETAILS */}
                <div className="lg:col-span-5 flex flex-col pt-1 px-4">
                    {/* Breadcrumbs & Wishlist */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 ">
                        <div className="flex items-center space-x-1.5 ">
                            <span className="hover:underline cursor-pointer">Home</span>
                            <span><ChevronRight size={15} /></span>
                            <span className="text-gray-900 font-medium truncate max-w-50">
                                {product?.title || "Boom Rush"}
                            </span>
                        </div>
                        <button className="text-gray-400 hover:text-black transition">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tag */}
                    <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                            • NEW
                        </span>
                    </div>

                    {/* Category */}
                    <p className="text-xs font-semibold text-gray-700 tracking-wide uppercase mt-1">
                        {product?.category || "Men's Running / Gym"}
                    </p>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
                        {product?.title || "Boom Rush"}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm text-gray-500 mt-2">
                        {product?.description || "Multi-activity trainer for running and workouts."}
                    </p>

                    {/* Price */}
                    <div className="mt-4 border-b border-gray-100 pb-4">
                        <div className="text-2xl font-bold text-gray-900">
                            ₹{product?.price.amount ? Number(product.price.amount).toLocaleString('en-IN') : "9,999.00"}
                        </div>
                        <span className="text-xs text-gray-400 font-normal">
                            Inclusive of all taxes
                        </span>
                    </div>

                    {/* Size Selector */}
                    <div className="mt-5">
                        <div className="flex justify-between items-center text-xs mb-3">
                            <span className="font-semibold text-gray-900">Size:</span>
                            <button className="text-gray-500 underline hover:text-black font-medium">
                                Our size guides
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 text-xs font-medium rounded transition-all duration-150 ${selectedSize === size
                                        ? 'bg-black text-white shadow-sm'
                                        : 'bg-white text-gray-800 border border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium mt-5 animate-pulse">
                        {product?.stock > 0 ? <span className='flex gap-1 items-center'><CheckCircle2 size={15} /> In stock</span> : <span className='text-red-500 flex gap-1 items-center'><CircleX size={15} /> Out of stock</span>}
                    </div>

                    {/* Add to Bag CTA */}
                    <button onClick={addToCart} className="w-full mt-5 bg-[#00f2fe] hover:bg-[#00d8e4] text-black font-semibold py-3.5 px-6 rounded-full shadow-sm hover:shadow transition duration-200 active:scale-[0.99]">
                        Add to Bag
                    </button>

                    {/* Badges */}
                    <div className="flex items-center justify-center gap-5 mt-5 p-2 border border-gray-200">
                        <FaGooglePay className="text-[#5F6368] text-4xl" />
                        <BsFillCreditCard2FrontFill className="text-[#64748B] text-3xl" />
                        <SiAmericanexpress className="text-[#016FD0] text-4xl" />
                        <FaCcMastercard className="text-[#EB001B] text-4xl" />
                        <FaCcVisa className="text-[#1434CB] text-4xl" />
                    </div>
                </div>

            </div>

            <FeaturedSwiper headingTitle='You May Also Like' />
        </div>
    );
};

export default ProductsView;




