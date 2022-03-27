import { IonButton, useIonRouter } from "@ionic/react";
import React, { useState } from "react";
import {
  CreatePhononFormCustom,
  CreatePhononFormCustomValues,
} from "../components/CreatePhononFormCustom";
import {
  CreatePhononFormSingle,
  CreatePhononFormSingleValues,
} from "../components/CreatePhononFormSingle";
import {
  CreatePhononFormSuggested,
  CreatePhononFormSuggestedValues,
} from "../components/CreatePhononFormSuggested";
import { CreateNFTPhononForm } from "../components/CreatePhononFormNFT";
import { CreateTokenPhononForm } from "../components/CreatePhononFormToken";
import useNetwork from "../hooks/useNetwork";
import {
  useFinalizeDepositMutation,
  useInitDepositMutation,
} from "../store/api";
import { NewPhonon, AssetTypeId } from "../types";
import { ethToWei } from "../utils/denomination";
import { makeChange } from "../utils/math";
import fundPhonon from "../utils/phonon/funding";
import useAsset from "../hooks/useAsset";
import useSessionId from "../hooks/useSession";
import { getPhononListPath } from "../utils/navigation";
import { isEVMChain } from "../utils/network";
import { ethers } from "ethers";
import { getAssetDecimals } from "../utils/assets";

const CreatePhononPage: React.FC = () => {
  const sessionId = useSessionId();
  const network = useNetwork();
  const asset = useAsset();

  const router = useIonRouter();
  const [isPending, setIsPending] = useState(false);
  const [initDeposit] = useInitDepositMutation();
  const [finalizeDeposit] = useFinalizeDepositMutation();

  const onSubmit = async (newPhonons: NewPhonon[]) => {
    setIsPending(true);
    const payload = {
      CurrencyType: network.id,
      ChainID: asset.id,
      Denominations: newPhonons.map((np) =>
        Number(
          ethers.utils
            .parseUnits(np.denomination, getAssetDecimals(network.id, asset.id))
            .toString()
        )
      ),
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
        router.push(getPhononListPath(sessionId, network.id, asset.id));
      });
  };

  if (asset.id === AssetTypeId.ERC721) {
    return <CreateNFTPhononForm isPending={isPending} onSubmit={onSubmit} />;
  }

  if (asset.id === AssetTypeId.ERC20) {
    return <CreateTokenPhononForm isPending={isPending} onSubmit={onSubmit} />;
  }

  return <CreateNativePhonons isPending={isPending} onSubmit={onSubmit} />;
};

export default CreatePhononPage;

type CreateNativePhononsProps = {
  isPending: boolean;
  onSubmit: (newPhonons: NewPhonon[]) => Promise<void>;
};

const CreateNativePhonons: React.FC<CreateNativePhononsProps> = ({
  isPending,
  onSubmit,
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isMassCreating, setIsMassCreating] = useState(false);
  const network = useNetwork();

  const onSubmitSuggested = (data: CreatePhononFormSuggestedValues) => {
    const change = makeChange(parseFloat(data.amount));
    const newPhonons: NewPhonon[] = change.flatMap((d) => {
      const arr = Array(d.amount);
      const denomination = ethToWei(d.denomination);
      const newPhonon: NewPhonon = { denomination };
      return arr.fill(newPhonon) as NewPhonon[];
    });

    return onSubmit(newPhonons);
  };

  const onSubmitCustomized = (data: CreatePhononFormCustomValues) => {
    const newPhonons: NewPhonon[] = data.phononsToCreate.flatMap((d) => {
      const arr = Array(d.amount);
      const denomination = ethToWei(d.denomination);
      const newPhonon: NewPhonon = { denomination };
      return arr.fill(newPhonon) as NewPhonon[];
    });

    return onSubmit(newPhonons);
  };

  const onSubmitSingle = (data: CreatePhononFormSingleValues) => {
    return onSubmit([{ denomination: data.amount }]);
  };

  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  const handleSuggest = () => {
    setIsCustomizing(false);
  };

  return (
    <div>
      <p className="text-xl font-bold text-center text-gray-300 uppercase">
        CREATE {network.ticker} PHONON
      </p>
      {isMassCreating ? (
        <>
          <IonButton
            expand="full"
            fill="clear"
            type="button"
            onClick={() => setIsMassCreating(false)}
          >
            Creating Many Phonons
          </IonButton>
          {isCustomizing ? (
            <CreatePhononFormCustom
              {...{ handleSuggest, onSubmit: onSubmitCustomized, isPending }}
            />
          ) : (
            <CreatePhononFormSuggested
              {...{ handleCustomize, onSubmit: onSubmitSuggested, isPending }}
            />
          )}
        </>
      ) : (
        <>
          <IonButton
            expand="full"
            fill="clear"
            type="button"
            onClick={() => setIsMassCreating(true)}
          >
            Creating Single Phonon
          </IonButton>{" "}
          <CreatePhononFormSingle
            {...{ handleCustomize, onSubmit: onSubmitSingle, isPending }}
          />
        </>
      )}
    </div>
  );
};
