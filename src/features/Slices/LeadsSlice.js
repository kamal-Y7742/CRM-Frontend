import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

// Async Thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (params = { isArchived: false }, { rejectWithValue }) => {
    try {
      const res = await API.get('/leads/get', { params });
      return {
        leads: res.data.leads, // Just return the filtered leads from backend
        totalRecords: res.data.totalRecords,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching leads');
    }
  }
);

export const addLead = createAsyncThunk(
  'leads/addLead',
  async (leadData, { rejectWithValue }) => {
    try {
      const res = await API.post('/leads/create', leadData);
      toast.success(res.data?.message || 'Lead added successfully');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lead');
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, leadData }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/leads/edit/${id}`, leadData);
      toast.success(res.data?.message || 'Lead updated successfully');
      return { id, ...leadData };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead');
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/leads/delete/${id}`);
      toast.success(res.data?.message || 'Lead deleted successfully');
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lead');
      return rejectWithValue(err.response?.data);
    }
  }
);

export const archiveLead = createAsyncThunk(
  'leads/archiveLead',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/leads/archive/${id}`);
      toast.success(res.data?.message || 'Lead archived successfully');
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to archive lead');
      return rejectWithValue(err.response?.data);
    }
  }
);

export const restoreLead = createAsyncThunk(
  'leads/restoreLead',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/leads/restore/${id}`);
      toast.success(res.data?.message || 'Lead restored successfully');
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore lead');
      return rejectWithValue(err.response?.data);
    }
  }
);
const initialState = {
  leads: [], // Now stores only the current view's leads
  total: 0,
  pages: 0,
  currentPage: 1,
  status: 'idle',
  error: null,
  isModalOpen: false,
  currentLead: null,
  operationStatus: 'idle',
  operationError: null,
  currentView: 'inbox', // Track current view
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    openLeadModal: (state, action) => {
      state.isModalOpen = true;
      state.currentLead = action.payload || null;
    },
    closeLeadModal: (state) => {
      state.isModalOpen = false;
      state.currentLead = null;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads = action.payload.leads;
        state.total = action.payload.totalRecords;
        state.pages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add Lead
      .addCase(addLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        if (state.currentView === 'inbox') {
          state.leads = [action.payload, ...state.leads];
          state.total += 1;
        }
        state.isModalOpen = false;
        state.currentLead = null;
      })

      
      
      // Update Lead
      .addCase(updateLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        const { id } = action.payload;
        const index = state.leads.findIndex(lead => lead.id === id);
        if (index !== -1) {
          state.leads[index] = {
            ...state.leads[index],
            ...action.payload,
          };
        }
        state.isModalOpen = false;
        state.currentLead = null;
      })
      
      // Delete Lead
      .addCase(deleteLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        state.leads = state.leads.filter(lead => lead.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      
      // Archive Lead
      .addCase(archiveLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(archiveLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        // Remove from current view (if in inbox)
        if (state.currentView === 'inbox') {
          state.leads = state.leads.filter(lead => lead.id !== action.payload);
        }
      })
      
      // Restore Lead
      .addCase(restoreLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(restoreLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        // Remove from current view (if in archive)
        if (state.currentView === 'archive') {
          state.leads = state.leads.filter(lead => lead.id !== action.payload);
        }
      });
  }
});

export const { openLeadModal, closeLeadModal, setCurrentView } = leadsSlice.actions;
export default leadsSlice.reducer;