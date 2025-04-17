import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../Services/Axios';
import { toast } from 'react-toastify';

export const fetchCountries = createAsyncThunk(
  'country/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/countries/get');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

export const addCountry = createAsyncThunk(
  'country/addCountry',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/countries/create', payload);
      toast.success(res.data?.message || 'Country added!');
      return {
        payload,
        response: res.data
      };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add country');
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateCountry = createAsyncThunk(
  'country/updateCountry',
  async (payload, { rejectWithValue }) => {
    try {
      const { country_Id, ...dataWithoutId } = payload; 
      const response = await API.post(`/countries/edit/${country_Id}`, dataWithoutId);
      toast.success(response.data?.message || 'Country updated successfully');
      return {
        id: country_Id,
        ...dataWithoutId,
        response: response.data
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update country');
      return rejectWithValue(error.response?.data);
    }
  }
);


export const deleteCountry = createAsyncThunk(
  'country/deleteCountry',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/countries/delete/${id}`);
      toast.success(res.data?.message || 'Country deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete country');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  countries: {
    total: 0,
    pages: 0,
    currentPage: 1,
    countries: []
  },
  status: 'idle',
  error: null,
  isModalOpen: false,
  currentCountry: null,
  operationStatus: 'idle',
  operationError: null,
};

const CountrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    openCountryModal: (state, action) => {
      state.isModalOpen = true;
      state.currentCountry = action.payload || null;
    },
    closeCountryModal: (state) => {
      state.isModalOpen = false;
      state.currentCountry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCountry.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addCountry.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        const newItem = {
          ...action.payload.payload,
          countryId: action.payload.response?.data?.id || Date.now(),
          mode: "added",
          createdAt: new Date().toISOString()
        };
        state.countries.countries = [newItem, ...state.countries.countries];
        state.countries.total += 1;
        state.isModalOpen = false;
      })
      .addCase(updateCountry.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
      
        if (state.countries && state.countries.countries) {
          state.countries.countries = state.countries.countries.map(
            country => {
              if (country.countryId === action.payload.id || country.id === action.payload.id) {
                return {
                  ...country,
                  country_desc: action.payload.country_desc,
                  mode: "modified"
                };
              }
              return country;
            }
          );
        }
      
        state.isModalOpen = false;
      })
      

      .addCase(deleteCountry.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.operationStatus = 'idle';
        state.countries.countries = state.countries.countries.filter(
          item => item.countryID !== action.payload
        );
        state.countries.total -= 1;
      });


      
  },
});

export const { openCountryModal, closeCountryModal } = CountrySlice.actions;
export default CountrySlice.reducer;