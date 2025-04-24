import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../../Services/Axios";

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/get-auditHistory");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  }
);

const HistorySlice = createSlice({
  name: 'history', // Changed to match store key
  initialState: {
    auditHistory: [],
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.auditHistory = action.payload.auditHistory;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default HistorySlice.reducer;