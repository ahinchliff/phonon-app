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
import useNetwork from "../hooks/useNetwork";
import {
  useFinalizeDepositMutation,
  useInitDepositMutation,
} from "../store/api";
import { ethToBn, ethToWei, weiToEth } from "../utils/denomination";
import { makeChange } from "../utils/math";

const CreatePhononPage: React.FC = () => {
  const { sessionId, networkId } = useParams<{
    sessionId: string;
    networkId: string;
  }>();
  const router = useIonRouter();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isMassCreating, setIsMassCreating] = useState(false);
  const [initDeposit] = useInitDepositMutation();
  const [finalizeDeposit] = useFinalizeDepositMutation();
  const { network } = useNetwork();

  const onSubmitSuggested = (data: CreatePhononFormSuggestedValues) =>
    onSubmit(makeChange(parseFloat(data.amount)));

  const onSubmitCustomized = (data: CreatePhononFormCustomValues) =>
    onSubmit(data.phononsToCreate);

  const onSubmitSingle = (data: CreatePhononFormSingleValues) =>
    onSubmit([{ amount: 1, denomination: data.amount }]);

  const onSubmit = async (
    data: {
      amount: number;
      denomination: string;
    }[]
  ) => {
    setIsPending(true);
    const Denominations = data.flatMap((d) => {
      const denomination = ethToWei(d.denomination);
      const arr = Array(d.amount);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return arr.fill(Number(denomination));
    });
    const CurrencyType = parseInt(networkId);
    const payload = { CurrencyType, Denominations };
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

  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  const handleSuggest = () => {
    setIsCustomizing(false);
    // setInputValue(rollupChange(denominationAmounts));
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

export default CreatePhononPage;
