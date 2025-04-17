import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchDesignations = createAsyncThunk(
  'designation/fetchDesignations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/designations/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addDesignation = createAsyncThunk(
  'designation/addDesignation',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/designations/create', payload);
      toast.success(res.data?.message || 'Designation added!');
      return {
        payload,
        response: res.data
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateDesignation = createAsyncThunk(
  'designation/updateDesignation',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post(`/designations/edit/${payload.designation_Id}`, {
        designation_desc: payload.designation_desc
      });
      toast.success(response.data?.message || 'Designation updated successfully');
      return {
        id: payload.designation_Id,
        designation_desc: payload.designation_desc,
        response: response.data
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update designation');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteDesignation = createAsyncThunk(
  'designation/deleteDesignation',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/designations/delete/${id}`);
      toast.success(res.data?.message || 'Designation deleted successfully');
      return id; // Return the deleted ID
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete designation');
      return rejectWithValue(error.response?.data);
    }
  }
);

const DesignationSlice = createSlice({
  name: 'designation',
  initialState: {
    designations: {
      total: 0,
      pages: 0,
      currentPage: 1,
      designations: []
    },
    status: 'idle',
    error: null,
    isModalOpen: false,
    currentDesignation: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    openDesignationModal: (state, action) => {
      state.isModalOpen = true;
      state.currentDesignation = action.payload || null;
    },
    closeDesignationModal: (state) => {
      state.isModalOpen = false;
      state.currentDesignation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designations = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addDesignation.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addDesignation.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        // Generate a new unique ID if one isn't provided by the API
        // Since we don't get the ID back from the API response, we'll generate one
        // In a real app, you might want to use a library like uuid instead
        const maxId = state.designations.designations.length > 0 
          ? Math.max(...state.designations.designations.map(d => 
              typeof d.designationId === 'number' ? d.designationId : 0
            ))
          : 0;
        
        const newId = maxId + 1;
        
        // Get the response data and payload data
        const responseData = action.payload.response?.data || {};
        const submittedData = action.payload.payload;
        
        // Create a properly structured new item with mode 'added'
        const newItem = {
          designationId: responseData.id || newId,
          id: responseData.id || newId,
          designation_desc: submittedData.designation_desc,
          mode: "added",
          createdAt: new Date().toISOString()
        };
        
        // Insert the new item at the beginning of the array
        if (state.designations && state.designations.designations) {
          // Add at the beginning of the array
          state.designations.designations = [
            newItem,
            ...state.designations.designations
          ];
          
          // Update total count
          state.designations.total = (state.designations.total || 0) + 1;
        }
        
        state.isModalOpen = false;
        state.currentDesignation = null;
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      .addCase(updateDesignation.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.designations && state.designations.designations) {
          state.designations.designations = state.designations.designations.map(
            designation => {
              if (designation.designationId === action.payload.id || 
                  designation.id === action.payload.id) {
                return {
                  ...designation,
                  designation_desc: action.payload.designation_desc,
                  mode: "modified" // Add mode as modified
                };
              }
              return designation;
            }
          );
        }
        state.isModalOpen = false;
        state.currentDesignation = null;
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      .addCase(deleteDesignation.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.designations && state.designations.designations) {
          // Remove the item from the array
          state.designations.designations = state.designations.designations.filter(
            (designation) => 
              designation.id !== action.payload && 
              designation.designationId !== action.payload
          );
          
          // Update total count
          if (state.designations.total > 0) {
            state.designations.total -= 1;
          }
        }
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { openDesignationModal, closeDesignationModal } = DesignationSlice.actions;
export default DesignationSlice.reducer;