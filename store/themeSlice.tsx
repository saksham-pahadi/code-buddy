import { createSlice } from '@reduxjs/toolkit';





type ThemeState = {
  mode: 'light' | 'dark';
};

const initialState: ThemeState = {
  mode: "light",
};
console.log("Initial theme state:", initialState.mode);
console.log("Initial theme state type:", typeof initialState.mode);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setDark: (state) => {
      state.mode = 'dark';
     
    },
    setLight: (state) => {
      state.mode = 'light';
      
    },
  },
});

export const { toggleTheme, setDark, setLight } = themeSlice.actions;
export default themeSlice.reducer;
