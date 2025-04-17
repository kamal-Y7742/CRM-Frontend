import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchCurrencies = createAsyncThunk(
  'currency/fetchCurrencies',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/currencies/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addCurrency = createAsyncThunk(
  'currency/addCurrency',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/currencies/create', payload);
      toast.success(res.data?.message || 'Currency added!');
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

export const updateCurrency = createAsyncThunk(
  'currency/updateCurrency',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post(`/currencies/edit/${payload.currencyId}`, {
        currency_desc: payload.currency_desc,
      });
      toast.success(response.data?.message || 'Currency updated successfully');
      return {
        id: payload.currencyId,
        currency_desc: payload.currency_desc,
        response: response.data
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update currency');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteCurrency = createAsyncThunk(
  'currency/deleteCurrency',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/currencies/delete/${id}`);
      toast.success(res.data?.message || 'Currency deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete currency');
      return rejectWithValue(error.response?.data);
    }
  }
);

const CurrencySlice = createSlice({
  name: 'currency',
  initialState: {
    currencies: {
      total: 0,
      pages: 0,
      currentPage: 1,
      currencys: []
    },
    status: 'idle',
    error: null,
    isModalOpen: false,
    currentCurrency: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    openCurrencyModal: (state, action) => {
      state.isModalOpen = true;
      state.currentCurrency = action.payload || null;
    },
    closeCurrencyModal: (state) => {
      state.isModalOpen = false;
      state.currentCurrency = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addCurrency.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addCurrency.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        
        const maxId = state.currencies.currencys.length > 0 
          ? Math.max(...state.currencies.currencys.map(d => 
              typeof d.currencyId === 'number' ? d.currencyId : 0
            ))
          : 0;
        
        const newId = maxId + 1;
        
        const responseData = action.payload.response?.data || {};
        const submittedData = action.payload.payload;
        
        const newItem = {
          currencyId: responseData.id || newId,
          id: responseData.id || newId,
          currency_desc: submittedData.currency_desc,
          mode: "added",
          createdAt: new Date().toISOString()
        };
        
        if (state.currencies && state.currencies.currencys) {
          state.currencies.currencys = [
            newItem,
            ...state.currencies.currencys
          ];
          state.currencies.total = (state.currencies.total || 0) + 1;
        }
        
        state.isModalOpen = false;
        state.currentCurrency = null;
      })
      .addCase(addCurrency.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })
      
      .addCase(updateCurrency.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.currencies && state.currencies.currencys) {
          state.currencies.currencys = state.currencies.currencys.map(
            currency => {
              if (currency.currencyId === action.payload.id || 
                  currency.id === action.payload.id) {
                return {
                  ...currency,
                  currency_desc: action.payload.currency_desc,
                  mode: "modified"
                };
              }
              return currency;
            }
          );
        }
        state.isModalOpen = false;
        state.currentCurrency = null;
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      .addCase(deleteCurrency.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.operationStatus = 'idle';

        if (state.currencies && state.currencies.currencys) {
          state.currencies.currencys = state.currencies.currencys.filter(
            (currency) => 
              currency.id !== action.payload && 
              currency.currencyId !== action.payload
          );
          
          if (state.currencies.total > 0) {
            state.currencies.total -= 1;
          }
        }
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { openCurrencyModal, closeCurrencyModal } = CurrencySlice.actions;
export default CurrencySlice.reducer;