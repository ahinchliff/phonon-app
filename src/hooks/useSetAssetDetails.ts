import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAssetDetails } from "../store/assetsSlice";
import { AssetTypeId, NetworkId } from "../types";

const useSetAssetDetails = (
  networkId: NetworkId,
  assetTypeId: AssetTypeId,
  contractAddress: string
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return;
    }

    dispatch(
      setAssetDetails({
        networkId,
        assetTypeId,
        contractAddress,
      })
    );
  }, [contractAddress, networkId, assetTypeId, dispatch]);
};

export default useSetAssetDetails;
