// import { createSlice } from "@reduxjs/toolkit";


// const filterSlice = createSlice({
//     name: 'filter',
//     initialState: {
//         filter:null
//     },

//     reducers: {
//         setFilter: (state, action) => {
//             state.filter = action.payload
//         }
//     }
// })


// export const { setFilter } = filterSlice.actions
// export default filterSlice.reducer


import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filter",

    initialState: {
        filter: null,
        sort: null,
    },

    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },

        setSort: (state, action) => {
            state.sort = action.payload;
        },
    },
});

export const { setFilter, setSort } = filterSlice.actions;

export default filterSlice.reducer;