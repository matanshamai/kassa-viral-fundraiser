import { useState } from 'react';
import CollapsibleCard from '../common/CollapsibleCard';
import CheckCircleIcon from '../icons/CheckCircleIcon';

type ReferralShareProps = {
  userId: number;
};

function ReferralShare({ userId }: ReferralShareProps) {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const referralLink = `${window.location.origin}?ref=${userId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <CollapsibleCard
      title="Share Your Link"
      iconColor="text-blue-600"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
    >
      <div className="space-y-3">
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg px-3 py-2">
          <div className="text-xs font-medium text-gray-600 tracking-wide mb-1">
            Referral Code
          </div>
          <div className="text-lg font-mono font-bold text-gray-900">
            {userId}
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>Copy Link</span>
        </button>

        {showCopySuccess && (
          <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="font-medium">Copied!</span>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}

export default ReferralShare;
