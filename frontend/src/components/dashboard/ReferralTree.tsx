import { useState } from 'react';
import type { Summary } from '../../types';
import { formatNumber } from '../../utils/formatters';
import UserIcon from '../icons/UserIcon';
import MoneyIcon from '../icons/MoneyIcon';
import ChevronIcon from '../icons/ChevronIcon';

type ReferralTreeProps = {
  levels: Summary['levels'];
};

function ReferralTree({ levels }: ReferralTreeProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set());

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

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col min-h-0">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Your Referral Tree, Visualized
      </h2>

      {levels.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-2">
          {levels.map((level) => {
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
                    <ChevronIcon
                      className="w-5 h-5 text-gray-600"
                      isExpanded={isExpanded}
                    />

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
            <p className="text-gray-600 font-medium mb-1">No referrals yet</p>
            <p className="text-sm text-gray-500">
              Share your referral code to start building your network!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferralTree;
