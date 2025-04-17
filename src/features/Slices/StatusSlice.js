import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchStatuses = createAsyncThunk(
  'status/fetchStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/status/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addStatus = createAsyncThunk(
  'status/addStatus',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/status/create', payload);
      toast.success(res.data?.message || 'Status added!');
      return {
        payload,
        response: res.data
      };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateStatus = createAsyncThunk(
  'status/updateStatus',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post(`/status/edit/${payload.status_Id}`, {
        status_desc: payload.status_desc
      });
      toast.success(response.data?.message || 'Status updated successfully');
      return {
        id: payload.status_Id,
        status_desc: payload.status_desc,
        response: response.data
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteStatus = createAsyncThunk(
  'status/deleteStatus',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/status/delete/${id}`);
      toast.success(res.data?.message || 'Status deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete status');
      return rejectWithValue(error.response?.data);
    }
  }
);

const StatusSlice = createSlice({
  name: 'status',
  initialState: {
    statuss: {
      total: 0,
      pages: 0,
      currentPage: 1,
      statuss: []
    },
    status: 'idle',
    error: null,
    isModalOpen: false,
    currentStatus: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    openStatusModal: (state, action) => {
      state.isModalOpen = true;
      state.currentStatus = action.payload || null;
    },
    closeStatusModal: (state) => {
      state.isModalOpen = false;
      state.currentStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.statuss = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addStatus.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addStatus.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        const maxId = state.statuss.statuss.length > 0 
          ? Math.max(...state.statuss.statuss.map(d => 
              typeof d.statusId === 'number' ? d.statusId : 0
            ))
          : 0;
        
        const newId = maxId + 1;
        
        const responseData = action.payload.response?.data || {};
        const submittedData = action.payload.payload;
        
        const newItem = {
          statusId: responseData.id || newId,
          id: responseData.id || newId,
          status_desc: submittedData.status_desc,
          mode: "added",
          createdAt: new Date().toISOString()
        };
        
        if (state.statuss && state.statuss.statuss) {
          state.statuss.statuss = [
            newItem,
            ...state.statuss.statuss
          ];
          state.statuss.total = (state.statuss.total || 0) + 1;
        }
        
        state.isModalOpen = false;
        state.currentStatus = null;
      })
      .addCase(addStatus.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      .addCase(updateStatus.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.statuss && state.statuss.statuss) {
          state.statuss.statuss = state.statuss.statuss.map(
            status => {
              if (status.statusId === action.payload.id || 
                  status.id === action.payload.id) {
                return {
                  ...status,
                  status_desc: action.payload.status_desc,
                  mode: "modified"
                };
              }
              return status;
            }
          );
        }
        state.isModalOpen = false;
        state.currentStatus = null;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      .addCase(deleteStatus.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.statuss && state.statuss.statuss) {
          state.statuss.statuss = state.statuss.statuss.filter(
            (status) => 
              status.id !== action.payload && 
              status.statusId !== action.payload
          );
          
          if (state.statuss.total > 0) {
            state.statuss.total -= 1;
          }
        }
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { openStatusModal, closeStatusModal } = StatusSlice.actions;
export default StatusSlice.reducer;