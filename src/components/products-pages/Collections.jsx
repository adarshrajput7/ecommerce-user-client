// import axios from "axios"
// import { useEffect, useState } from "react"
// import ProductCard from "../products/ProductCard";


// const Collections = ({ filters }) => {
//     console.log(filters)
//     const [page, setPage] = useState(1);
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const getProducts = async () => {
//             try {

//                 const params = new URLSearchParams();

//                 if (filters.price) {
//                     params.set("minprice", filters.price.min);
//                     params.set("maxprice", filters.price.max);
//                 }

//                 if (filters.gender) {
//                     params.set('gender', filters.gender)
//                 }

//                 if (filters.category) {
//                     params.set('category', filters.category)
//                 }

//                 params.set('page',page)
//                 params.set('limit',12)

//                 const res = await axios.get(`http://localhost:5000/api/product/?${params}`)

//                 console.log(res.data);
//                 setProducts(res.data.data);


//             } catch (error) {
//                 console.error("🚀 ~ getProducts ~ error:", error)
//             }
//         }
//         getProducts()
//     },[filters])

//     return (
//         <div className="">

//             {products.map((item, key) => (
//                 <ProductCard item={item} key={key} />
//             ))}

//         </div>
//     )
// }

// export default Collections



// import axios from "axios";
// import { useEffect, useState } from "react";
// import { setFilter } from "@/redux/filterSlice";
// import { useDispatch } from "react-redux";
// import ProductCard from "./ProductCard";

// const LIMIT = 12;

// const Collections = ({ filters }) => {
//     const [page, setPage] = useState(1);
//     const [products, setProducts] = useState([]);
//     const [totalPages, setTotalPages] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const dispatch = useDispatch()

//     // useEffect(() => { setPage(1); }, [filters]);

//     const [prevFilters, setPrevFilters] = useState(filters);
//     if (filters !== prevFilters) {
//         setPrevFilters(filters);
//         setPage(1);
//     }

//     dispatch(setFilter(products))

//     useEffect(() => {
//         const getProducts = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 const params = new URLSearchParams();
//                 if (filters?.price) {
//                     params.set("minprice", filters.price.min);
//                     params.set("maxprice", filters.price.max);
//                 }
//                 if (filters?.gender) params.set("gender", filters.gender);
//                 if (filters?.category) params.set("category", filters.category);
//                 // if (filters.size) params.set("size", filters.size);
//                 params.set("page", page);
//                 params.set("limit", LIMIT);

//                 const res = await axios.get(`http://localhost:5000/api/product/?${params}`);

//                 setProducts(res.data.data);                          // ✅ products
//                 setTotalPages(res.data.pagination.totalPages);       // ✅ FIX — pagination object se

//             } catch (err) {
//                 console.error("🚀 ~ getProducts ~ error:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         getProducts();
//     }, [filters, page]);

//     const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
//     const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

//     if (loading) return <p className="p-5">Loading...</p>;
//     if (error) return <p className="p-5 text-red-500">Error: {error}</p>;

//     return (
//         <div className="flex-1 p-5">
//             <div className="grid md:grid-cols-3 grid-cols-2 gap-4 lg:mt-20">
//                 {products.length === 0 ? (
//                     <p>No products found</p>
//                 ) : (
//                     products.map((item) => (
//                         <ProductCard item={item} key={item.id} />
//                     ))
//                 )}
//             </div>

//             <div className="flex items-center justify-center gap-4 mt-6">
//                 <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 bg-black text-white rounded disabled:opacity-40">Prev</button>
//                 <span>Page {page} of {totalPages}</span>
//                 <button onClick={handleNext} disabled={page === totalPages} className="px-4 py-2 bg-black text-white rounded disabled:opacity-40">Next</button>
//             </div>
//         </div>
//     );
// };

// export default Collections;


import axios from "../../api/axios";
import { useEffect, useState } from "react";
// import { setFilter } from "@/redux/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { setProductsRedux } from "@/redux/productsSlice";

const LIMIT = 12;

const Collections = ({ filters }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {sort} = useSelector(store=>store.filterStore);

    // URL se initial page read karo
    const initialPage = Number(searchParams.get("page")) || 1;
    const [page, setPage] = useState(initialPage);

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    console.log(products)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

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
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4 lg:mt-20">
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
        <div className="flex-1 p-3">
            <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-4 gap-2 lg:mt-20">
                {/* {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map((item, index) => (
                        <ProductCard item={item} key={item.id} index={index} />
                    ))
                )} */}
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    [...products]
                        .sort((a, b) => {
                            if (sort === "low") {
                                return a.price.amount - b.price.amount;
                            }

                            if (sort === "high") {
                                return b.price.amount - a.price.amount;
                            }

                            return 0;
                        })
                        .map((item, index) => (
                            <ProductCard
                                item={item}
                                key={item._id}
                                index={index}
                            />
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

export default Collections;
