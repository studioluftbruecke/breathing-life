import { createPublicClient, createWalletClient, custom, http, parseAbiItem } from "viem";
import { Button } from "./lib/components/ui/button";
import { luksoTestnet } from "viem/chains";
import { simulateContract, waitForTransactionReceipt, writeContract } from "viem/actions";
import { lsp8IdentifiableDigitalAssetAbi, lsp8MintableAbi } from '@lukso/lsp-smart-contracts/abi';


// Lukso network configuration
const publicClient = createPublicClient({
  chain: luksoTestnet,
  transport: http('https://rpc.testnet.lukso.network'),
});

const walletClient = createWalletClient({
  chain: luksoTestnet,
  // @ts-ignore
  transport: custom(window.lukso), // Universal Profile Browser Extension
});


export default function MintTokenButton(props: {
  collectionOwner: `0x${string}`;
  toAddress: `0x${string}`;
  tokenId: `0x${string}`;
  collectionAddress: `0x${string}`;
}) {


  const handleMintToken = async () => {
    console.log('Minting token...');

    // // @ts-ignore
    await window.lukso.request({ method: 'eth_requestAccounts' });

    // Get the active account from walletClient
    const accounts = await walletClient.getAddresses();
    if (!accounts.length) {
      throw new Error('No account found in Universal Profile Browser Extension. Please connect your wallet.');
    }
    const account = accounts[0];
    console.log('Active account:', account);

    // // ABI for the mint function (adjust based on your contract's actual ABI)
    // const mintAbi = parseAbiItem(
    //   "function mint(address to, uint256 tokenId, bool force, bytes data) public"
    // );

    // // Execute mint transaction
    // const { request } = await walletClient.simulateContract({
    //   address: collectionAddress,
    //   abi: [mintAbi],
    //   functionName: "mint",
    //   args: [to, tokenId, force, data],
    //   account,
    // });

    const { request } = await simulateContract(walletClient, {
      address: props.collectionAddress,
      abi: lsp8MintableAbi,
      functionName: 'mint',
      args: [props.toAddress, props.tokenId, false, '0x'],
      account
    });
    console.log('Simulation successful.');
    return

    const hash = await walletClient.writeContract(request);

    // Wait for transaction confirmation
    // Wait for confirmation
    const receipt = await waitForTransactionReceipt(publicClient, {
      hash
    });

    console.log('receipt', receipt)

    // ABI for tokenOwnerOf function
    // const tokenOwnerOfAbi = parseAbiItem(
    //   "function tokenOwnerOf(uint256 tokenId) public view returns (address)"
    // );

    // Read token owner
    const owner = await publicClient.readContract({
      address: props.collectionAddress,
      abi: lsp8IdentifiableDigitalAssetAbi,
      functionName: "tokenOwnerOf",
      args: [props.tokenId],
    });

    console.log(owner);


    // console.log('Sending transaction...');
    // const txHash = await writeContract(walletClient, {
    //   address: collectionAddress as `0x${string}`,
    //   abi: [mintAbi],
    //   functionName: 'mint',
    //   args: [toAddress, tokenId, force, data],
    //   account
    // });

    // console.log('Transaction hash:', txHash);
    // setTxHash(txHash);

    // // Wait for confirmation
    // const receipt = await waitForTransactionReceipt(publicClient, {
    //   hash: txHash,
    // });
  }

  return (
    <div>
      <Button onClick={handleMintToken}>Mint Token</Button>
    </div>
  );
}