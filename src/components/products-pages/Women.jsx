import axios from "../../api/axios";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { setFilter } from "@/redux/filterSlice";
import { useDispatch } from "react-redux";

const LIMIT = 12;

const Women = ({ filters }) => {
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch()

    // useEffect(() => { setPage(1); }, [filters]);  
    const MEN = "WOMEN"

    const [prevFilters, setPrevFilters] = useState(filters);
    if (filters !== prevFilters) {
        setPrevFilters(filters);
        setPage(1);
    }

    dispatch(setFilter(products))

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                if (filters?.price) {
                    params.set("minprice", filters.price.min);
                    params.set("maxprice", filters.price.max);
                }
                params.set("gender", MEN);
                if (filters?.category) params.set("category", filters.category);
                if (filters?.gender) params.set("gender", filters.gender);
                // if (filters.size) params.set("size", filters.size);
                params.set("page", page);
                params.set("limit", LIMIT);

                const res = await axios.get(`/api/product/?${params}`);

                setProducts(res.data.data);                          // ✅ products
                setTotalPages(res.data.pagination.totalPages);       // ✅ FIX — pagination object se

            } catch (err) {
                console.error("🚀 ~ getProducts ~ error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [filters, page]);

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

    // if (loading) return <p className="p-5">Loading...</p>;
    if (loading) {
            return (
                <div className="flex-1 p-3">
                    <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-4 gap-2 lg:mt-20">
                        {Array.from({ length: LIMIT }).map((_, index) => (
                            <ProductCard key={index} item={null} />
                        ))}
                    </div>
                </div>
            );
        }
    if (error) return <p className="p-5 text-red-500">Error: {error}</p>;

    return (
        <div className="flex-1 p-3 lg:mt-20">
            
            <h1 className="text-xl sm:text-2xl lg:text-4xl pb-1 font-sans">
                Women Collections{" "}
                <span className="text-sm sm:text-base lg:text-xl text-gray-500">
                    {products.length} Products
                </span>
                    <img src="https://plus.unsplash.com/premium_photo-1670282393321-b34c6a4695b0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="aspect-5/1.5 object-cover "/>
            </h1>
            <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-4 gap-2 lg:mt-5">
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map((item) => (
                        <ProductCard item={item} key={item.id} />
                    ))
                )}
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 bg-black text-white rounded disabled:opacity-40">Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={handleNext} disabled={page === totalPages} className="px-4 py-2 bg-black text-white rounded disabled:opacity-40">Next</button>
            </div>
        </div>
    );
};

export default Women;
