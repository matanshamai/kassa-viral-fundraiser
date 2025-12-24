import type { Summary } from '../../types';
import { formatNumber } from '../../utils/formatters';
import UserIcon from '../icons/UserIcon';
import MoneyIcon from '../icons/MoneyIcon';

type ImpactSummaryProps = {
  summary: Summary;
};

function ImpactSummary({ summary }: ImpactSummaryProps) {
  const totalPeople =
    summary.levels.length > 0
      ? summary.levels.reduce((sum, level) => sum + level.userCount, 0)
      : 0;

  const totalAmount =
    summary.levels.length > 0
      ? summary.levels.reduce((sum, level) => sum + level.total, 0)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 grow">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Your Impact</h2>
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

        {summary.levels.length > 0 && (
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
        )}
      </div>
    </div>
  );
}

export default ImpactSummary;
