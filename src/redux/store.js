// import { configureStore } from '@reduxjs/toolkit';
// import authSlice from './authSlice.js';

// export const store = configureStore({
//     reducer: {
//         auth: authSlice
//     }
// });


import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import filterSlice from './filterSlice.js'
import productsSlice from './productsSlice.js'
import orderSlice from './orderSlice.js'

export const store = configureStore({
    reducer: {
        // auth ke andar user aur loading ki state rahegi
        auth: authSlice,
        filterStore: filterSlice,
        productsStore: productsSlice,
        orderStore:orderSlice
    },
});
