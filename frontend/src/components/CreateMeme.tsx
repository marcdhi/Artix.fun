import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import axios from 'axios';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';
import ArtifactRankingABI from '../abi/ArtifactRanking.json';
import { Link } from 'react-router-dom';

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
  const { login, authenticated } = usePrivy();
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
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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
      setSubmissionSuccess(true);
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
    <div className="relative min-h-screen bg-[#121212]">
      {/* Background gradient */}
      <div className="absolute" />

        {/* Accent gradient div */}
        <div className="relative w-full h-[300px] rounded-t-full overflow-hidden mt-22">
          <div className="absolute inset-0 bg-gradient-to-b from-[#010EFB] to-[#121212] opacity-20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-[64px] font-bold text-white mb-2 font-['Poppins'] text-center">
              Create Your Meme
            </h1>
            <p className="text-white/60 text-lg font-['Poppins'] text-center">
              When your meme completes its bonding curve you receive XYZ
            </p>
          </div>
        </div>
      
      <div className="relative max-w-3xl mx-auto px-4 py-16">

        {/* Progress Steps */}
        <div className="flex items-stretch w-full mb-12 bg-[#0A1D0A] rounded-full overflow-hidden h-12">
          <div className={`flex-1 flex items-center gap-3 px-6 ${
            step === 1 ? 'bg-[#143114]' : ''
          }`}>
            {step === 1 && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span className={`text-base font-medium font-['Poppins'] ${
              step === 1 ? 'text-white' : 'text-white/60'
            }`}>1. meme</span>
          </div>

          <div className={`flex-1 flex items-center gap-3 px-6 ${
            step === 2 ? 'bg-[#143114]' : ''
          }`}>
            {step === 2 && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span className={`text-base font-medium font-['Poppins'] ${
              step === 2 ? 'text-white' : 'text-white/60'
            }`}>{authenticated ? '2. submit meme' : '2. connect wallet'}</span>
          </div>

          <div className={`flex-1 flex items-center gap-3 px-6 ${
            step === 3 ? 'bg-[#143114]' : ''
          }`}>
            {step === 3 && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span className={`text-base font-medium font-['Poppins'] ${
              step === 3 ? 'text-white' : 'text-white/60'
            }`}>3. AI Marketing</span>
          </div>
        </div>

        {/* Upload Method Selection */}
        <div className="flex gap-2 mb-8 bg-[#1A1A1A] p-1 rounded-full max-w-md mx-auto">
          <button
            onClick={() => setUploadMethod('ai')}
            className={`flex-1 px-6 py-2.5 rounded-full font-['Poppins'] font-medium transition-all ${
              uploadMethod === 'ai' 
                ? 'bg-[#FFD700] text-[#121212]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            generate with ai
          </button>
          <button
            onClick={() => setUploadMethod('manual')}
            className={`flex-1 px-6 py-2.5 rounded-full font-['Poppins'] font-medium transition-all ${
              uploadMethod === 'manual' 
                ? 'bg-[#1A1A1A] text-[#FFD700] border border-[#FFD700]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            upload your meme
          </button>
        </div>

        <p className="text-white/60 text-center text-sm mb-8 font-['Poppins']">
          You can either generate your memes with our AI superpowers or<br />
          upload your own meme that you created before
        </p>

        {/* Main Form Section */}
        {step === 1 && (
          <div className="flex gap-8">
            {/* Left Column - Upload/Preview */}
            <div className="w-1/2 space-y-6">
              {uploadMethod === 'ai' ? (
                <div className="space-y-6">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="write your prompt to generate meme"
                    className="w-full h-32 px-6 py-4 bg-[#1A1A1A] text-white placeholder-white/40 rounded-2xl border border-[#FFD700]/20 focus:border-[#FFD700] focus:outline-none font-['Poppins']"
                  />
                  <button
                    onClick={generateAIMeme}
                    disabled={!aiPrompt || isGeneratingAI}
                    className={`group w-full px-6 py-3 rounded-full font-['Poppins'] font-medium transition-all relative ${
                      !aiPrompt || isGeneratingAI 
                        ? 'bg-[#1A1A1A]/50 text-white/60' 
                        : 'bg-[#FFD700] text-[#121212] hover:bg-[#FFD700]/90'
                    }`}
                  >
                    {isGeneratingAI ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>generating...</span>
                      </div>
                    ) : (
                      <span>generate meme</span>
                    )}
                  </button>
                </div>
              ) : (
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
                    className="block w-full aspect-square bg-[#1A1A1A] border-2 border-dashed border-[#FFD700]/20 rounded-2xl cursor-pointer hover:border-[#FFD700]/40 transition-colors"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 mb-4 text-[#FFD700]/60">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="text-white/60 font-['Poppins']">Click to upload your meme</span>
                    </div>
                  </label>
                </div>
              )}

              {imagePreview && (
                <div className="relative w-full aspect-square bg-[#1A1A1A] rounded-2xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Uploaded meme"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 px-4 py-2 bg-[#121212]/80 backdrop-blur-sm text-white rounded-full font-['Poppins'] hover:bg-[#121212] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className="w-1/2 space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="title of your meme"
                className="w-full px-6 py-4 bg-[#1A1A1A] text-white placeholder-white/40 rounded-full border border-[#FFD700]/20 focus:border-[#FFD700] focus:outline-none font-['Poppins']"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="description of your meme"
                rows={4}
                className="w-full px-6 py-4 bg-[#1A1A1A] text-white placeholder-white/40 rounded-2xl border border-[#FFD700]/20 focus:border-[#FFD700] focus:outline-none font-['Poppins']"
              />

              <input
                type="text"
                name="socialLinks"
                value={formData.socialLinks}
                onChange={handleInputChange}
                placeholder="your social link (x.com)"
                className="w-full px-6 py-4 bg-[#1A1A1A] text-white placeholder-white/40 rounded-2xl border border-[#FFD700]/20 focus:border-[#FFD700] focus:outline-none font-['Poppins']"
              />

              <select
                name="networkId"
                value={formData.networkId}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-[#1A1A1A] text-white/60 rounded-full border border-[#FFD700]/20 focus:border-[#FFD700] focus:outline-none font-['Poppins'] appearance-none"
              >
                <option value="84532">select network</option>
                <option value="84532">Base Sepolia</option>
              </select>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="royalty"
                    checked={acceptRoyalty}
                    onChange={(e) => setAcceptRoyalty(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    acceptRoyalty 
                      ? 'border-[#FFD700] bg-[#FFD700]' 
                      : 'border-[#FFD700]/20 bg-transparent'
                  }`}>
                    {acceptRoyalty && (
                      <div className="w-3 h-3 rounded-full bg-[#121212]" />
                    )}
                  </div>
                </div>
                <label htmlFor="royalty" className="text-white/60 font-['Poppins']">
                  I confirm that I accept the 3% royalty fee.
                </label>
              </div>

              <button
                onClick={authenticated ? handleNext : login}
                disabled={!acceptRoyalty || !imageFile || !formData.title}
                className={`w-full px-6 py-4 rounded-full font-['Poppins'] font-medium transition-all ${
                  !acceptRoyalty || !imageFile || !formData.title
                    ? 'bg-[#1A1A1A]/50 text-white/60'
                    : 'bg-[#FFD700] text-[#121212] hover:bg-[#FFD700]/90'
                }`}
              >
                {authenticated ? 'next: submit meme →' : 'connect wallet to continue →'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-16">
            {!authenticated ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Poppins']">Connect Your Wallet</h2>
                <p className="text-white/60 mb-8 font-['Poppins'] max-w-sm">
                  Connect your wallet to submit your meme to the blockchain
                </p>
                <button
                  onClick={login}
                  className="px-8 py-4 bg-[#FFD700] text-[#121212] rounded-full font-['Poppins'] font-medium hover:bg-[#FFD700]/90 transition-all"
                >
                  connect wallet
                </button>
              </div>
            ) : submissionSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 mb-6">
                  <svg className="w-full h-full text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Meme Submitted Successfully!</h2>
                <p className="text-white/60 mb-8 font-['Poppins'] max-w-sm">
                  Your meme has been successfully submitted to the blockchain.
                </p>
                <div className="flex gap-4">
                  <Link
                    to="/explore"
                    className="px-8 py-4 bg-[#FFD700] text-[#121212] rounded-full font-['Poppins'] font-medium hover:bg-[#FFD700]/90 transition-all"
                  >
                    discover memes →
                  </Link>
                  <Link
                    to="/"
                    className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-['Poppins'] font-medium hover:bg-[#1A1A1A]/80 transition-all"
                  >
                    back to home
                  </Link>
                </div>
              </div>
            ) : isUploading ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6">
                  <svg className="animate-spin w-full h-full text-[#FFD700]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Submitting Your Meme</h2>
                <p className="text-white/60 mb-8 font-['Poppins'] max-w-sm">
                  Please wait while we submit your meme to the blockchain...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Ready to Submit</h2>
                <p className="text-white/60 mb-8 font-['Poppins'] max-w-sm">
                  Your meme is ready to be submitted to the blockchain
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handlePrevious}
                    className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-['Poppins'] font-medium hover:bg-[#1A1A1A]/80 transition-all"
                  >
                    ← previous
                  </button>
                  <button
                    onClick={submitMeme}
                    className="px-8 py-4 bg-[#FFD700] text-[#121212] rounded-full font-['Poppins'] font-medium hover:bg-[#FFD700]/90 transition-all"
                  >
                    submit meme
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 mb-6">
              <svg className="w-full h-full text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 font-['Poppins']">AI Marketing Coming Soon</h2>
            <p className="text-white/60 mb-8 font-['Poppins'] max-w-sm">
              We're working on something magical to help promote your memes with AI. Stay tuned!
            </p>
            <button
              onClick={handlePrevious}
              className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-['Poppins'] font-medium hover:bg-[#1A1A1A]/80 transition-all"
            >
              ← back to submission
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateMeme; 