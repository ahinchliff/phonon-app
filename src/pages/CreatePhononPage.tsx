import { useIonRouter, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useState } from "react";
import { CreateNativePhonons } from "../components/CreatePhononFormNative";
import { CreateNFTPhononForm } from "../components/CreatePhononFormNFT";
import { CreateTokenPhononForm } from "../components/CreatePhononFormToken";
import {
  useFinalizeDepositMutation,
  useInitDepositMutation,
} from "../store/api";
import { NewPhonon, AssetTypeId, NetworkId } from "../types";
import fundPhonon from "../utils/phonon/funding";
import useSessionIdFromParams from "../hooks/useSessionIdFromParams";
import { getPhononListPath } from "../utils/navigation";
import { isEVMChain } from "../utils/network";
import {
  NetworkDetails,
  NETWORK_DETAILS,
  SUPPORTED_ASSET_TYPES_BY_NETWORK,
} from "../constants/networks";
import { ASSET_TYPES } from "../constants/assets";

const DEFAULT_NETWORK_ID = NetworkId.Bitcoin;
const DEFAULT_ASSET_TYPE_ID = AssetTypeId.Native;

const CreatePhononPage: React.FC = () => {
  const sessionId = useSessionIdFromParams();
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK_ID);
  const [assetTypeId, setAssetTypeId] = useState<AssetTypeId>(
    DEFAULT_ASSET_TYPE_ID
  );
  const [isPending, setIsPending] = useState(false);

  const assetType = ASSET_TYPES[assetTypeId];
  const network = NETWORK_DETAILS[networkId];

  const router = useIonRouter();
  const [initDeposit] = useInitDepositMutation();
  const [finalizeDeposit] = useFinalizeDepositMutation();

  const onChangeSelectedNetwork = (networkId: NetworkId) => {
    setNetworkId(networkId);
    const supportedAssets = SUPPORTED_ASSET_TYPES_BY_NETWORK[networkId];
    if (!supportedAssets.includes(assetTypeId)) {
      setAssetTypeId(supportedAssets[0]);
    }
  };

  const onSubmit = async (newPhonons: NewPhonon[]) => {
    setIsPending(true);
    const payload = {
      CurrencyType: network.id,
      ChainID: assetType.id,
      Denominations: newPhonons.map((np) => np.denomination),
      Tags: newPhonons.map((np) => np.tags || []),
    };
    // Consider doing basic error checking BEFORE creating the phonon,
    // i.e. verifying person has the NFT or sufficient ETH to fill phonon
    // it can lead to the phonon being created, and then not destroyed
    await initDeposit({ payload, sessionId })
      .unwrap()
      .then(async (payload) => {
        // currently only support depositing on EVM chains with window.ethereum
        if (
          !isEVMChain(network.id) ||
          // @ts-expect-error - window
          !window.ethereum
        ) {
          console.log("Manual deposit and finalization required");
          return;
        }

        await Promise.all(
          payload.map(async (phonon) => {
            try {
              await fundPhonon(phonon);

              const payload = [
                {
                  Phonon: phonon,
                  ConfirmedOnChain: true,
                  ConfirmedOnCard: true,
                },
              ];
              finalizeDeposit({ payload, sessionId }).catch(console.error);
            } catch (error) {
              console.error(error);
            }
          })
        );
        setIsPending(false);
        router.push(getPhononListPath(sessionId, network.id, assetType.id));
      });
  };

  const content = () => {
    if (assetType.id === AssetTypeId.ERC721) {
      return (
        <CreateNFTPhononForm
          isPending={isPending}
          networkId={networkId}
          onSubmit={onSubmit}
        />
      );
    }

    if (assetType.id === AssetTypeId.ERC20) {
      return (
        <CreateTokenPhononForm
          isPending={isPending}
          networkId={networkId}
          onSubmit={onSubmit}
        />
      );
    }

    return (
      <CreateNativePhonons
        isPending={isPending}
        networkId={networkId}
        onSubmit={onSubmit}
      />
    );
  };

  return (
    <>
      <p className="text-xl mt-3 font-bold text-center text-gray-300 uppercase">
        CREATE PHONON
      </p>
      <IonSelect
        value={networkId}
        okText="Okay"
        cancelText="Dismiss"
        onIonChange={(e) => onChangeSelectedNetwork(e.detail.value)}
      >
        {Object.keys(NETWORK_DETAILS).map((networkId) => {
          const net = NETWORK_DETAILS[networkId] as NetworkDetails;
          return (
            <IonSelectOption key={net.id} value={net.id}>
              {net.name}
            </IonSelectOption>
          );
        })}
      </IonSelect>

      <IonSelect
        value={assetTypeId}
        okText="Okay"
        cancelText="Dismiss"
        onIonChange={(e) => setAssetTypeId(e.detail.value)}
      >
        {SUPPORTED_ASSET_TYPES_BY_NETWORK[networkId].map((aid) => {
          const a = ASSET_TYPES[aid];

          return (
            <IonSelectOption key={a.id} value={a.id}>
              {a.name}
            </IonSelectOption>
          );
        })}
      </IonSelect>

      {content()}
    </>
  );
};

export default CreatePhononPage;
