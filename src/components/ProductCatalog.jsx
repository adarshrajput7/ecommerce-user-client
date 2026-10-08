import React, { useState, useEffect, useCallback } from 'react';

export default function ProductCatalog() {
    // --- States ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // --- Filter & Pagination States ---
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // --- Backend Pagination Info ---
    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: 1,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    // 1. Search Bar Debounce (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // 2. Fetch Products Function
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            // Query parameters construct karna
            const params = new URLSearchParams();
            if (debouncedSearch.trim()) params.append('q', debouncedSearch.trim());
            if (minPrice) params.append('minprice', minPrice);
            if (maxPrice) params.append('maxprice', maxPrice);
            params.append('page', page.toString());
            params.append('limit', limit.toString());

            const url = `/api/product/?${params.toString()}`;




            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // const result = await response.json();

            // // 3. Output Check Karein
            // console.log("Full API Result:", result);
            // console.log("Products Array:", result.data); // Aapka products array

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            const resData = await response.json();

            if (resData && resData.data) {
                setProducts(resData.data);
                if (resData.pagination) {
                    setPaginationInfo({
                        totalPages: resData.pagination.totalPages || 1,
                        totalProducts: resData.pagination.totalProducts || 0,
                        hasNextPage: resData.pagination.hasNextPage || false,
                        hasPrevPage: resData.pagination.hasPrevPage || false,
                    });
                }
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            // "Failed to fetch" catch karna
            if (err.message.includes('Failed to fetch')) {
                setErrorMessage(
                    'Backend Server se connect nahi ho pa raha! Kripya check karein ki http://localhost:3001 par backend start hai ya nahi, aur Backend me `cors` enable hai.'
                );
            } else {
                setErrorMessage(err.message || 'Kuch galat ho gaya, dubara try karein.');
            }
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, minPrice, maxPrice, page, limit]);

    // 3. Effect trigger jab bhi parameters change hon
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Filter Reset Handler
    const handleReset = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setMinPrice('');
        setMaxPrice('');
        setPage(1);
        setLimit(10);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">

            {/* --- Header --- */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
                <button
                    onClick={fetchProducts}
                    className="text-sm bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* --- Filters Bar --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">

                {/* Search */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">SEARCH</label>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Min Price */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">MIN PRICE</label>
                    <input
                        type="number"
                        placeholder="₹ Min"
                        value={minPrice}
                        onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Max Price */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">MAX PRICE</label>
                    <input
                        type="number"
                        placeholder="₹ Max"
                        value={maxPrice}
                        onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Limit */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">PER PAGE</label>
                    <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5 Products</option>
                        <option value={10}>10 Products</option>
                        <option value={20}>20 Products</option>
                        <option value={50}>50 Products</option>
                    </select>
                </div>

                {/* Reset Button */}
                <div>
                    <button
                        onClick={handleReset}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* --- Error Alert Box --- */}
            {errorMessage && (
                <div className="p-4 mb-6 text-sm text-red-800 bg-red-100 border border-red-300 rounded-xl">
                    <p className="font-bold mb-1">❌ Connection Failed:</p>
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* --- Products Cards Grid --- */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(limit)].map((_, idx) => (
                        <div key={idx} className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id || product.id}
                            className="bg-white p-1 pb-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
                                    {product.images ? (
                                        <img src={product.images[4].url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs">No Image Available</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-800 text-base line-clamp-1">{product.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                    {product.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="text-lg font-bold text-blue-600">
                                    ₹{product.price?.amount ?? product.price ?? 0}
                                </span>
                                <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !errorMessage && (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">Koi product nahi mila.</p>
                        <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline">
                            Filters reset karein
                        </button>
                    </div>
                )
            )}

            {/* --- Pagination Bar --- */}
            {!loading && products.length > 0 && (
                <div className="mt-8 bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                        Showing Page <span className="font-semibold">{page}</span> of{' '}
                        <span className="font-semibold">{paginationInfo.totalPages}</span> ({paginationInfo.totalProducts} Total Items)
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={!paginationInfo.hasPrevPage}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition"
                        >
                            Previous
                        </button>
                        <button
                            disabled={!paginationInfo.hasNextPage}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}