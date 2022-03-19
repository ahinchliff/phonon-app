import { IonButton, useIonRouter } from "@ionic/react";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useParams } from "react-router";
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
import useNetwork from "../hooks/useNetwork";
import {
  useFinalizeDepositMutation,
  useInitDepositMutation,
} from "../store/api";
import { NetworkId, NewPhonon, Tag } from "../types";
import { ethToBn, ethToWei, weiToEth } from "../utils/denomination";
import { makeChange } from "../utils/math";

type FormType = "native" | "nft";

const NetworkToFormMap: { [key in NetworkId]: FormType } = {
  0: "native",
  1: "native",
  2: "native",
  3: "nft",
};

const CreatePhononPage: React.FC = () => {
  const { sessionId, networkId } = useParams<{
    sessionId: string;
    networkId: string;
  }>();
  const router = useIonRouter();
  const [isPending, setIsPending] = useState(false);
  const [initDeposit] = useInitDepositMutation();
  const [finalizeDeposit] = useFinalizeDepositMutation();
  const CurrencyType = parseInt(networkId);

  const onSubmit = async (newPhonons: NewPhonon[]) => {
    setIsPending(true);
    const payload = {
      CurrencyType,
      Denominations: newPhonons.map((np) => np.denomination),
    };
    await initDeposit({ payload, sessionId })
      .unwrap()
      .then(async (payload) => {
        // @ts-expect-error - window
        if (window.ethereum) {
          // @ts-expect-error - window
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const network = await provider.getNetwork();
          const ChainID = network.chainId;
          const signer = provider.getSigner();
          await Promise.all(
            payload.map(async (phonon) => {
              const to = phonon.Address;
              const value = ethToBn(weiToEth(phonon.Denomination));

              return signer
                .sendTransaction({ to, value })
                .then((response) => {
                  if (response) {
                    const Phonon = { ...phonon, ChainID };
                    const payload = [
                      {
                        Phonon,
                        ConfirmedOnChain: true,
                        ConfirmedOnCard: true,
                      },
                    ];
                    finalizeDeposit({ payload, sessionId }).catch(
                      console.error
                    );
                    router.push(`/${sessionId}/${networkId}/`);
                  }
                })
                .catch(console.error)
                .finally(() => setIsPending(false));
            })
          );
        } else {
          // TODO: Show an error message to the user about MetaMask not being installed or available
          setIsPending(false);
        }
      });
  };

  if (NetworkToFormMap[CurrencyType] === "native") {
    return <CreateNativePhonons isPending={isPending} onSubmit={onSubmit} />;
  }

  return <CreateNFTPhononForm isPending={isPending} onSubmit={onSubmit} />;
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
  const { network } = useNetwork();

  const onSubmitSuggested = (data: CreatePhononFormSuggestedValues) => {
    const change = makeChange(parseFloat(data.amount));
    const newPhonons: NewPhonon[] = change.flatMap((d) => {
      const arr = Array(d.amount);
      const denomination = Number(ethToWei(d.denomination));
      const newPhonon: NewPhonon = { denomination };
      return arr.fill(newPhonon) as NewPhonon[];
    });

    return onSubmit(newPhonons);
  };

  const onSubmitCustomized = (data: CreatePhononFormCustomValues) => {
    const newPhonons: NewPhonon[] = data.phononsToCreate.flatMap((d) => {
      const arr = Array(d.amount);
      const denomination = Number(ethToWei(d.denomination));
      const newPhonon: NewPhonon = { denomination };
      return arr.fill(newPhonon) as NewPhonon[];
    });

    return onSubmit(newPhonons);
  };

  const onSubmitSingle = (data: CreatePhononFormSingleValues) => {
    return onSubmit([{ denomination: Number(data.amount) }]);
  };

  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  const handleSuggest = () => {
    setIsCustomizing(false);
  };

  const renderMassCreate = () => (
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
  );

  return (
    <div>
      <p className="text-xl font-bold text-center text-gray-300 uppercase">
        CREATE {network.ticker} PHONON
      </p>
      {isMassCreating ? (
        renderMassCreate()
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
