import { readFileSync } from "fs";
import { ethers } from "hardhat";
import { toBeHex } from "ethers";
import { BreathingLifeTest__factory } from "../typechain-types";

import { config as LoadEnv } from "dotenv";
import { ERC725 } from "@erc725/erc725.js";
import LSP4DigitalAssetSchema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";

const erc725 = new ERC725(LSP4DigitalAssetSchema);
LoadEnv();

const { COLLECTION_OWNER, COLLECTION_ADDRESS, PUBLIC_KEY } = process.env;

const main = async () => {
 
  if (!COLLECTION_OWNER) {
    console.log("COLLECTION_OWNER is not set in .env")
    return;
  }

  console.log('getting signer...')
  const signer = await ethers.getSigner(COLLECTION_OWNER);

  const url =
    "ipfs://bafybeicuvbnbu4arkeqkrkem4ku2shk5dndlge3krsjglgztpwmsvzy6ry/DSCF0901.json";
  const json = JSON.parse(readFileSync("../../scripts/lsp4metadata-files/DSCF0901.json").toString());

  const encodedMetadataURI = erc725.encodeData([
    {
      keyName: "LSP4Metadata",
      value: {
        url,
        json,
      },
    },
  ]);

  const collectionAddress = COLLECTION_ADDRESS;
  if (!collectionAddress) {
    console.error("COLLECTION_ADDRESS is not set in .env")
    return;
  }
  const tokenId = toBeHex(1, 32);
  const collection = BreathingLifeTest__factory.connect(
    collectionAddress,
    signer
  );

  console.log('tokenId', tokenId)
  console.log('encodedMetadataURI', encodedMetadataURI)

  const tx = await collection.setDataForTokenId(
    tokenId,
    encodedMetadataURI.keys[0],
    encodedMetadataURI.values[0]
  );

  console.log('tx', tx)

  await tx.wait(1);

  console.log(
    await collection.getDataForTokenId(tokenId, encodedMetadataURI.keys[0])
  );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
