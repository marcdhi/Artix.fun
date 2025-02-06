import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

function CreateMeme() {
  const { login, ready, authenticated } = usePrivy();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    supply: '',
    network: ''
  });
  const [acceptRoyalty, setAcceptRoyalty] = useState(false);

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

  const handleNext = () => {
    if (!authenticated) {
      login();
    } else {
      setStep(2);
    }
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
            When your meme completes its bonding curve you receive XYZ
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
                          Upload Photo
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
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    rows={4}
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="relative">
                  <select
                    name="supply"
                    value={formData.supply}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-blue-600 appearance-none pr-10"
                  >
                    <option value="">Select supply</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    name="network"
                    value={formData.network}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-blue-600 appearance-none pr-10"
                  >
                    <option value="">Select network</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="polygon">Polygon</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
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
                className="mt-8 w-full py-3 bg-blue-600 text-white font-medium transition-colors"
              >
                {authenticated ? 'Next: AI Marketing' : 'Connect Wallet'}
              </button>
            </>
          )}

          {step === 2 && (
            <div className="py-12">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Marketing by Artifact</h2>
                <div className="max-w-md mx-auto space-y-4">
                  <input
                    type="text"
                    placeholder="Your twitter handle"
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                  <textarea
                    placeholder="Input??"
                    rows={4}
                    className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2 bg-[#F3F4F6] border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-blue-600 appearance-none pr-10"
                    >
                      <option value="">Input??</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-4 bg-[#F3F4F6]">
                    <span className="text-sm text-gray-600">Smart contract transaction confirmation required</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-between gap-4 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-blue-600 text-blue-600 font-medium"
                    >
                      Previous: Meme info
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 bg-blue-600 text-white font-medium"
                    >
                      Generate Meme NFT →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateMeme; 