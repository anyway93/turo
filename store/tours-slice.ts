import { getTours } from "@/api";
import { Tour } from "@/models";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type ToursState = {
  items: Tour[];
  status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: ToursState = {
  items: [],
  status: "idle",
};

export const fetchTours = createAsyncThunk("tours/fetch", async () => {
  const data = await getTours();
  return data.tours;
});

const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTours.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(fetchTours.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    });

    builder.addCase(fetchTours.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const toursReducer = toursSlice.reducer;
