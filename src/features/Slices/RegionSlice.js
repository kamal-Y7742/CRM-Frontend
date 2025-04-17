import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchRegions = createAsyncThunk(
  'region/fetchRegions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/regions/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addRegion = createAsyncThunk(
  'region/addRegion',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/regions/bulk-create', payload);
      toast.success(res.data?.message || 'Region added!');
      return {
        payload,
        response: res.data
      };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add region');
      return rejectWithValue(err.response?.data);
    }
  }
);
export const updateRegion = createAsyncThunk(
  'region/updateRegion',
  async (payload, { rejectWithValue }) => {
    try {
      let response;

      if (Array.isArray(payload.regions)) {
        // Bulk update
        console.log("⏩ Bulk updating regions:", payload);
        response = await API.post('/regions/bulk-edit', payload);
      } else {
        // Single region update
        console.log("⏩ Updating single region:", payload);
        const regionID = payload.regionID || payload.regionId || payload.id;
        if (!regionID) throw new Error("No region ID provided for update.");
        response = await API.post(`/regions/bulk-edit/${regionID}`, payload);
      }

      toast.success(response.data?.message || 'Region updated successfully');
      return {
        ...payload,
        response: response.data
      };
    } catch (error) {
      console.error("⛔ Region update error:", error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update region');
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


export const deleteRegion = createAsyncThunk(
  'region/deleteRegion',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/regions/delete/${id}`);
      toast.success(res.data?.message || 'Region deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete region');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  regions: {
    total: 0,
    pages: 0,
    currentPage: 1,
    regions: []
  },
  status: 'idle',
  error: null,
  isModalOpen: false,
  currentRegion: null,
  operationStatus: 'idle',
  operationError: null,
};

const RegionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    openRegionModal: (state, action) => {
      state.isModalOpen = true;
      state.currentRegion = action.payload || null;
    },
    closeRegionModal: (state) => {
      state.isModalOpen = false;
      state.currentRegion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regions = action.payload;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addRegion.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addRegion.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        const newItem = {
          ...action.payload.payload,
          regionId: action.payload.response?.data?.id || Date.now(),
          mode: "added",
          createdAt: new Date().toISOString()
        };
        state.regions.regions = [newItem, ...state.regions.regions];
        state.regions.total += 1;
        state.isModalOpen = false;
      })
      .addCase(updateRegion.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        state.regions.regions = state.regions.regions.map(item => 
          item.regionId === action.payload.id ? { ...item, ...action.payload, mode: "modified" } : item
        );
        state.isModalOpen = false;
      })
      .addCase(deleteRegion.pending, (state) => {
        state.operationStatus = 'loading';
      })
         .addCase(deleteRegion.fulfilled, (state, action) => {
              state.operationStatus = 'idle';
              state.regions.regions = state.regions.regions.filter(
                item => item.regionID !== action.payload
              );
              state.regions.total -= 1;
            });
      
  },
});

export const { openRegionModal, closeRegionModal } = RegionSlice.actions;
export default RegionSlice.reducer;