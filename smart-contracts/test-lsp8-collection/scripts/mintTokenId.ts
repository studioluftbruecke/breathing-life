import { readFileSync } from "fs";
import { ethers } from "hardhat";
import { toBeHex } from "ethers";

import { BreathingLifeTest__factory } from "../typechain-types";
import { config as LoadEnv } from "dotenv";

LoadEnv();

const { COLLECTION_OWNER, COLLECTION_ADDRESS, TO_ADDRESS } = process.env;

const main = async () => {
  if (!COLLECTION_OWNER) {
    console.log("COLLECTION_OWNER is not set in .env");
    return;
  }

  if (!COLLECTION_ADDRESS) {
    console.log("COLLECTION_ADDRESS is not set in .env");
    return;
  }

  if (!TO_ADDRESS) {
    console.log("TO_ADDRESS is not set in .env");
    return;
  }

  const signer = await ethers.getSigner(COLLECTION_OWNER);

  const collectionAddress = COLLECTION_ADDRESS;
  //const collectionAddress ="0x0B9AAdd3C34DF45207c028bce69704E7FDdCB49d";
  const collection = BreathingLifeTest__factory.connect(
    collectionAddress,
    signer
  );

  const to = TO_ADDRESS;
  const tokenId = toBeHex(1, 32);
  const force = false;
  const data = "0x";

  const tx = await collection.mint(to, tokenId, force, data);

  await tx.wait(1);

  console.log(await collection.tokenOwnerOf(tokenId));
};

main();
