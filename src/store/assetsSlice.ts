import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AssetDetails, AssetTypeId, NetworkId } from "../types";
import { fetchAssetDetails } from "../utils/assets";
import { assetDetailsLocalStorage } from "../utils/local-storage";
import { getProvider } from "../utils/providers";

type State = {
  assetDetails: AssetDetails[];
};

const initialState = {
  assetDetails: assetDetailsLocalStorage.get() || [],
} as State;

export const setAssetDetails = createAsyncThunk(
  "assets/fetchAssetDetails",
  async (data: {
    networkId: NetworkId;
    assetTypeId: AssetTypeId;
    contractAddress: string;
  }) => {
    // const state = api.getState() as State;

    // if (
    //   state.assetDetails.find(
    //     ({ networkId, contractAddress }) =>
    //       networkId === data.networkId &&
    //       contractAddress?.toLowerCase() === data.contractAddress.toLowerCase()
    //   )
    // ) {
    //   console.log("No need to fetch asset details");
    //   return;
    // }

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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAssetDetails.fulfilled, (state, action) => {
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

export const {} = assetsSlice.actions;
export default assetsSlice.reducer;
