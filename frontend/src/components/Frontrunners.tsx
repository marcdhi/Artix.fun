function Frontrunners() {
  return (
    <section className="w-full py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-[32px] font-bold mb-2 text-gray-900">
          Best of MEME
        </h2>
        <p className="text-base text-gray-600">
          <span className="font-medium">Artix.fun</span>, A decentralized platform where memes gain value and their creators get rewarded.
        </p>
      </div>

      {/* Cards Container */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Card (2) */}
          <div className="relative mt-8">
            <div className="absolute -top-6 -left-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-medium z-10 bg-black text-white">
              2
            </div>
            <div className="bg-[#F3F4F6]">
              <div className="aspect-square bg-[#E5E7EB] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Title goes here</h3>
                <p className="text-sm text-gray-600 mt-1">The galaxy rules</p>
                <div className="mt-6">
                  <span className="text-sm text-gray-900">+9.6% progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Card (1) */}
          <div className="relative -mt-4">
            <div className="absolute -top-6 -left-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-medium z-10 bg-black text-white">
              1
            </div>
            <div className="bg-[#F3F4F6]">
              <div className="aspect-square bg-[#E5E7EB] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">The Celeons</h3>
                <p className="text-sm text-gray-600 mt-1">The galaxy rules</p>
                <div className="mt-6">
                  <span className="text-sm text-gray-900">+9.6% progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card (3) */}
          <div className="relative mt-8">
            <div className="absolute -top-6 -left-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-medium z-10 bg-black text-white">
              3
            </div>
            <div className="bg-[#F3F4F6]">
              <div className="aspect-square bg-[#E5E7EB] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Title goes here</h3>
                <p className="text-sm text-gray-600 mt-1">The galaxy rules</p>
                <div className="mt-6">
                  <span className="text-sm text-gray-900">+9.6% progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Frontrunners; 