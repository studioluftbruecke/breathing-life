import { keccak256 } from "viem";
import * as fs from 'fs'
import * as path from 'path'
// const { keccak256 } = require('viem');
// const fs = require('fs');
// const path = require('path');

// Array of images
const images = [
  {
    width: 1080,
    height: 1920,
    filename: 'DSCF0901',
    path: 'scripts/test-images/DSCF0901.jpg',
    url: 'https://emerald-broad-dolphin-376.mypinata.cloud/ipfs/bafybeigbuzqeilzgqcyd3ebhih2sgyqnxgtmk6juqg4ptne3mfze32buvy/DSCF0901.jpg'
  },
  {
    width: 1920,
    height: 1080,
    filename: 'DSCF0942',
    path: 'scripts/test-images/DSCF0942.jpg',
    url: 'https://emerald-broad-dolphin-376.mypinata.cloud/ipfs/bafybeigbuzqeilzgqcyd3ebhih2sgyqnxgtmk6juqg4ptne3mfze32buvy/DSCF0942.jpg'
  },
  {
    width: 1920,
    height: 1080,
    filename: 'DSCF1027',
    path: 'scripts/test-images/DSCF1027.jpg',
    url: 'https://emerald-broad-dolphin-376.mypinata.cloud/ipfs/bafybeigbuzqeilzgqcyd3ebhih2sgyqnxgtmk6juqg4ptne3mfze32buvy/DSCF1027.jpg'
  },  
];

// Directory to store LSP4Metadata JSON files
const outputDir = path.join(__dirname, 'lsp4metadata-files');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate LSP4Metadata for a single image
function generateLSP4Metadata(image: { width: number; height: number; path: string; url: string, filename: string }, index: number) {
  // Read the image file as raw bytes
  const fileBuffer = fs.readFileSync(image.path);

  // Compute the Keccak-256 hash
  const hash = keccak256(fileBuffer);

  // Create the LSP4Metadata object
  const lsp4Metadata = {
    LSP4Metadata: {
      name: `Breathing Life #${index + 1}`,
      description: `Breathing Life no. ${index + 1}`,
      links: [
        { title: 'Breathing Life - Studio Luftbruecke', url: 'https://breathinglife.studioluftbruecke.org' }
      ],
      icon: [
        {
          width: image.width,
          height: image.height,
          url: image.url,
          verification: {
            method: 'keccak256(bytes)',
            data: hash
          }
        }
      ],
      images: [
        [
          {
            width: image.width,
            height: image.height,
            url: image.url,
            verification: {
              method: 'keccak256(bytes)',
              data: hash
            }
          }
        ]
      ],
    }
  };

  // const lsp4Metadata2 = {
  //   LSP4Metadata: {
  //     name: `Breathing Life #${index + 1}`,
  //     description: `Breathing Life no. ${index + 1}`,
  //     links: [
  //       { title: 'Breathing Life - Studio Luftbruecke', url: 'https://breathinglife.studioluftbruecke.org' }
  //     ],
  //     images: [
  //       [
  //         {
  //           width: image.width,
  //           height: image.height,
  //           url: image.url,
  //           hashFunction: 'keccak256(bytes)',
  //           hash: hash
  //         }
  //       ]
  //     ],
  //   }
  // };

  return lsp4Metadata;
}

// Process each image and create a JSON file
images.forEach((image, index) => {
  try {
    // Generate LSP4Metadata
    const metadata = generateLSP4Metadata(image, index);

    // Define the output file path
    const fileName = `${image.filename}.json`;
    const outputPath = path.join(outputDir, fileName);

    // Write the metadata to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

    console.log(`Created ${fileName} successfully.`);
  } catch (error) {
    console.error(`Error processing image ${image.path}:`, (error as Error).message);
  }
});

console.log('All metadata files have been generated.');