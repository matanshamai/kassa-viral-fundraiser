import { useState, useEffect } from 'react';
import type { User, Summary } from '../../types';
import { API } from '../../config/api';
import DonationForm from './DonationForm';
import ReferralShare from './ReferralShare';
import ImpactSummary from './ImpactSummary';
import ReferralTree from './ReferralTree';

function Dashboard({ user }: { user: User }) {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch(`${API}/summary/${user.id}`);
      setSummary(await res.json());
    };
    fetchSummary();
  }, [user.id]);

  const handleDonationSuccess = (amount: number) => {
    if (summary) {
      setSummary({
        ...summary,
        userTotal: summary.userTotal + amount,
      });
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
            <DonationForm
              userId={user.id}
              onDonationSuccess={handleDonationSuccess}
            />

            <ReferralShare userId={user.id} />

            {summary && <ImpactSummary summary={summary} />}
          </div>

          {/* Right Column - Referral Levels */}
          <div className="lg:col-span-3 min-h-0">
            {summary && <ReferralTree levels={summary.levels} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
