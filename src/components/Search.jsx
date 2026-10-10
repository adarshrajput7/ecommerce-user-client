import { useDispatch, useSelector } from "react-redux";
import { setSearchDataRedux, setSearchOpen } from "@/redux/authSlice";
import { CircleX, Smartphone, Footprints, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { GiClothes } from "react-icons/gi";
import { MdSportsHandball } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "../api/axios";

const Search = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isSearchOpen } = useSelector((store) => store.auth);

    const [searchData, setSearchData] = useState("");
    const [products, setProducts] = useState([]);
    // console.log("🚀 ~ Search ~ products:", products)

    const getSearchData = async () => {
        try {
            if (!searchData?.trim()) {
                setProducts([]);
                return;
            }

            const params = new URLSearchParams();
            if (searchData) params.set("q", searchData.trim());
            params.set("page", "1");
            params.set("limit", "12");

            const res = await axios.get(`/api/product/?${params}`);
            const result = res.data

            if (result.success) {
                setProducts(result.data || []);
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            getSearchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchData]);

    const handleViewMore = () => {
        dispatch(setSearchOpen(false));
        dispatch(setSearchDataRedux(searchData));
        setTimeout(() => {
            navigate(`/search`);
        }, 0);
    };




    const goToView = (id) => {
        dispatch(setSearchOpen(false));
        setTimeout(() => {
            navigate(`/view/${id}`);
        }, 0);
    };



    if (!isSearchOpen) return null;

    return (
        // <div className="fixed inset-0 z-50000 bg-white h-[85vh] flex flex-col overflow-y-auto lg:mt-0 mt-15">
        <div data-lenis-prevent className="fixed inset-0 z-50000 bg-white lg:max-h-[85vh] lg:h-fit h-screen pb-10 flex flex-col overflow-y-auto lg:mt-0 mt-15 shadow-2xl transition-all duration-300 ease-in-out animate-in slide-in-from-top">
            {/* Header / Input */}
            <div className="flex items-center justify-center gap-3 border-b ;g:px-6 px-3 lg:px-15 py-5 bg-white sticky top-0 z-10">
                <input
                    autoFocus
                    type="text"
                    placeholder="Search For Products..."
                    onChange={(e) => setSearchData(e.target.value)}
                    value={searchData}
                    className="flex-1 bg-transparent text-sm lg:text-lg border-2 border-black p-2 lg:p-5 outline-none"
                />

                <button
                    onClick={() => dispatch(setSearchOpen(false))}
                    className="text-3xl text-gray-500 hover:text-black transition lg:block hidden"
                >
                    <CircleX size={30} />
                </button>
            </div>

            {/* Popular Searches */}
            <div className="text-xl lg:text-3xl px-6 lg:px-15 font-bold my-4">
                <h1 className="mb-2">Popular Searches</h1>
                <div className="flex lg:gap-5 gap-2 flex-wrap">
                    <p
                        onClick={() => setSearchData("footwear")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 cursor-pointer transition"
                    >
                        <Footprints size={18} /> Footwear
                    </p>

                    <p
                        onClick={() => setSearchData("Mobiles")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 cursor-pointer transition"
                    >
                        <Smartphone size={18} /> Mobiles
                    </p>

                    <p
                        onClick={() => setSearchData("CLOTHING")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 cursor-pointer transition"
                    >
                        <GiClothes size={18} /> Clothes
                    </p>

                    <p
                        onClick={() => setSearchData("Active_LifeStyle")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 cursor-pointer transition"
                    >
                        <MdSportsHandball size={18} /> Active LifeStyle
                    </p>
                </div>
            </div>

            {/* Products List / Swiper */}
            <div className="px-2 lg:px-15 py-4 flex flex-col gap-4">
                {searchData?.trim() && products?.length > 0 && (
                    <div onClick={() => navigate('/')} className="w-full">
                        {/* 📱 Phone & Tablet: Vertical List */}
                        <div className="flex flex-col gap-1 lg:hidden">
                            {products.map((item) => (
                                <div onClick={() => { goToView(item._id) }}
                                    key={item._id || item.id}
                                    className="flex items-center gap-3 p-2.5 border rounded-lg hover:border-black cursor-pointer bg-white"
                                >
                                    <img
                                        src={item?.images?.[0]?.url || item?.image}
                                        alt={item?.title}
                                        className="w-14 h-14 object-cover rounded-md bg-gray-100 shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm text-gray-900 truncate line-clamp-1">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden lg:block w-full ">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 ">
                                {products.map((item) => (
                                    <div
                                        key={item._id || item.id}
                                        className="w-65 shrink-0 "
                                    >
                                        <div onClick={() => { goToView(item._id) }} className="border rounded-xl p-2 hover:border-black transition cursor-pointer bg-white flex flex-col h-full">
                                            <div className="w-full h-65 rounded-lg overflow-hidden bg-gray-50 mb-2.5 flex items-center justify-center">
                                                <img
                                                    src={item?.images?.[0]?.url || item?.image}
                                                    alt={item?.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-all duration-300 ease-in-out pointer-events-none"
                                                    draggable={false}
                                                />
                                            </div>
                                            <p className="font-semibold text-sm text-gray-900 truncate line-clamp-1">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.category}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🔘 Load More Button */}
                        <div className="flex justify-center mt-6 pb-6">
                            <button
                                onClick={handleViewMore}
                                className="flex items-center gap-2 bg-[#00FFFF] text-black px-8 py-3 mb-25 rounded-full text-sm font-semibold hover:bg-[#00efef] transition active:scale-95 shadow-md"
                            >
                                View All
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;