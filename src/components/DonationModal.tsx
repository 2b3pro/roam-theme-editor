interface DonationModalProps {
  onClose: () => void;
  onContinue: () => void;
}

export function DonationModal({ onClose, onContinue }: DonationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Heart icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Enjoying Roam Theme Editor?
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This tool is free and open source. If it's saved you time or made your Roam experience better, consider supporting its development!
          </p>

          {/* Donation buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Ko-fi */}
            <a
              href="https://ko-fi.com/2b3pro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#ff5f5f] hover:bg-[#e54e4e] rounded-lg transition-colors"
              onClick={onClose}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
              </svg>
              Buy me a coffee
            </a>

            {/* PayPal */}
            <a
              href="https://paypal.me/2b3/5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#00457C] hover:bg-[#003660] rounded-lg transition-colors"
              onClick={onClose}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.641h6.535c2.169 0 3.91.56 5.03 1.617.5.473.87 1.031 1.092 1.655.237.667.317 1.446.232 2.314-.054.53-.156 1.085-.307 1.651-.583 2.215-1.891 3.837-3.722 4.633-1.137.494-2.42.73-3.86.73h-.944a.95.95 0 0 0-.938.802l-.87 5.517a.642.642 0 0 1-.633.54h-.24zm13.295-15.62a.084.084 0 0 0-.026.007c-.093.042-.186.09-.281.14a5.93 5.93 0 0 1-.475.215 7.86 7.86 0 0 1-.731.253c-.282.082-.585.152-.907.209a7.8 7.8 0 0 1-1.233.096h-4.234a.641.641 0 0 0-.633.535l-.86 5.455-.024.153-.804 5.097h3.186c.212 0 .398-.152.432-.372l.018-.1.343-2.178.022-.121a.442.442 0 0 1 .434-.374h.273c1.769 0 3.154-.719 3.561-2.799.17-.869.082-1.593-.368-2.104a1.764 1.764 0 0 0-.506-.407c.253-.773.251-1.39-.188-1.705z"/>
              </svg>
              Donate via PayPal
            </a>
          </div>

          {/* Continue without donating */}
          <button
            onClick={onContinue}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors underline"
          >
            Continue without donating
          </button>
        </div>
      </div>
    </div>
  );
}
