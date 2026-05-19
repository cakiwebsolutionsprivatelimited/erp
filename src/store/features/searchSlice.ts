import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
}

const initialState: SearchState = {
  query: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    resetSearchQuery: (state) => {
      state.query = '';
    },
  },
});

export const { setSearchQuery, resetSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
