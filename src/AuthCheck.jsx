import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "./api/axios";

import {
    setUser,
    logout,
    setLoading,
} from "./redux/authSlice.js";

const AuthCheck = () => {

    // Redux mein data bhejne ke liye dispatch use kar rahe hain
    const dispatch = useDispatch();

    useEffect(() => {

        // Ye function backend se check karega
        // ki user already login hai ya nahi
        const checkLogin = async () => {
            
            try {
                // Backend ke /me API ko call kar rahe hain
                //
                // Browser automatically token wali
                // HttpOnly cookie backend ko bhej dega
                const response = await axios.get(
                    "/api/auth/me",
                    {
                        // Cookie ko request ke saath bhejna zaroori hai
                        withCredentials: true,
                    }
                );
                console.log('✅auth check: ',response)
                // Agar backend ne user bhej diya
                // to user ko Redux store mein save kar do
                dispatch(setUser(response.data.user));
                
            } catch (error) {
                
                // Agar:
                // 1. Cookie nahi hai
                // 2. Token expire ho gaya
                // 3. Token invalid hai
                // 4. User database mein nahi mila
                //
                // to user ko logout state mein kar do
                console.error("🚀 ~ checkLogin ~ error:", error)
                dispatch(logout());

            } finally {

                // User check ho gaya
                // ab loading band kar do
                dispatch(setLoading(false));
            }
        };

        // Page open/refresh hone par checkLogin chalega
        checkLogin();

    }, [dispatch]);


    // Is component ko screen par kuch dikhana nahi hai
    return null;
};

export default AuthCheck;
