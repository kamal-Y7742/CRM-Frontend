import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchScopes = createAsyncThunk(
  'scope/fetchScopes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/scopes/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addScope = createAsyncThunk(
  'scope/addScope',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/scopes/create', payload);
      toast.success(res.data?.message || 'Scope added!');
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

export const updateScope = createAsyncThunk(
  'scope/updateScope',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post(`/scopes/edit/${payload.scope_Id}`, {
        scope_desc: payload.scope_desc
      });
      toast.success(response.data?.message || 'Scope updated successfully');
      return {
        id: payload.scope_Id,
        scope_desc: payload.scope_desc,
        response: response.data
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update scope');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteScope = createAsyncThunk(
  'scope/deleteScope',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/scopes/delete/${id}`);
      toast.success(res.data?.message || 'Scope deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete scope');
      return rejectWithValue(error.response?.data);
    }
  }
);

const ScopeSlice = createSlice({
  name: 'scope',
  initialState: {
    scopes: {
      total: 0,
      pages: 0,
      currentPage: 1,
      scopes: []
    },
    status: 'idle',
    error: null,
    isModalOpen: false,
    currentScope: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    openScopeModal: (state, action) => {
      state.isModalOpen = true;
      state.currentScope = action.payload || null;
    },
    closeScopeModal: (state) => {
      state.isModalOpen = false;
      state.currentScope = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScopes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScopes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.scopes = action.payload;
      })
      .addCase(fetchScopes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addScope.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addScope.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        const maxId = state.scopes.scopes.length > 0 
          ? Math.max(...state.scopes.scopes.map(d => 
              typeof d.scopeId === 'number' ? d.scopeId : 0
            ))
          : 0;
        
        const newId = maxId + 1;
        
        const responseData = action.payload.response?.data || {};
        const submittedData = action.payload.payload;
        
        const newItem = {
          scopeId: responseData.id || newId,
          id: responseData.id || newId,
          scope_desc: submittedData.scope_desc,
          mode: "added",
          createdAt: new Date().toISOString()
        };
        
        if (state.scopes && state.scopes.scopes) {
          state.scopes.scopes = [
            newItem,
            ...state.scopes.scopes
          ];
          
          state.scopes.total = (state.scopes.total || 0) + 1;
        }
        
        state.isModalOpen = false;
        state.currentScope = null;
      })
      .addCase(addScope.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      .addCase(updateScope.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateScope.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.scopes && state.scopes.scopes) {
          state.scopes.scopes = state.scopes.scopes.map(
            scope => {
              if (scope.scopeId === action.payload.id || 
                  scope.id === action.payload.id) {
                return {
                  ...scope,
                  scope_desc: action.payload.scope_desc,
                  mode: "modified"
                };
              }
              return scope;
            }
          );
        }
        state.isModalOpen = false;
        state.currentScope = null;
      })
      .addCase(updateScope.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      .addCase(deleteScope.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteScope.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.scopes && state.scopes.scopes) {
          state.scopes.scopes = state.scopes.scopes.filter(
            (scope) => 
              scope.id !== action.payload && 
              scope.scopeId !== action.payload
          );
          
          if (state.scopes.total > 0) {
            state.scopes.total -= 1;
          }
        }
      })
      .addCase(deleteScope.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { openScopeModal, closeScopeModal } = ScopeSlice.actions;
export default ScopeSlice.reducer;