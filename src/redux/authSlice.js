// import { createSlice } from "@reduxjs/toolkit";


// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         loading: false,
//         user:null
//     },

//     reducers: {
//         setLoading: (state, action)=>{
//             state.loading = action.payload
//         },
//         setUser: (state, action) => {
//             state.user = action.payload
//         }
//     }
// })


// export const { setLoading, setUser } = authSlice.actions
// export default authSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",

    // App start hone par initially user null hoga
    // Backend se check hone ke baad user yahan set hoga
    initialState: {
        loading: true,
        user: null,
        isSearchOpen: false,
        searchDataRedux: ""
    },

    reducers: {

        // Backend se user milne ke baad
        // user ko Redux store mein save karenge
        setUser: (state, action) => {
            state.user = action.payload;
        },

        // Logout hone par user ko Redux se hata denge
        logout: (state) => {
            state.user = null;
        },

        // User check hone tak loading true rahegi
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSearchOpen: (state, action) => {
            state.isSearchOpen  = action.payload;
        },

        setSearchDataRedux: (state, action) => {
            state.searchDataRedux = action.payload;
        }
    },
});

// Ye actions components mein use karenge
export const {
    setUser,
    logout,
    setLoading,
    setSearchOpen,
    setSearchDataRedux
} = authSlice.actions;

// Ye reducer store mein jayega
export default authSlice.reducer;
