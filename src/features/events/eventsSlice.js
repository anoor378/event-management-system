import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEvents, getEventById, getClassifications } from '../../services/ticketmaster';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getEvents(params);
      return {
        items: data._embedded?.events || [],
        page: data.page?.number || 0,
        totalPages: data.page?.totalPages || 0,
        totalElements: data.page?.totalElements || 0,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      return await getEventById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getClassifications();
      const segments =
        data._embedded?.classifications?.map((c) => c.segment).filter(Boolean) || [];
      const unique = Array.from(new Map(segments.map((s) => [s.id, s])).values());
      return unique.map((s) => ({ id: s.id, name: s.name }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    page: 0,
    totalPages: 0,
    totalElements: 0,
    loading: true,
    error: null,
    selected: null,
    selectedLoading: false,
    selectedError: null,
    categories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(fetchEventById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
        state.selected = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload || 'Something went wrong';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default eventsSlice.reducer;