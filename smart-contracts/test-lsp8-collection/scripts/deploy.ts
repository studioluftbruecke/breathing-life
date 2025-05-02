import { ethers } from "hardhat";
import { BreathingLifeTest__factory } from "../typechain-types";

import { config as LoadEnv } from "dotenv";
LoadEnv();

const { PUBLIC_KEY, COLLECTION_OWNER } = process.env;

const main = async () => {

  if (!PUBLIC_KEY || !COLLECTION_OWNER) {
    console.error("Missing environment variables. Please ensure PUBLIC_KEY and COLLECTION_OWNER are set in .env.");
    return;
  }

  // Get signer using the public key from the environment variables
  const signer = await ethers.getSigner(PUBLIC_KEY);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Deploy the Munchkins contract
  const collection = await new BreathingLifeTest__factory(signer).deploy(
    "Breathing Life - Test",
    "BLT",
    COLLECTION_OWNER
  );

  console.log("Contract deployed to", await collection.getAddress());
};


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});