import { useParams } from "react-router";
import { NetworkId } from "../types";
import { NetworkDetails, NETWORK_DETAILS } from "./../constants/networks";

const useNetwork = (): NetworkDetails => {
  const { networkId: networkIdParam } = useParams<{
    networkId: string;
  }>();
  const networkId = parseInt(networkIdParam) as NetworkId;
  const networkDetails = NETWORK_DETAILS[networkId];

  if (!networkDetails) {
    throw Error("No network found");
  }

  return networkDetails;
};

export default useNetwork;
