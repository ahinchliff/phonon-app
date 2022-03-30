import { IonButton, IonSelect, IonSelectOption } from "@ionic/react";
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

import { NewPhonon, NetworkId } from "../types";
import { ethToWei } from "../utils/denomination";
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

  const onSubmitSuggested = (data: CreatePhononFormSuggestedValues) => {
    const change = makeChange(parseFloat(data.amount));
    const newPhonons: NewPhonon[] = change.flatMap((d) => {
      const arr = Array(d.amount);
      const denomination = ethToWei(d.denomination);
      // todo - decimals
      const newPhonon: NewPhonon = { denomination };
      return arr.fill(newPhonon) as NewPhonon[];
    });

    return onSubmit(newPhonons);
  };

  const onSubmitCustomized = (data: CreatePhononFormCustomValues) => {
    const newPhonons: NewPhonon[] = data.phononsToCreate.flatMap((d) => {
      const arr = Array(d.amount);
      const denomination = ethToWei(d.denomination);
      // todo - decimals
      const newPhonon: NewPhonon = { denomination };
      return arr.fill(newPhonon) as NewPhonon[];
    });

    return onSubmit(newPhonons);
  };

  const onSubmitSingle = (data: CreatePhononFormSingleValues) => {
    // todo - decimals
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
