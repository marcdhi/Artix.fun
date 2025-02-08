import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import axios from 'axios';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';
import ArtifactRankingABI from '../abi/ArtifactRanking.json';

const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const VENICE_API_KEY = import.meta.env.VITE_VENICE_API_KEY;
const ARTIX_RANKING_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_RANKING_CONTRACT_ADDRESS;

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
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'ai'>('manual');
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
      
      // Upload to IPFS
      const ipfsHash = await uploadToPinata(imageFile);
      console.log('IPFS Upload successful:', ipfsHash);

      const wallet = wallets[0];
      const provider = await wallet.getEthereumProvider();
      
      if (!provider) {
        throw new Error('No provider available');
      }

      await switchToBaseSepolia(provider);

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      await ethersProvider.send("eth_requestAccounts", []);
      const signer = ethersProvider.getSigner();

      // Submit meme
      console.log('Submitting meme to contract...');
      const memeContract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtixMemeContestABI,
        signer
      );

      const memeTx = await memeContract.submitMeme(
        ipfsHash,
        formData.title,
        formData.description,
        formData.socialLinks,
        BigInt(formData.networkId),
        { gasLimit: 500000 }
      );

      console.log('Meme submission transaction sent:', memeTx.hash);
      const memeReceipt = await memeTx.wait();
      console.log('Meme submission confirmed:', memeReceipt);

      // Update user's ranking for meme submission
      console.log('Updating user ranking for meme submission...');
      const rankingContract = new ethers.Contract(
        ARTIX_RANKING_CONTRACT_ADDRESS,
        ArtifactRankingABI,
        signer
      );

      const rankingTx = await rankingContract.updateRanking(wallets[0].address, 0, true);
      await rankingTx.wait();
      console.log('Ranking updated successfully');

      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setFormData({
        title: '',
        description: '',
        socialLinks: '',
        networkId: '84532'
      });
      
      alert('Meme submitted successfully! Transaction hash: ' + memeTx.hash);
    } catch (error: any) {
      console.error('Detailed error:', error);
      alert('Error submitting meme: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const generateAIMeme = async () => {
    if (!aiPrompt) return;
    
    try {
      setIsGeneratingAI(true);
      
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VENICE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "fluently-xl",
          prompt: aiPrompt,
          width: 1024,
          height: 1024,
          steps: 30,
          hide_watermark: false,
          return_binary: false,
          seed: Math.floor(Math.random() * 1000000),
          cfg_scale: 7,
          style_preset: "3D Model",
          negative_prompt: "blurry, low quality, distorted",
          safe_mode: false
        })
      };

      const response = await fetch('https://api.venice.ai/api/v1/image/generate', options);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Log the response to see what we're getting
      console.log('Venice API Response:', data);

      // Check if we have the base64 image data
      if (!data.images?.[0]) {
        throw new Error('No image data in response');
      }

      // Get the base64 image data
      const base64Image = data.images[0];
      console.log('Got base64 image data');

      // Convert base64 to blob
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      console.log('Converted to blob:', blob);
      
      // Create a File object from the blob
      const file = new File([blob], 'ai-generated-meme.png', { type: 'image/png' });
      
      // Create an object URL for preview
      const previewUrl = URL.createObjectURL(blob);
      console.log('Preview URL:', previewUrl);

      setImageFile(file);
      setImagePreview(previewUrl);
      
    } catch (error) {
      console.error('Error generating AI meme:', error);
      alert('Failed to generate AI meme. Please try again.');
    } finally {
      setIsGeneratingAI(false);
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
              
              {/* Upload Method Selection */}
              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setUploadMethod('manual')}
                    className={`flex-1 py-2 px-4 rounded ${
                      uploadMethod === 'manual'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Manual Upload
                  </button>
                  <button
                    onClick={() => setUploadMethod('ai')}
                    className={`flex-1 py-2 px-4 rounded ${
                      uploadMethod === 'ai'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    AI Generate
                  </button>
                </div>

                {uploadMethod === 'ai' && !imagePreview && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your meme
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="E.g., A funny cat wearing sunglasses and riding a skateboard"
                        className="flex-1 px-4 py-2 bg-[#F3F4F6] border border-gray-200 rounded text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                      />
                      <button
                        onClick={generateAIMeme}
                        disabled={!aiPrompt || isGeneratingAI}
                        className={`px-4 py-2 rounded text-white text-sm font-medium ${
                          !aiPrompt || isGeneratingAI ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isGeneratingAI ? 'Generating...' : 'Generate'}
                      </button>
                    </div>
                  </div>
                )}

                {uploadMethod === 'manual' && !imagePreview ? (
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
                ) : imagePreview && (
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