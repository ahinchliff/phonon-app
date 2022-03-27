import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AssetDetails, AssetTypeId, NetworkId } from "../types";
import { fetchAssetDetails } from "../utils/assets";
import { assetDetailsLocalStorage } from "../utils/local-storage";
import { getProvider } from "../utils/providers";

type State = {
  assetDetails: AssetDetails[];
  fetchingAssetDetails: boolean;
  fetchAssetDetailsError: string | undefined;
};

const initialState: State = {
  assetDetails: assetDetailsLocalStorage.get() || [],
  fetchingAssetDetails: false,
  fetchAssetDetailsError: undefined,
};

export const setAssetDetails = createAsyncThunk(
  "assets/fetchAssetDetails",
  async (data: {
    networkId: NetworkId;
    assetTypeId: AssetTypeId;
    contractAddress: string;
  }) => {
    const provider = getProvider(data.networkId);
    if (!provider) {
      return;
    }

    return fetchAssetDetails(
      data.networkId,
      data.assetTypeId,
      data.contractAddress,
      provider
    );
  }
);

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    clearFetchAssetDetailsError: (state) => {
      state.fetchAssetDetailsError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setAssetDetails.rejected, (state, action) => {
      state.fetchingAssetDetails = false;
      state.fetchAssetDetailsError = action.error.message;
    });
    builder.addCase(setAssetDetails.pending, (state) => {
      state.fetchAssetDetailsError = undefined;
      state.fetchingAssetDetails = true;
    });
    builder.addCase(setAssetDetails.fulfilled, (state, action) => {
      state.fetchAssetDetailsError = undefined;
      if (!action.payload) {
        return;
      }

      const newAssetDetail = {
        ...action.payload,
        contractAddress: action.payload.contractAddress?.toLowerCase(),
      };

      const updatedAssetDetails = [...state.assetDetails];

      const existingIndex = state.assetDetails.findIndex((ad) => {
        return (
          ad.networkId === newAssetDetail.networkId &&
          ad.contractAddress === newAssetDetail.contractAddress
        );
      });

      if (existingIndex !== -1) {
        updatedAssetDetails.push(newAssetDetail);
      } else {
        updatedAssetDetails.splice(existingIndex, 1, newAssetDetail);
      }

      state.assetDetails = updatedAssetDetails;
      assetDetailsLocalStorage.set(updatedAssetDetails);
    });
  },
});

export const { clearFetchAssetDetailsError } = assetsSlice.actions;
export default assetsSlice.reducer;
