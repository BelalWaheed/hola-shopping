import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Theme = "light" | "dark" | "neon" | "minimal"

interface ThemeState {
  currentTheme: Theme
  systemTheme: "light" | "dark"
}

const initialState: ThemeState = {
  currentTheme: "light",
  systemTheme: "light",
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload
    },
    setSystemTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemTheme = action.payload
    },
  },
})

export const { setTheme, setSystemTheme } = themeSlice.actions
export default themeSlice.reducer
