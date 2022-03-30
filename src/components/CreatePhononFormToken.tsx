import { IonButton } from "@ionic/react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { AssetTypeId, NetworkId, NewPhonon } from "../types";
import useAssetDetails from "../hooks/useAssetDetails";
import { TAGS } from "../constants/tags";
import useSetAssetDetails from "../hooks/useSetAssetDetails";
import { ethers } from "ethers";
import { NETWORK_DETAILS } from "../constants/networks";

export type CreatePhononFormTokenValues = {
  contractAddress: string;
  amount: string;
};

export const CreateTokenPhononForm: React.FC<{
  networkId: NetworkId;
  isPending: boolean;
  onSubmit: (newPhonon: NewPhonon[]) => Promise<void>;
}> = ({ onSubmit, networkId, isPending }) => {
  const network = NETWORK_DETAILS[networkId];

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

  const { loading, error } = useSetAssetDetails(
    network.id,
    AssetTypeId.ERC20,
    contractAddress
  );

  const assetDetail = useAssetDetails(
    network.id,
    AssetTypeId.ERC20,
    contractAddress
  );

  const onSubmitInternal = (data: CreatePhononFormTokenValues) => {
    if (!assetDetail) {
      console.error("No asset details");
      return;
    }

    return onSubmit([
      {
        denomination: ethers.utils
          .parseUnits(data.amount, assetDetail.decimals)
          .toString(),
        tags: [
          {
            TagName: TAGS.contractAddress,
            TagValue: data.contractAddress,
          },
        ],
      },
    ]);
  };

  return (
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

      {loading && <p>Fetching token details...</p>}
      {!!error && <p>Failed fetching token details - {error}</p>}

      <div className="pinned">
        <IonButton
          key="submit"
          size="large"
          type="submit"
          fill="solid"
          expand="full"
          color="primary"
          className="shadow-lg shadow-teal-300/40"
          disabled={isPending || !assetDetail}
        >
          Create
        </IonButton>
      </div>
    </form>
  );
};
