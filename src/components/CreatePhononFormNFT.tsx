import { IonButton } from "@ionic/react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { TAGS } from "../constants/tags";
import useAssetDetails from "../hooks/useAssetDetails";
import useNetwork from "../hooks/useNetwork";
import useSetAssetDetails from "../hooks/useSetAssetDetails";
import { AssetTypeId, NewPhonon } from "../types";

export type CreatePhononFormNFTValues = {
  contractAddress: string;
  tokenId: string;
};

export const CreateNFTPhononForm: React.FC<{
  onSubmit: (newPhonon: NewPhonon[]) => Promise<void>;
  isPending: boolean;
}> = ({ onSubmit, isPending }) => {
  const network = useNetwork();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePhononFormNFTValues>();

  const contractAddress = useWatch({
    name: "contractAddress",
    control,
  });

  useSetAssetDetails(network.id, AssetTypeId.ERC721, contractAddress);

  const onSubmitInternal = (data: CreatePhononFormNFTValues) => {
    return onSubmit([
      {
        denomination: "1",
        tags: [
          {
            TagName: TAGS.contractAddress,
            TagValue: data.contractAddress,
          },
          { TagName: TAGS.tokenId, TagValue: data.tokenId },
        ],
      },
    ]);
  };

  const assetDetail = useAssetDetails(
    network.id,
    AssetTypeId.ERC721,
    contractAddress
  );

  return (
    <>
      <p className="text-xl font-bold text-center text-gray-300 uppercase">
        CREATE {assetDetail?.symbol || "NFT"} PHONON
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
          placeholder="Token ID"
          disabled={isPending}
          {...register("tokenId", {
            required: true,
          })}
        />
        {errors?.tokenId?.type === "required" && (
          <p className="text-bold p-2 text-xl text-zinc-200 shadow-inner">
            Token ID is required.
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
