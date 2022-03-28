import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFetchAssetDetailsError,
  setAssetDetails,
} from "../store/assetsSlice";
import { AssetTypeId, NetworkId } from "../types";
import { RootState } from "../store";
import { isValidAddress } from "../utils/addresses";

const useSetAssetDetails = (
  networkId: NetworkId,
  assetTypeId: AssetTypeId,
  contractAddress: string | undefined
) => {
  const dispatch = useDispatch();
  const { assetDetails, fetchingAssetDetails, fetchAssetDetailsError } =
    useSelector((state: RootState) => state.assets);

  useEffect(() => {
    dispatch(clearFetchAssetDetailsError());
  }, [contractAddress, dispatch]);

  const existing = !!assetDetails.find((detail) => {
    return (
      !!detail.contractAddress &&
      !!contractAddress &&
      networkId === detail.networkId &&
      contractAddress.toLowerCase() === detail.contractAddress.toLowerCase()
    );
  });

  useEffect(() => {
    if (
      !contractAddress ||
      !isValidAddress(contractAddress) ||
      existing ||
      fetchingAssetDetails ||
      fetchAssetDetailsError
    ) {
      return;
    }

    dispatch(
      setAssetDetails({
        networkId,
        assetTypeId,
        contractAddress,
      })
    );
  }, [
    contractAddress,
    networkId,
    assetTypeId,
    existing,
    fetchingAssetDetails,
    fetchAssetDetailsError,
    dispatch,
  ]);

  return {
    loading: fetchingAssetDetails,
    error: fetchAssetDetailsError,
  };
};

export default useSetAssetDetails;
