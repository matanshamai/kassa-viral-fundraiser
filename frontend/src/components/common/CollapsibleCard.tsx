import { ReactNode } from 'react';
import ChevronIcon from '../icons/ChevronIcon';

type CollapsibleCardProps = {
  title: string;
  iconColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
};

function CollapsibleCard({
  title,
  iconColor,
  isExpanded,
  onToggle,
  children,
}: CollapsibleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronIcon
            className={`w-4 h-4 ${iconColor}`}
            isExpanded={isExpanded}
          />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-3 border-t border-gray-200">{children}</div>
      </div>
    </div>
  );
}

export default CollapsibleCard;
