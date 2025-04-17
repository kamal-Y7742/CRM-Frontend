import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/organizations/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addOrganization = createAsyncThunk(
  'organization/addOrganization',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/organizations/create', payload);
      toast.success(res.data?.message || 'Organization added!');
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

export const updateOrganization = createAsyncThunk(
  'organization/updateOrganization',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post(`/organizations/edit/${payload.organisation_Id}`, {
        organization_desc: payload.organization_desc
      });
      toast.success(response.data?.message || 'Organization updated successfully');
      return {
        id: payload.organisation_Id,  // Fixed this line - was using organization_Id before
        organization_desc: payload.organization_desc,
        response: response.data
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update organization');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteOrganization = createAsyncThunk(
  'organization/deleteOrganization',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/organizations/delete/${id}`);
      toast.success(res.data?.message || 'Organization deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete organization');
      return rejectWithValue(error.response?.data);
    }
  }
);

const OrganizationSlice = createSlice({
  name: 'organization',
  initialState: {
    organisations: {
      total: 0,
      pages: 0,
      currentPage: 1,
      organizations: []
    },
    status: 'idle',
    error: null,
    isModalOpen: false,
    currentOrganization: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    openOrganizationModal: (state, action) => {
      state.isModalOpen = true;
      state.currentOrganization = action.payload || null;
      console.log(state.currentOrganization,'currentOrganization')
    },
    closeOrganizationModal: (state) => {
      state.isModalOpen = false;
      state.currentOrganization = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organisations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addOrganization.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addOrganization.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        // Use the response data from the API which includes createdAt
        const responseData = action.payload.response?.organization || {};
        console.log(responseData,'responseDatasxsss')
        const submittedData = action.payload.payload;
        
        // Create the new organization item with all fields from the response
        const newItem = {
          organizationId: responseData.organizationId || 
            (state.organisations.organizations.length > 0 ? 
              Math.max(...state.organisations.organizations.map(o => o.organizationId || 0)) + 1 : 1),
          id: responseData.organizationId || 
            (state.organisations.organizations.length > 0 ? 
              Math.max(...state.organisations.organizations.map(o => o.id || 0)) + 1 : 1),
          organization_desc: submittedData.organization_desc,
          mode: "added",
          createdAt: responseData.createdAt || new Date().toISOString(),
          updatedAt: responseData.updatedAt || new Date().toISOString(),
          createdBy: responseData.createdBy || 'admin'
        };
        
        // Insert the new item at the beginning of the array
        if (state.organisations && state.organisations.organizations) {
          state.organisations.organizations = [
            newItem,
            ...state.organisations.organizations
          ];
          
          // Update total count
          state.organisations.total = (state.organisations.total || 0) + 1;
        }
        
        state.isModalOpen = false;
        state.currentOrganization = null;
      })
      .addCase(addOrganization.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      .addCase(updateOrganization.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        if (state.organisations?.organizations) {
          const updatedOrganizations = state.organisations.organizations.map(org => {
            if (org.organizationId === action.payload.id || org.id === action.payload.id) {
              return {
                ...org,
                organization_desc: action.payload.organization_desc,
                mode: "modified",
                updatedAt: new Date().toISOString()
              };
            }
            return org;
          });
          
          state.organisations.organizations = updatedOrganizations;
        }
        
        state.isModalOpen = false;
        state.currentOrganization = null;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      .addCase(deleteOrganization.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.organisations && state.organisations.organizations) {
          // Remove the item from the array
          state.organisations.organizations = state.organisations.organizations.filter(
            (organization) => 
              organization.id !== action.payload && 
              organization.organizationId !== action.payload
          );
          
          // Update total count
          if (state.organisations.total > 0) {
            state.organisations.total -= 1;
          }
        }
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { openOrganizationModal, closeOrganizationModal } = OrganizationSlice.actions;
export default OrganizationSlice.reducer;