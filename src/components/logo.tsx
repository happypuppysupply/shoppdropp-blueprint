export function ShoppDroppLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shopping bag body */}
      <rect x="6" y="12" width="28" height="24" rx="4" fill="url(#bagGradient)" />
      
      {/* Shopping bag handle */}
      <path d="M14 12V8C14 5.79086 15.7909 4 18 4H22C24.2091 4 26 5.79086 26 8V12" stroke="url(#bagGradient)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Smile */}
      <path d="M14 26C14 26 17 29 20 29C23 29 26 26 26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Eyes */}
      <circle cx="15" cy="22" r="2" fill="white" />
      <circle cx="25" cy="22" r="2" fill="white" />
      
      {/* Speed lines */}
      <path d="M2 20L6 20" stroke="url(#speedGradient)" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 26L8 26" stroke="url(#speedGradient)" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 20L34 20" stroke="url(#speedGradient)" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 26L32 26" stroke="url(#speedGradient)" strokeWidth="2" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="bagGradient" x1="6" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="speedGradient" x1="2" y1="20" x2="8" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ShoppDroppLogoSmall({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="12" width="28" height="24" rx="4" fill="url(#bagGradientSmall)" />
      <path d="M14 12V8C14 5.79086 15.7909 4 18 4H22C24.2091 4 26 5.79086 26 8V12" stroke="url(#bagGradientSmall)" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 26C14 26 17 29 20 29C23 29 26 26 26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="15" cy="22" r="2" fill="white" />
      <circle cx="25" cy="22" r="2" fill="white" />
      <path d="M2 20L6 20" stroke="url(#speedGradientSmall)" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 20L34 20" stroke="url(#speedGradientSmall)" strokeWidth="2" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="bagGradientSmall" x1="6" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="speedGradientSmall" x1="2" y1="20" x2="8" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ShoppDroppText({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-white">SHOPP</span>
      <span className="bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">DROPP</span>
    </span>
  );
}
