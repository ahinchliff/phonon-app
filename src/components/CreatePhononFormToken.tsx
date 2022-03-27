import { IonButton } from "@ionic/react";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import useNetwork from "../hooks/useNetwork";
import { NewPhonon } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssetDetails } from "../store/assetsSlice";
import { RootState } from "../store";

export type CreatePhononFormTokenValues = {
  contractAddress: string;
  amount: string;
};

export const CreateTokenPhononForm: React.FC<{
  onSubmit: (newPhonon: NewPhonon[]) => Promise<void>;
  isPending: boolean;
}> = ({ onSubmit, isPending }) => {
  const network = useNetwork();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePhononFormTokenValues>();

  const contractAddress = useWatch({
    name: "contractAddress",
    control,
  });

  useEffect(() => {
    if (!ethers.utils.isAddress(contractAddress)) {
      return;
    }

    dispatch(fetchAssetDetails({ networkId: network.id, contractAddress }));
  }, [contractAddress, network, dispatch]);

  const onSubmitInternal = (data: CreatePhononFormTokenValues) => {
    return onSubmit([
      {
        denomination: data.amount,
        tags: [
          {
            TagName: "TagPhononContractAddress",
            TagValue: data.contractAddress,
          },
        ],
      },
    ]);
  };

  const assetDetails = useSelector(
    (state: RootState) => state.assets.assetDetails
  );

  const assetDetail = assetDetails.find(
    (asset) => asset.contractAddress === contractAddress
  );

  return (
    <>
      <p className="text-xl font-bold text-center text-gray-300 uppercase">
        CREATE {assetDetail?.symbol || "TOKEN"} PHONON
      </p>

      <form
        className="flex flex-col content-center justify-start h-full gap-2 p-2"
        onSubmit={handleSubmit(onSubmitInternal)}
      >
        <input
          className="text-bold p-2 text-xl bg-zinc-800 shadow-inner"
          placeholder="Contract address"
          disabled={isPending}
          {...register("contractAddress", {
            required: true,
          })}
        />
        {errors?.contractAddress?.type === "required" && (
          <p className="text-bold p-2 text-xl text-zinc-200 shadow-inner">
            Contract address is required.
          </p>
        )}

        <input
          className="text-bold p-2 text-xl bg-zinc-800 shadow-inner"
          placeholder="Amount"
          disabled={isPending}
          {...register("amount", {
            required: true,
          })}
        />
        {errors?.amount?.type === "required" && (
          <p className="text-bold p-2 text-xl text-zinc-200 shadow-inner">
            Amount is required.
          </p>
        )}

        <div className="pinned">
          <IonButton
            key="submit"
            size="large"
            type="submit"
            fill="solid"
            expand="full"
            color="primary"
            className="shadow-lg shadow-teal-300/40"
            disabled={isPending}
          >
            Create
          </IonButton>
        </div>
      </form>
    </>
  );
};
