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
        leads: res.data.leads,
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
      return res.data.lead;
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
      return { leadId: id, ...res.data.lead };
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
      const res = await API.post(`/leads/${id}/archive`);
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
      const res = await API.post(`/leads/${id}/unarchive`);
      toast.success(res.data?.message || 'Lead restored successfully');
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore lead');
      return rejectWithValue(err.response?.data);
    }
  }
);

const initialState = {
  leads: [],
  total: 0,
  pages: 0,
  currentPage: 1,
  status: 'idle',
  error: null,
  isModalOpen: false,
  currentLead: null,
  operationStatus: 'idle',
  operationError: null,
  currentView: 'inbox',
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
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload;
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
      .addCase(addLead.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      // Update Lead
      .addCase(updateLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        const { leadId } = action.payload;
        const index = state.leads.findIndex(lead => lead.leadId === leadId);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        state.isModalOpen = false;
        state.currentLead = null;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      // Delete Lead
      .addCase(deleteLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        state.leads = state.leads.filter(lead => lead.leadId !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      // Archive Lead
      .addCase(archiveLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(archiveLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        if (state.currentView === 'inbox') {
          state.leads = state.leads.filter(lead => lead.leadId !== action.payload);
          state.total = Math.max(0, state.total - 1);
        }
      })
      .addCase(archiveLead.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      // Restore Lead
      .addCase(restoreLead.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(restoreLead.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        if (state.currentView === 'archive') {
          state.leads = state.leads.filter(lead => lead.leadId !== action.payload);
          state.total = Math.max(0, state.total - 1);
        }
      })
      .addCase(restoreLead.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  }
});

export const { openLeadModal, closeLeadModal, setCurrentView, setCurrentLead } = leadsSlice.actions;
export default leadsSlice.reducer;