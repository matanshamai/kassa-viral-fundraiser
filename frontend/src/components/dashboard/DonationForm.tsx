import { useState } from 'react';
import { API } from '../../config/api';
import CollapsibleCard from '../common/CollapsibleCard';
import MoneyIcon from '../icons/MoneyIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XCircleIcon from '../icons/XCircleIcon';
import { formatNumber } from '../../utils/formatters';

type DonationFormProps = {
  userId: number;
  onDonationSuccess: (amount: number) => void;
};

function DonationForm({ userId, onDonationSuccess }: DonationFormProps) {
  const [amount, setAmount] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState('');

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });

      if (!res.ok) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      const data = await res.json();
      const formattedAmount = formatNumber(parseFloat(data.amount), true);
      setDonatedAmount(formattedAmount);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setAmount('');

      if (data.amount) {
        onDonationSuccess(parseFloat(data.amount));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <CollapsibleCard
      title="Make a Donation"
      iconColor="text-emerald-600"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
    >
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

        {showSuccess && (
          <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="font-medium">
              Thank you! We received your donation of ${donatedAmount}
            </span>
          </div>
        )}

        {showError && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
            <XCircleIcon className="w-4 h-4" />
            <span className="font-medium">
              Sorry, something went wrong! Maybe try again?
            </span>
          </div>
        )}
      </form>
    </CollapsibleCard>
  );
}

export default DonationForm;
