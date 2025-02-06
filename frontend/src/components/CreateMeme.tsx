import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import axios from 'axios';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';

const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

// Base Sepolia network parameters
const BASE_SEPOLIA_PARAMS = {
  chainId: '0x' + Number(84532).toString(16), // Base Sepolia chainId in hex
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org']
};

function CreateMeme() {
  const { login, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [acceptRoyalty, setAcceptRoyalty] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    socialLinks: '',
    networkId: '84532' // Default to Base Sepolia
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadToPinata = async (file: File): Promise<string> => {
    try {
      console.log('Starting upload to Pinata...');
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Log headers (without showing full credentials)
      console.log('Upload headers check:', {
        hasApiKey: !!PINATA_API_KEY,
        hasSecretKey: !!PINATA_SECRET_KEY,
        contentType: 'multipart/form-data'
      });

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
      throw new Error(`Failed to upload image to IPFS: ${error.response?.data?.message || error.message}`);
    }
  };

  const testPinataConnection = async () => {
    try {
      console.log('Testing Pinata connection with credentials:', {
        hasApiKey: !!PINATA_API_KEY,
        apiKeyLength: PINATA_API_KEY?.length,
        hasSecretKey: !!PINATA_SECRET_KEY,
        secretKeyLength: PINATA_SECRET_KEY?.length
      });

      const res = await axios.get("https://api.pinata.cloud/data/testAuthentication", {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      });

      console.log('Pinata Connection Test Response:', res.data);
      alert('Pinata Connection Test Successful! Check console for details.');
    } catch (error: any) {
      console.error('Pinata Connection Test Failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Pinata Connection Test Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const switchToBaseSepolia = async (provider: any) => {
    try {
      // Try switching to Base Sepolia
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_PARAMS.chainId }],
      });
    } catch (switchError: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_PARAMS],
          });
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError);
          throw new Error('Could not add Base Sepolia network to your wallet');
        }
      } else {
        console.error('Error switching to Base Sepolia:', switchError);
        throw new Error('Could not switch to Base Sepolia network');
      }
    }
  };

  const submitMeme = async () => {
    if (!imageFile || !authenticated || !wallets?.[0]) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsUploading(true);

      // Log contract address
      console.log('Contract address from env:', ARTIX_CONTRACT_ADDRESS);
      
      // 1. Upload image to IPFS via Pinata
      const ipfsHash = await uploadToPinata(imageFile);
      console.log('IPFS Upload successful:', ipfsHash);

      // 2. Get wallet and provider
      const wallet = wallets[0];
      
      // Request wallet connection if not already connected
      if (!wallet.address) {
        await login(); // Use Privy login instead of direct wallet connect
        return; // Exit and let user try again after connecting
      }

      // Get the provider
      const provider = await wallet.getEthereumProvider();
      
      if (!provider) {
        throw new Error('No provider available');
      }

      // Switch to Base Sepolia network first
      await switchToBaseSepolia(provider);

      // 3. Create ethers provider and signer
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      await ethersProvider.send("eth_requestAccounts", []); // Explicitly request accounts
      const signer = ethersProvider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log('Signer address:', signerAddress);

      // Get the current network
      const network = await ethersProvider.getNetwork();
      console.log('Current network:', network);

      // Verify we're on Base Sepolia
      if (network.chainId !== 84532) {
        throw new Error('Please make sure you are connected to Base Sepolia network');
      }

      // Log contract verification attempt
      console.log('Attempting to verify contract at address:', ARTIX_CONTRACT_ADDRESS);
      
      // Verify contract code exists
      const code = await ethersProvider.getCode(ARTIX_CONTRACT_ADDRESS);
      console.log('Contract bytecode:', code);
      console.log('Contract exists:', code !== '0x');
      
      if (code === '0x') {
        console.error('Contract not found. Please verify:');
        console.error('1. Contract address is correct');
        console.error('2. Contract is deployed to Base Sepolia');
        console.error('3. You are connected to Base Sepolia network');
        throw new Error('Contract not found at the specified address. Please check console for details.');
      }

      // 4. Create contract instance
      console.log('Creating contract instance with ABI:', ArtixMemeContestABI);
      const contract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtixMemeContestABI,
        signer
      );

      // Log the voting configuration to check contract state
      try {
        const votingConfig = await contract.votingConfiguration();
        console.log('Current voting configuration:', votingConfig);
      } catch (error) {
        console.warn('Could not fetch voting configuration:', error);
      }

      console.log('Submitting meme to contract with data:', {
        ipfsHash,
        title: formData.title,
        description: formData.description,
        socialLinks: formData.socialLinks,
        networkId: formData.networkId,
        contractAddress: ARTIX_CONTRACT_ADDRESS,
        signerAddress
      });

      // Try to estimate gas first to check if the transaction will fail
      try {
        const gasEstimate = await contract.estimateGas.submitMeme(
          ipfsHash,
          formData.title,
          formData.description,
          formData.socialLinks,
          BigInt(formData.networkId)
        );
        console.log('Estimated gas:', gasEstimate.toString());
      } catch (error) {
        console.error('Gas estimation failed:', error);
        // Try to get more details about the revert
        try {
          await ethersProvider.call({
            to: ARTIX_CONTRACT_ADDRESS,
            data: contract.interface.encodeFunctionData('submitMeme', [
              ipfsHash,
              formData.title,
              formData.description,
              formData.socialLinks,
              BigInt(formData.networkId)
            ])
          });
        } catch (callError: any) {
          console.error('Detailed call error:', callError);
          throw new Error(`Transaction will fail: ${callError.message}`);
        }
      }

      // 5. Submit meme to contract
      const tx = await contract.submitMeme(
        ipfsHash,
        formData.title,
        formData.description,
        formData.socialLinks,
        BigInt(formData.networkId),
        { 
          gasLimit: 500000
        }
      );

      console.log('Transaction sent:', tx.hash);
      
      // 6. Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Reset form and show success
      setImageFile(null);
      setImagePreview(null);
      setFormData({
        title: '',
        description: '',
        socialLinks: '',
        networkId: '84532'
      });
      
      alert('Meme submitted successfully! Transaction hash: ' + tx.hash);
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        code: error.code,
        data: error.data,
        transaction: error.transaction,
      });
      
      let errorMessage = 'Error submitting meme: ';
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        errorMessage += 'Transaction might fail. Please check your inputs and try again.';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage += 'Insufficient funds for transaction. You need Base Sepolia ETH.';
      } else if (error.message.includes('user rejected')) {
        errorMessage += 'Transaction was rejected.';
      } else if (error.message.includes('network')) {
        errorMessage += 'Please make sure you are connected to Base Sepolia network.';
      } else {
        errorMessage += error.message || 'Unknown error';
      }
      
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (!authenticated) {
      login();
    } else {
      setStep(prev => prev === 3 ? 3 : (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevious = () => {
    setStep(prev => prev === 1 ? 1 : (prev - 1) as 1 | 2 | 3);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-8 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold text-gray-900 mb-2">
            Create Your Meme
          </h1>
          <p className="text-base text-gray-600">
            Submit your meme to the Artix Meme Contest
          </p>
          {/* Test Pinata Connection Button */}
          {/* <button
            onClick={testPinataConnection}
            className="mt-4 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded"
          >
            Test Pinata Connection
          </button> */}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex-1 relative">
            <div className={`h-0.5 absolute left-0 right-0 top-1/2 -translate-y-1/2 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className="relative flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="absolute -bottom-6 text-sm font-medium text-gray-900">Meme information</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className={`h-0.5 absolute left-0 right-0 top-1/2 -translate-y-1/2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className="relative flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="absolute -bottom-6 text-sm font-medium text-gray-600">Connect wallet</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className={`h-0.5 absolute left-0 right-0 top-1/2 -translate-y-1/2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className="relative flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="absolute -bottom-6 text-sm font-medium text-gray-600">AI Marketing</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-8 shadow-sm">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Meme</h2>
              
              {/* Image Upload */}
              <div className="mb-6">
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="meme-upload"
                    />
                    <label
                      htmlFor="meme-upload"
                      className="block w-full aspect-square bg-[#F3F4F6] border-2 border-dashed border-gray-300 rounded-sm cursor-pointer"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 mb-2 text-gray-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium">
                          Upload Meme Image
                        </button>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square bg-[#F3F4F6] rounded-sm">
                    <img
                      src={imagePreview}
                      alt="Uploaded meme"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 px-3 py-1 bg-white/90 text-sm text-gray-900 rounded-full shadow-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter meme title"
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter meme description"
                    rows={4}
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700 mb-1">
                    Social Links
                  </label>
                  <input
                    id="socialLinks"
                    type="text"
                    name="socialLinks"
                    value={formData.socialLinks}
                    onChange={handleInputChange}
                    placeholder="Enter your social media links"
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="networkId" className="block text-sm font-medium text-gray-700 mb-1">
                    Network
                  </label>
                  <select
                    id="networkId"
                    name="networkId"
                    value={formData.networkId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-blue-600"
                  >
                    <option value="84532">Base Sepolia</option>
                  </select>
                </div>
              </div>

              {/* Royalty Agreement */}
              <div className="mt-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="royalty"
                  checked={acceptRoyalty}
                  onChange={(e) => setAcceptRoyalty(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="royalty" className="text-sm text-gray-600">
                  I confirm that I accept the 3% royalty fee.
                </label>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={!acceptRoyalty || !imageFile || !formData.title}
                className={`mt-8 w-full py-3 ${
                  !acceptRoyalty || !imageFile || !formData.title ? 'bg-gray-400' : 'bg-blue-600'
                } text-white font-medium transition-colors`}
              >
                Next Step
              </button>
            </>
          )}

          {step === 2 && (
            <div className="py-12">
              <div className="text-center">
                {!authenticated ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 mb-8">Please connect your wallet to continue</p>
                    <button
                      onClick={login}
                      className="px-6 py-3 bg-blue-600 text-white font-medium"
                    >
                      Connect Wallet
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Meme</h2>
                    <p className="text-gray-600 mb-8">Ready to submit your meme to the blockchain</p>
                    <div className="flex justify-between gap-4">
                      <button
                        onClick={handlePrevious}
                        className="flex-1 py-3 border border-blue-600 text-blue-600 font-medium"
                      >
                        Previous
                      </button>
                      <button
                        onClick={submitMeme}
                        disabled={isUploading}
                        className={`flex-1 py-3 ${
                          isUploading ? 'bg-gray-400' : 'bg-blue-600'
                        } text-white font-medium`}
                      >
                        {isUploading ? 'Uploading...' : 'Submit Meme'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Marketing</h2>
                <p className="text-gray-600 mb-8">Coming soon...</p>
                
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-blue-600 text-blue-600 font-medium"
                >
                  Back to Submission
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateMeme; 