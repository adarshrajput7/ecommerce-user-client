
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import ProductCard from "../products-pages/ProductCard";
import { useDispatch } from "react-redux";
import { setFilter } from "@/redux/filterSlice";

const ProductDashboard = ({ propsInput }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  // Filters change hone par page 1 par reset
  useEffect(() => {
    setCurrentPage(1);
  }, [propsInput]);

  // API Call
  useEffect(() => {
    const getAllProducts = async () => {
      setLoading(true);

      try {
        const params = {
          page: currentPage,
          limit: 12,
        };

        // Price filters
        if (
          propsInput?.price?.min !== undefined &&
          propsInput?.price?.min !== null
        ) {
          params.minprice = propsInput.price.min;
        }

        if (
          propsInput?.price?.max !== undefined &&
          propsInput?.price?.max !== null
        ) {
          params.maxprice = propsInput.price.max;
        }

        // Search text
        if (propsInput?.q) {
          params.q = propsInput.q;
        }

        // Array filters
        if (propsInput?.category?.length) {
          params.category = propsInput.category.join(",");
        }

        if (propsInput?.gender?.length) {
          params.gender = propsInput.gender.join(",");
        }

        if (propsInput?.size?.length) {
          params.size = propsInput.size.join(",");
        }
        
        
        const res = await axios.get(
          "/api/product/",
          {
            params,
            withCredentials: true,
          }
        );


        console.log(
          "🚀 ~ Page",
          currentPage,
          "Products:",
          res.data.data
        );

        console.log(
          "🚀 ~ Pagination Meta:",
          res.data.pagination
        );

        setProducts(res.data.data);

        dispatch(setFilter(res.data))

        setPagination({
          totalPages: res.data.pagination.totalPages,
          hasNextPage: res.data.pagination.hasNextPage,
          hasPrevPage: res.data.pagination.hasPrevPage,
          totalProducts: res.data.pagination.totalProducts,
        });
      } catch (error) {
        console.error(
          "🚀 ~ Fetch error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, [propsInput, currentPage]);

  // Handlers
  const handlePrev = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {propsInput?.category}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {pagination.totalProducts} products found
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-75 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="text-sm font-medium text-gray-600">
                Loading 12 products...
              </p>
            </div>
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="flex min-h-75 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">
                Koi product nahi mila.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your filters or search.
              </p>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid lg:gap-5 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {products.map((item,key) => (
              <>
                {/* <div className="flex grid-cols-3"> */}
                  <ProductCard item={item} key={key} />
                  {/* <ProductCard item={item} key={key} />
                  <ProductCard item={item} key={key} /> */}
                {/* </div> */}
                </>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-4 sm:flex-row">

          {/* Previous */}
          <button
            onClick={handlePrev}
            disabled={!pagination.hasPrevPage || loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          {/* Page Info */}
          <div className="rounded-lg bg-white px-5 py-2.5 text-sm text-gray-600 shadow-sm">
            Page{" "}
            <strong className="text-gray-900">
              {currentPage}
            </strong>{" "}
            of{" "}
            <strong className="text-gray-900">
              {pagination.totalPages || 1}
            </strong>
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={!pagination.hasNextPage || loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;

