import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchSectoralScopes = createAsyncThunk(
  'sectoralScope/fetchSectoralScopes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/sectoral-scopes/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addSectoralScope = createAsyncThunk(
  'sectoralScope/addSectoralScope',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/sectoral-scopes/create', payload);
      toast.success(res.data?.message || 'Sectoral Scope added!');
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

export const updateSectoralScope = createAsyncThunk(
    'sectoralScope/updateSectoralScope',
    async (payload, { rejectWithValue }) => {
      try {
        const response = await API.post(`/sectoral-scopes/edit/${payload.sectoralscope_Id}`, {
          sectoralscope_desc: payload.sectoralscope_desc  // Using lowercase key
        });
        toast.success(response.data?.message || 'Sectoral Scope updated successfully');
        return {
          id: payload.sectoralscope_Id,
          sectoralscope_desc: payload.sectoralscope_desc,  // Consistent lowercase
          response: response.data
        };
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update sectoral scope');
        return rejectWithValue(error.response?.data);
      }
    }
  );

export const deleteSectoralScope = createAsyncThunk(
  'sectoralScope/deleteSectoralScope',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/sectoral-scopes/delete/${id}`);
      toast.success(res.data?.message || 'Sectoral Scope deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete sectoral scope');
      return rejectWithValue(error.response?.data);
    }
  }
);

const SectoralScopeSlice = createSlice({
  name: 'sectoralScope',
  initialState: {
    sectoralScopes: {
      total: 0,
      pages: 0,
      currentPage: 1,
      sectoralscopes: []
    },
    status: 'idle',
    error: null,
    isModalOpen: false,
    currentSectoralScope: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    openSectoralScopeModal: (state, action) => {
      state.isModalOpen = true;
      state.currentSectoralScope = action.payload || null;
    },
    closeSectoralScopeModal: (state) => {
      state.isModalOpen = false;
      state.currentSectoralScope = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectoralScopes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSectoralScopes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sectoralScopes = action.payload;
      })
      .addCase(fetchSectoralScopes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addSectoralScope.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addSectoralScope.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        const maxId = state.sectoralScopes.sectoralscopes.length > 0 
          ? Math.max(...state.sectoralScopes.sectoralscopes.map(d => 
              typeof d.sectoralScopeId === 'number' ? d.sectoralScopeId : 0
            ))
          : 0;
        
        const newId = maxId + 1;
        
        const responseData = action.payload.response?.data || {};
        const submittedData = action.payload.payload;
        
        const newItem = {
          sectoralScopeId: responseData.id || newId,
          id: responseData.id || newId,
          sectoralscope_desc: submittedData.sectoralscope_desc,
          mode: "added",
          createdAt: new Date().toISOString()
        };
        
        if (state.sectoralScopes && state.sectoralScopes.sectoralscopes) {
          state.sectoralScopes.sectoralscopes = [
            newItem,
            ...state.sectoralScopes.sectoralscopes
          ];
          
          state.sectoralScopes.total = (state.sectoralScopes.total || 0) + 1;
        }
        
        state.isModalOpen = false;
        state.currentSectoralScope = null;
      })
      .addCase(addSectoralScope.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      .addCase(updateSectoralScope.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateSectoralScope.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.sectoralScopes && state.sectoralScopes.sectoralscopes) {
          state.sectoralScopes.sectoralscopes = state.sectoralScopes.sectoralscopes.map(
            sectoralScope => {
              if (sectoralScope.sectoralscopeId === action.payload.id || 
                  sectoralScope.id === action.payload.id) {
                return {
                  ...sectoralScope,
                  sectoralscope_desc: action.payload.sectoralscope_desc,
                  mode: "modified"
                };
              }
              return sectoralScope;
            }
          );
        }
        state.isModalOpen = false;
        state.currentSectoralScope = null;
      })
      .addCase(updateSectoralScope.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      .addCase(deleteSectoralScope.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteSectoralScope.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.sectoralScopes && state.sectoralScopes.sectoralscopes) {
          state.sectoralScopes.sectoralscopes = state.sectoralScopes.sectoralscopes.filter(
            (sectoralScope) => 
              sectoralScope.id !== action.payload && 
              sectoralScope.sectoralscopeId !== action.payload
          );
          
          if (state.sectoralScopes.total > 0) {
            state.sectoralScopes.total -= 1;
          }
        }
      })
      .addCase(deleteSectoralScope.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { openSectoralScopeModal, closeSectoralScopeModal } = SectoralScopeSlice.actions;
export default SectoralScopeSlice.reducer;