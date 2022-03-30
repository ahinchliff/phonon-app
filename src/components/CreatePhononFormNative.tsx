import { IonButton, IonSelect, IonSelectOption } from "@ionic/react";
import { ethers } from "ethers";
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
import { NETWORK_DETAILS } from "../constants/networks";

import { NewPhonon, NetworkId } from "../types";
import { makeChange } from "../utils/math";

type Props = {
  isPending: boolean;
  networkId: NetworkId;
  onSubmit: (newPhonons: NewPhonon[]) => Promise<void>;
};

export const CreateNativePhonons: React.FC<Props> = ({
  isPending,
  networkId,
  onSubmit,
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isMassCreating, setIsMassCreating] = useState(false);

  const network = NETWORK_DETAILS[networkId];

  const createNewPhonons = (
    amount: number,
    denomination: string
  ): NewPhonon[] => {
    const arr = Array(amount);

    const denominationWithPrecision = ethers.utils
      .parseUnits(denomination, network.decimals)
      .toString();

    const newPhonon: NewPhonon = { denomination: denominationWithPrecision };
    return arr.fill(newPhonon) as NewPhonon[];
  };

  const onSubmitSuggested = (data: CreatePhononFormSuggestedValues) => {
    const change = makeChange(parseFloat(data.amount));
    const newPhonons: NewPhonon[] = change.flatMap((d) =>
      createNewPhonons(d.amount, d.denomination)
    );

    return onSubmit(newPhonons);
  };

  const onSubmitCustomized = (data: CreatePhononFormCustomValues) => {
    const newPhonons: NewPhonon[] = data.phononsToCreate.flatMap((d) =>
      createNewPhonons(d.amount, d.denomination)
    );

    return onSubmit(newPhonons);
  };

  const onSubmitSingle = (data: CreatePhononFormSingleValues) => {
    return onSubmit([
      {
        denomination: ethers.utils
          .parseUnits(data.denomination, network.decimals)
          .toString(),
      },
    ]);
  };

  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  const handleSuggest = () => {
    setIsCustomizing(false);
  };

  return (
    <div>
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
              {...{
                handleSuggest,
                onSubmit: onSubmitCustomized,
                isPending,
                networkId,
              }}
            />
          ) : (
            <CreatePhononFormSuggested
              {...{
                handleCustomize,
                onSubmit: onSubmitSuggested,
                isPending,
                networkId,
              }}
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
