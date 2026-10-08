
import { useEffect, useState } from "react";

const FILTERS = {
    price: [
        { label: "₹0 - ₹2,000", min: 0, max: 2000 },
        { label: "₹2,000 - ₹4,000", min: 2000, max: 4000 },
        { label: "₹4,000 - ₹10,000", min: 4000, max: 10000 },
        { label: "₹10,000 - ₹15,000", min: 10000, max: 15000 },
    ],
    gender: ["MEN", "WOMEN"],
    category: ["FOOTWEAR", "CLOTHING", "MOBILES", "ACTIVE_LIFESTYLE"],
    size: ["S", "M", "L"],
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [price, setPrice] = useState(null);
    const [gender, setGender] = useState("");
    const [category, setCategory] = useState("");
    const [size, setSize] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.set("q", search);
                if (price) {
                    params.set("minprice", price.min);
                    params.set("maxprice", price.max);
                }
                if (gender) params.set("gender", gender);
                if (category) params.set("category", category);
                if (size) params.set("size", size);
                params.set("page", page);
                params.set("limit", 12);

                const res = await fetch(`/api/product/?${params}`);
                const result = await res.json();

                if (result.success) {
                    setProducts(result.data);
                    setPagination(result.pagination);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [search, price, gender, category, size, page]);

    const clearFilters = () => {
        setSearch("");
        setPrice(null);
        setGender("");
        setCategory("");
        setSize("");
        setPage(1);
    };

    const selectFilter = (setter, value) => {
        setter(value);
        setPage(1);
    };

    return (
        <div className="flex w-full gap-6 p-6 mt-20">
            <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r pr-5">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold">Filters</h2>
                    <button onClick={clearFilters} className="text-sm underline">Clear</button>
                </div>

                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="mb-6 w-full rounded border px-3 py-2 text-sm outline-none" />

                <Filter title="PRICE" >
                    {FILTERS.price.map((item) => (
                        <label key={item.label} className="flex gap-2 text-sm bg-pink-400">
                            <input type="checkbox" checked={price?.label === item.label} onChange={() => selectFilter(setPrice, price?.label === item.label ? null : item)} />
                            {item.label}
                        </label>
                    ))}
                </Filter>

                <Filter title="GENDER">
                    {FILTERS.gender.map((item) => (
                        <label key={item} className="flex gap-2 text-sm">
                            <input type="checkbox" checked={gender === item} onChange={() => selectFilter(setGender, gender === item ? "" : item)} />
                            {item}
                        </label>
                    ))}
                </Filter>

                <Filter title="CATEGORY">
                    {FILTERS.category.map((item) => (
                        <label key={item} className="flex gap-2 text-sm">
                            <input type="checkbox" checked={category === item} onChange={() => selectFilter(setCategory, category === item ? "" : item)} />
                            {item}
                        </label>
                    ))}
                </Filter>

                <Filter title="SIZE">
                    {FILTERS.size.map((item) => (
                        <label key={item} className="flex gap-2 text-sm">
                            <input type="checkbox" checked={size === item} onChange={() => selectFilter(setSize, size === item ? "" : item)} />
                            {item}
                        </label>
                    ))}
                </Filter>
            </aside>

            <main className="min-w-0 flex-1">
                <div className="mb-5">
                    <h1 className="text-xl font-semibold">All Products</h1>
                    <p className="text-sm text-gray-500">{pagination.totalProducts || 0} products</p>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <div key={product._id} className="overflow-hidden rounded border">
                                <img src={product.images?.[0].url} alt={product.title} className="aspect-square w-full object-cover" />
                                <div className="p-3">
                                    <h3 className="truncate text-sm font-medium">{product.title}</h3>
                                    <p className="mt-2 font-semibold">₹{product.price?.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button disabled={!pagination.hasPrevPage} onClick={() => setPage(page - 1)} className="rounded border px-4 py-2 disabled:opacity-40">Previous</button>
                        <span>Page {pagination.currentPage} / {pagination.totalPages}</span>
                        <button disabled={!pagination.hasNextPage} onClick={() => setPage(page + 1)} className="rounded bg-black px-4 py-2 text-white disabled:opacity-40">Next</button>
                    </div>
                )}
            </main>
        </div>
    );
}

function Filter({ title, children }) {
    return (
        <div className="border-b py-4">
            <h3 className="mb-3 text-xs font-bold">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}