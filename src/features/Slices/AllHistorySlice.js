import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../../Services/Axios";

export const fetchAllHistory = createAsyncThunk(
  "allHistory/fetchAllHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/get-history");
      console.log("API History response:", response.data);
      return response.data; // Should be an array or { completeHistory: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch complete history"
      );
    }
  }
);

const HistorySlice = createSlice({
  name: 'allHistory',
  initialState: {
    completeHistory: [],
    loading: false,
    error: null,
  },
  
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.completeHistory = action.payload;
        console.log(state.completeHistory,'completeHistorys')
      })
      .addCase(fetchAllHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default HistorySlice.reducer;
