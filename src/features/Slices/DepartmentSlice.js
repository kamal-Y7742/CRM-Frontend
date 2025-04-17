import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchDepartments = createAsyncThunk(
  'department/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/departments/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addDepartment = createAsyncThunk(
  'department/addDepartment',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/departments/create', payload);
      toast.success(res.data?.message || 'Department added!');
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

export const updateDepartment = createAsyncThunk(
  'department/updateDepartment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post(`/departments/edit/${payload.department_Id}`, {
        department_desc: payload.department_desc
      });
      toast.success(response.data?.message || 'Department updated successfully');
      return {
        id: payload.department_Id,
        department_desc: payload.department_desc,
        response: response.data
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update department');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'department/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/departments/delete/${id}`);
      toast.success(res.data?.message || 'Department deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
      return rejectWithValue(error.response?.data);
    }
  }
);

const DepartmentSlice = createSlice({
  name: 'department',
  initialState: {
    departments: {
      total: 0,
      pages: 0,
      currentPage: 1,
      departments: []
    },
    status: 'idle',
    error: null,
    isModalOpen: false,
    currentDepartment: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    openDepartmentModal: (state, action) => {
      state.isModalOpen = true;
      state.currentDepartment = action.payload || null;
    },
    closeDepartmentModal: (state) => {
      state.isModalOpen = false;
      state.currentDepartment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addDepartment.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        // Generate a new unique ID if one isn't provided by the API
        const maxId = state.departments.departments.length > 0 
          ? Math.max(...state.departments.departments.map(d => 
              typeof d.departmentId === 'number' ? d.departmentId : 0
            ))
          : 0;
        
        const newId = maxId + 1;
        
        // Get the response data and payload data
        const responseData = action.payload.response?.data || {};
        const submittedData = action.payload.payload;
        
        // Create a properly structured new item with mode 'added'
        const newItem = {
          departmentId: responseData.id || newId,
          id: responseData.id || newId,
          department_desc: submittedData.department_desc,
          mode: "added",
          createdAt: new Date().toISOString()
        };
        
        // Insert the new item at the beginning of the array
        if (state.departments && state.departments.departments) {
          state.departments.departments = [
            newItem,
            ...state.departments.departments
          ];
          
          // Update total count
          state.departments.total = (state.departments.total || 0) + 1;
        }
        
        state.isModalOpen = false;
        state.currentDepartment = null;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      .addCase(updateDepartment.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.departments && state.departments.departments) {
          state.departments.departments = state.departments.departments.map(
            department => {
              if (department.departmentId === action.payload.id || 
                  department.id === action.payload.id) {
                return {
                  ...department,
                  department_desc: action.payload.department_desc,
                  mode: "modified"
                };
              }
              return department;
            }
          );
        }
        state.isModalOpen = false;
        state.currentDepartment = null;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      .addCase(deleteDepartment.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.departments && state.departments.departments) {
          // Remove the item from the array
          state.departments.departments = state.departments.departments.filter(
            (department) => 
              department.id !== action.payload && 
              department.departmentId !== action.payload
          );
          
          // Update total count
          if (state.departments.total > 0) {
            state.departments.total -= 1;
          }
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { openDepartmentModal, closeDepartmentModal } = DepartmentSlice.actions;
export default DepartmentSlice.reducer;