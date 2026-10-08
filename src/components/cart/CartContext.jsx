import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { refreshTrigger } = useSelector(store => store.orderStore)

    const getCartProducts = useCallback(async () => {
        try {
            setLoading(true);

            // 1. Cart data fetch
            const cartRes = await axios.get(
                "/api/cart/",
                { withCredentials: true }
            );

            const items = cartRes.data?.cart?.items || [];

            // 2. Parallel Product Details Fetch
            const products = await Promise.all(
                items.map(async (item) => {
                    const res = await axios.get(
                        `/api/product/${item.productId}`,
                        { withCredentials: true }
                    );

                    return {
                        ...res.data?.data,
                        quantity: item.quantity,
                        size: item.size,
                        cartItemId: item._id
                    };
                })
            );

            setCartItems(products);

        } catch (error) {
            console.error("Get cart error:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCartProducts();
    }, [getCartProducts,refreshTrigger]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                getCartProducts
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);