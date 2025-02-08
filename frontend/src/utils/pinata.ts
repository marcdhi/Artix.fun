import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

export const uploadToPinata = async (file: File): Promise<string> => {
  try {
    console.log('Starting upload to Pinata...');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload to Pinata
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });

    // Return the IPFS hash
    const ipfsHash = `ipfs://${res.data.IpfsHash}`;
    console.log('Upload successful. IPFS Hash:', ipfsHash);
    return ipfsHash;
  } catch (error: any) {
    console.error('Detailed upload error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Failed to upload to IPFS: ${error.response?.data?.message || error.message}`);
  }
}; 