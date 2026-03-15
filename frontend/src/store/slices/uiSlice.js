import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pageTitle: '',
    breadcrumbOverride: null
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setPageTitle: (state, action) => {
            state.pageTitle = action.payload;
        },
        setBreadcrumbOverride: (state, action) => {
            state.breadcrumbOverride = action.payload;
        }
    }
});

export const { setPageTitle, setBreadcrumbOverride } = uiSlice.actions;
export default uiSlice.reducer;
