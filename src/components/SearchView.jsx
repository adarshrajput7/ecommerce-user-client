import axios from "../api/axios";
import { useEffect, useState } from "react";
// import { setFilter } from "@/redux/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setProductsRedux } from "@/redux/productsSlice";
import ProductCard from "./products-pages/ProductCard";

const LIMIT = 12;

const SearchView = ({ filters }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // URL se initial page read karo
    const initialPage = Number(searchParams.get("page")) || 1;
    const [page, setPage] = useState(initialPage);

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {searchDataRedux} = useSelector((store)=>store.auth)
    const dispatch = useDispatch();
    const search = searchDataRedux
    console.error("🚀 ~ SearchView ~ search:", search)

    const [prevFilters, setPrevFilters] = useState(filters);
    if (filters !== prevFilters) {
        setPrevFilters(filters);
        setPage(1);
        setSearchParams({ page: 1 }); // filter change hone par URL bhi reset
    }

    useEffect(() => {
        // dispatch(setFilter(products));
        dispatch(setProductsRedux(products))
    }, [products, dispatch]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                if (search) params.set("q", search);
                if (filters?.price) {
                    params.set("minprice", filters.price.min);
                    params.set("maxprice", filters.price.max);
                }
                if (filters?.gender) params.set("gender", filters.gender);
                if (filters?.category) params.set("category", filters.category);
                params.set("page", page);
                params.set("limit", LIMIT);

                const res = await axios.get(`/api/product/?${params}`);
                setProducts(res.data.data);
                setTotalPages(res.data.pagination.totalPages);
            } catch (err) {
                console.error("🚀 ~ getProducts ~ error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [filters, page]);

    // Page change hone par URL update karo
    useEffect(() => {
        setSearchParams({ page });
    }, [page, setSearchParams]);

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

    if (error) return <p className="p-5 text-red-500">Error: {error}</p>;

    return (
        <div className="flex-1 p-3 lg:mt-20">
            <h1 className="text-xl lg:text-2xl pb-1 font-bold text-center">   
                <span className="text-sm sm:text-base font-light lg:text-xl text-gray-500">
                    {products.length} {' '}Results found for 
                </span>
                "{search}"
            </h1>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4 lg:mt-10">
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map((item, index) => (
                        <ProductCard item={item} key={item.id} index={index} />
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

export default SearchView;
