import React from 'react';
import { IndianRupee } from 'lucide-react';

interface BookingSummaryProps {
  venue: any;
  decorationFee?: number;
}

const BookingSummary = ({ venue, decorationFee = 0 }: BookingSummaryProps) => {
  const basePrice = venue.price;
  const totalDecorationFee = decorationFee;
  const advanceAmount = 700;
  const balanceAmount = basePrice + totalDecorationFee - advanceAmount;

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6 sticky top-6">
      <h2 className="text-xl font-bold text-white mb-6">Booking Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Base Price</span>
          <span className="text-white font-medium flex items-center">
            <IndianRupee className="h-4 w-4" />
            {basePrice}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Decoration</span>
          <span className="text-white font-medium flex items-center">
            <IndianRupee className="h-4 w-4" />
            {totalDecorationFee}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Advance Amount Payable</span>
          <div className="text-right">
            <span className="text-white font-medium flex items-center justify-end">
              <IndianRupee className="h-4 w-4" />
              {advanceAmount}
            </span>
            <p className="text-xs text-gray-400">
              (Including ₹50/- convenience fee)
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-300">Balance Amount</span>
          <div className="text-right">
            <span className="text-white font-medium flex items-center justify-end">
              <IndianRupee className="h-4 w-4" />
              {balanceAmount}
            </span>
            <p className="text-xs text-gray-400">
              (Final amount negotiable — to be paid at venue)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;