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
        inbox: params.isArchived ? [] : res.data.leads.filter(lead => !lead.isArchived),
        archive: params.isArchived ? res.data.leads.filter(lead => lead.isArchived) : [],
        total: res.data.totalRecords,
        pages: res.data.totalPages,
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
  leads: {
    inbox: [],     
    archive: [],     
    total: 0,
    pages: 0,
    currentPage: 1
  },
  status: 'idle',
  error: null,
  isModalOpen: false,
  currentLead: null,
  operationStatus: 'idle',
  operationError: null,
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads = {
          ...state.leads,
          inbox: action.payload.inbox,
          archive: action.payload.archive,
          total: action.payload.total,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage
        };
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
        // Add the new lead to the inbox
        state.leads.inbox = [action.payload, ...state.leads.inbox];
        state.leads.total += 1;
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
        // Update the lead in either inbox or archive
        const { id } = action.payload;
        
        const inboxIndex = state.leads.inbox.findIndex(lead => lead.id === id);
        if (inboxIndex !== -1) {
          state.leads.inbox[inboxIndex] = {
            ...state.leads.inbox[inboxIndex],
            ...action.payload,
            mode: "modified"
          };
        } else {
          const archiveIndex = state.leads.archive.findIndex(lead => lead.id === id);
          if (archiveIndex !== -1) {
            state.leads.archive[archiveIndex] = {
              ...state.leads.archive[archiveIndex],
              ...action.payload,
              mode: "modified"
            };
          }
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
        // Remove the lead from both inbox and archive
        state.leads.inbox = state.leads.inbox.filter(lead => lead.id !== action.payload);
        state.leads.archive = state.leads.archive.filter(lead => lead.id !== action.payload);
        state.leads.total = Math.max(0, state.leads.total - 1);
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
        // Move the lead from inbox to archive
        const leadToArchive = state.leads.inbox.find(lead => lead.id === action.payload);
        if (leadToArchive) {
          state.leads.inbox = state.leads.inbox.filter(lead => lead.id !== action.payload);
          state.leads.archive = [leadToArchive, ...state.leads.archive];
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
        // Move the lead from archive to inbox
        const leadToRestore = state.leads.archive.find(lead => lead.id === action.payload);
        if (leadToRestore) {
          state.leads.archive = state.leads.archive.filter(lead => lead.id !== action.payload);
          state.leads.inbox = [leadToRestore, ...state.leads.inbox];
        }
      })
      .addCase(restoreLead.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  }
});

export const { openLeadModal, closeLeadModal } = leadsSlice.actions;
export default leadsSlice.reducer;