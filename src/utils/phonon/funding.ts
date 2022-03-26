import { ethers } from "ethers";
import { NetworkId, AssetTypeId, PhononDTO } from "../../types";
import { isEVMChain } from "../network";
import { ERC20__factory, ERC721__factory } from "./contracts";
import { getTagValue } from "./phonon-general";

type ERC20FundingData = {
  contractAddress: string;
};

type ERC721FundingData = {
  contractAddress: string;
  tokenId: string;
};

const getERC721FundingData = (phonon: PhononDTO): ERC721FundingData => {
  const contractAddress = getTagValue(phonon, "TagPhononContractAddress");
  const tokenId = getTagValue(phonon, "TagPhononContractTokenID");

  if (!contractAddress || !tokenId) {
    throw Error(
      `Invalid funding data - contractAddress: ${
        contractAddress || ""
      }, tokenId: ${tokenId || ""}`
    );
  }

  return {
    contractAddress,
    tokenId,
  };
};

const getERC20FundingData = (phonon: PhononDTO): ERC20FundingData => {
  const contractAddress = getTagValue(phonon, "TagPhononContractAddress");

  if (!contractAddress) {
    throw Error(`Invalid funding data - no contract address`);
  }

  return { contractAddress };
};

const fundPhonon = async (phonon: PhononDTO): Promise<void> => {
  console.log(phonon);

  if (isEVMChain(phonon.CurrencyType)) {
    // @ts-expect-error - window
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    if (!signer) {
      throw new Error("signer is required");
    }

    if (phonon.ChainID === AssetTypeId.Native) {
      await (
        await signer.sendTransaction({
          to: phonon.Address,
          value: phonon.Denomination,
        })
      ).wait();
      return;
    }

    if (phonon.ChainID === AssetTypeId.ERC20) {
      const data = getERC20FundingData(phonon);
      const erc20 = ERC20__factory.connect(data.contractAddress, signer);
      await (await erc20.transfer(phonon.Address, phonon.Denomination)).wait();
      return;
    }

    if (phonon.ChainID === AssetTypeId.ERC721) {
      const fromAddress = await signer.getAddress();
      const data = getERC721FundingData(phonon);
      const erc721 = ERC721__factory.connect(data.contractAddress, signer);
      await (
        await erc721.safeTransferFrom(fromAddress, phonon.Address, data.tokenId)
      ).wait();
      return;
    }
  }

  console.error(
    `Funding ${NetworkId[phonon.CurrencyType]} ${
      AssetTypeId[phonon.ChainID]
    } is not implemented`
  );
};

export default fundPhonon;
