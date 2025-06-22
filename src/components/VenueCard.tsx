import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle,
  Monitor,
  IndianRupee,
  Sparkles,
} from 'lucide-react';

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    image: string;
    price: number;
    baseMembers: number;
    screenSize: string;
    decorationFee: number;
    slots: string[];
    features: string[];
    refundPolicy: string;
  };
}

const VenueCard = ({ venue }: VenueCardProps) => {
  const navigate = useNavigate();

  const handleBookNow = (venueId: string) => {
    navigate(`/payment?venue=${venueId}`);
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-500">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={venue.image}
          alt={`${venue.name} - Premium private theater venue`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-60"></div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {venue.name}
          </h3>
          <span className="px-3 md:px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full flex items-center gap-2 text-sm md:text-base">
            <IndianRupee className="h-4 w-4" />
            <span>{venue.price}</span>
          </span>
        </div>

        <div className="space-y-3 md:space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
            <Users className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
            <span>Up to {venue.baseMembers} members</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
            <Monitor className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
            <span>{venue.screenSize}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
            <Sparkles className="h-4 md:h-5 w-4 md:w-5 text-pink-500 flex-shrink-0" />
            <span>Decoration fee: {venue.decorationFee}</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
            <Clock className="h-4 md:h-5 w-4 md:w-5 text-pink-500" />
            Available Slots
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {venue.slots.map((slot, index) => (
              <div
                key={index}
                className="text-gray-300 text-xs md:text-sm flex items-center gap-2 bg-gray-700/30 rounded-lg p-2"
              >
                <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                {slot}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 md:h-5 w-4 md:w-5 text-pink-500" />
            Features
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {venue.features.map((feature, index) => (
              <li
                key={index}
                className="text-gray-400 text-xs md:text-sm flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full flex-shrink-0"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => handleBookNow(venue.id)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-colors duration-300 font-bold text-sm md:text-base"
          aria-label={`Book ${venue.name} venue now`}
        >
          Book Now
        </button>

        <p className="text-gray-400 text-xs md:text-sm mt-4 text-center">
          {venue.refundPolicy}
        </p>
      </div>
    </div>
  );
};

export default VenueCard;