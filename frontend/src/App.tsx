import { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

type User = { id: number; username: string; referrerId: number | null };
type Summary = {
  userId: number;
  userTotal: number;
  levels: { level: number; userCount: number; total: number }[];
};

function formatNumber(num: number, isMoney: boolean = false): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: isMoney ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const referrerId = params.get('ref');

    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, referrerId }),
    });
    const user = await res.json();
    onLogin(user);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Username"
          className="border p-2 w-full mb-4 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}

function UserIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function MoneyIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function Dashboard({ user }: { user: User }) {
  const [amount, setAmount] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set());
  const [isDonationExpanded, setIsDonationExpanded] = useState(true);
  const [isReferralExpanded, setIsReferralExpanded] = useState(true);

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  };

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch(`${API}/summary/${user.id}`);
      setSummary(await res.json());
    };
    fetchSummary();
  }, [user.id]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, amount }),
    });
    const data = await res.json();
    setAmount('');

    // Update summary in frontend instead of refetching
    if (summary && data.amount) {
      setSummary({
        ...summary,
        userTotal: summary.userTotal + parseFloat(data.amount),
      });
    }
  };

  const referralLink = `${window.location.origin}?ref=${user.id}`;

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
    <div className="h-screen bg-gray-100 p-6 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 flex-shrink-0">
          Welcome, {user.username}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {/* Left Column - Donation and Referral */}
          <div className="lg:col-span-1 flex flex-col gap-3 min-h-0">
            {/* Donation Box */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setIsDonationExpanded(!isDonationExpanded)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-4 h-4 text-emerald-600 transition-transform ${
                      isDonationExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <h2 className="text-base font-semibold text-gray-900">
                    Make a Donation
                  </h2>
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isDonationExpanded
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-3 border-t border-gray-200">
                  <form onSubmit={handleDonate} className="space-y-3">
                    <div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          <MoneyIcon className="w-5 h-5 text-emerald-600" />
                        </span>
                        <input
                          id="donation-amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Amount"
                          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg pl-8 pr-4 py-2 text-base font-semibold transition-colors outline-none"
                          required
                          min="1"
                          step="any"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                      Donate Now
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Referral Code Box */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setIsReferralExpanded(!isReferralExpanded)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-4 h-4 text-blue-600 transition-transform ${
                      isReferralExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <h2 className="text-base font-semibold text-gray-900">
                    Share Your Link
                  </h2>
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isReferralExpanded
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-3 border-t border-gray-200 space-y-3">
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg px-3 py-2">
                    <div className="text-xs font-medium text-gray-600 tracking-wide mb-1">
                      Referral Code
                    </div>
                    <div className="text-lg font-mono font-bold text-gray-900">
                      {user.id}
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
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Copied!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Totals Card */}
            {summary && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 grow">
                <div className="p-3 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-900">
                    Your Impact
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="text-xs font-medium text-emerald-600 tracking-wide mb-2">
                      Your Total Donations
                    </div>
                    <div className="flex items-center gap-2">
                      <MoneyIcon className="w-5 h-5 text-emerald-600" />
                      <div className="text-2xl font-bold text-emerald-600">
                        {formatNumber(summary.userTotal, true)}
                      </div>
                    </div>
                  </div>

                  {summary.levels.length > 0 &&
                    (() => {
                      const totalPeople = summary.levels.reduce(
                        (sum, level) => sum + level.userCount,
                        0
                      );
                      const totalAmount = summary.levels.reduce(
                        (sum, level) => sum + level.total,
                        0
                      );
                      return (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs font-medium text-blue-600 tracking-wide mb-2">
                                People Referred
                              </div>
                              <div className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                <div className="text-xl font-bold text-blue-600">
                                  {formatNumber(totalPeople)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-emerald-600 tracking-wide mb-2">
                                Their Donations
                              </div>
                              <div className="flex items-center gap-2">
                                <MoneyIcon className="w-5 h-5 text-emerald-600" />
                                <div className="text-xl font-bold text-emerald-600 truncate">
                                  {formatNumber(totalAmount, true)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Referral Levels */}
          <div className="lg:col-span-3 min-h-0">
            {summary && (
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col min-h-0">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Your Referral Tree, Visualized
                </h2>

                {summary.levels.length > 0 ? (
                  <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-2">
                    {summary.levels.map((level) => {
                      const isExpanded = expandedLevels.has(level.level);

                      return (
                        <div
                          key={level.level}
                          className="rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md flex-shrink-0"
                        >
                          <button
                            onClick={() => toggleLevel(level.level)}
                            className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <svg
                                className={`w-5 h-5 text-gray-600 transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>

                              <h3 className="text-base font-semibold text-gray-900">
                                Level {level.level}
                                {level.level === 1 && (
                                  <span className="text-sm text-gray-600 ml-2">
                                    (Direct Referrals)
                                  </span>
                                )}
                              </h3>
                            </div>

                            <div className="flex items-center gap-3">
                              <div
                                className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md min-w-[120px]"
                                title="People Referred"
                              >
                                <UserIcon className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-600">
                                  {formatNumber(level.userCount)}
                                </span>
                              </div>

                              <div
                                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md min-w-[120px]"
                                title="Total Donations"
                              >
                                <MoneyIcon className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold text-emerald-600">
                                  {formatNumber(level.total, true)}
                                </span>
                              </div>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="border-t border-gray-200">
                              <div className="px-4 pb-4 pt-2 bg-gray-50">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium text-blue-600 tracking-wide mb-2">
                                      People Referred
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <UserIcon className="w-5 h-5 text-blue-600" />
                                      <div className="text-2xl font-bold text-blue-600">
                                        {formatNumber(level.userCount)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium text-emerald-600 tracking-wide mb-2">
                                      Total Donations
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <MoneyIcon className="w-5 h-5 text-emerald-600" />
                                      <div className="text-2xl font-bold text-emerald-600">
                                        {formatNumber(level.total, true)}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {level.userCount > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="text-xs text-gray-600 flex items-center gap-1">
                                      Average per person:{' '}
                                      <MoneyIcon className="w-3 h-3 text-gray-600" />
                                      <span className="font-semibold text-gray-900">
                                        {formatNumber(
                                          level.total / level.userCount,
                                          true
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium mb-1">
                        No referrals yet
                      </p>
                      <p className="text-sm text-gray-500">
                        Share your referral code to start building your network!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return user ? <Dashboard user={user} /> : <Login onLogin={setUser} />;
}

export default App;
