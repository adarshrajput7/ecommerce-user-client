import { createSlice } from "@reduxjs/toolkit";


const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products:null
    },
     
    reducers: {
        setProductsRedux: (state, action) => {
            state.products = action.payload
        }
    }
})

export const { setProductsRedux } = productsSlice.actions
export default productsSlice.reducer