import { createSlice } from "@reduxjs/toolkit";


const orderSlice = createSlice({
    name: 'order',
    initialState: {
        refreshTrigger: 0,
        orderGet: null
    },
    reducers: {
        setOrderRedux: (state, action) => {
            state.orderGet = action.payload
        },
        setTriggerRefresh: (state) => {
            state.refreshTrigger  += 1;
        },
    }
})

export const { setOrderRedux,setTriggerRefresh } = orderSlice.actions
export default orderSlice.reducer
