export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright & Credits */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} Roam Theme Editor. MIT License.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Made with love for the Roam community
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/2b3pro/roam-theme-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="View on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Ko-fi */}
            <a
              href="https://ko-fi.com/2b3pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#ff5f5f] hover:bg-[#e54e4e] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
              </svg>
              Support
            </a>

            {/* PayPal */}
            <a
              href="https://paypal.me/2b3/5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#00457C] hover:bg-[#003660] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.641h6.535c2.169 0 3.91.56 5.03 1.617.5.473.87 1.031 1.092 1.655.237.667.317 1.446.232 2.314-.054.53-.156 1.085-.307 1.651-.583 2.215-1.891 3.837-3.722 4.633-1.137.494-2.42.73-3.86.73h-.944a.95.95 0 0 0-.938.802l-.87 5.517a.642.642 0 0 1-.633.54h-.24zm13.295-15.62a.084.084 0 0 0-.026.007c-.093.042-.186.09-.281.14a5.93 5.93 0 0 1-.475.215 7.86 7.86 0 0 1-.731.253c-.282.082-.585.152-.907.209a7.8 7.8 0 0 1-1.233.096h-4.234a.641.641 0 0 0-.633.535l-.86 5.455-.024.153-.804 5.097h3.186c.212 0 .398-.152.432-.372l.018-.1.343-2.178.022-.121a.442.442 0 0 1 .434-.374h.273c1.769 0 3.154-.719 3.561-2.799.17-.869.082-1.593-.368-2.104a1.764 1.764 0 0 0-.506-.407c.253-.773.251-1.39-.188-1.705z"/>
              </svg>
              Donate
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
