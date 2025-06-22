import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Slot {
  slot_id: string;
  start_time: string;
  end_time: string;
}

interface BookingFormProps {
  venue: any;
  venueId: string;
  onSubmit: (formData: any) => void;
  loading: boolean;
  error: string | null;
  onDecorationChange?: (hasDecoration: boolean) => void;
}

const BookingForm = ({ venue, venueId, onSubmit, loading, error, onDecorationChange }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [formData, setFormData] = useState({
    bookingName: '',
    persons: '1',
    whatsapp: '',
    email: '',
    decoration: false,
    slotId: '',
  });

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !venueId) return;

      try {
        setSlotsLoading(true);

        const { data: allSlots, error: slotsError } = await supabase
          .from('slots')
          .select('id, start_time, end_time')
          .eq('venue_id', venueId)
          .order('start_time');

        if (slotsError) throw slotsError;

        const { data: bookedSlots, error: bookingsError } = await supabase
          .from('bookings')
          .select('slot_id')
          .eq('venue_id', venueId)
          .eq('booking_date', selectedDate)
          .eq('advance_paid', true);

        if (bookingsError) throw bookingsError;

        const bookedSlotIds = new Set(bookedSlots?.map((b) => b.slot_id) || []);
        const availableSlots =
          allSlots
            ?.map((slot) => ({
              slot_id: slot.id,
              start_time: formatTime(slot.start_time),
              end_time: formatTime(slot.end_time),
            }))
            .filter((slot) => !bookedSlotIds.has(slot.slot_id)) || [];

        setSlots(availableSlots);

        if (availableSlots.length > 0) {
          if (
            !availableSlots.find((slot) => slot.slot_id === formData.slotId)
          ) {
            setFormData((prev) => ({
              ...prev,
              slotId: availableSlots[0].slot_id,
            }));
          }
        } else {
          setFormData((prev) => ({ ...prev, slotId: '' }));
        }
      } catch (err: any) {
        console.error('Error fetching slots:', err);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, venueId]);

  useEffect(() => {
    if (onDecorationChange) {
      onDecorationChange(formData.decoration);
    }
  }, [formData.decoration, onDecorationChange]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, selectedDate });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-4 md:p-6">
      <h2 className="text-xl font-bold text-white mb-6">Booking Details</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Booking Date*
          </label>
          <input
            type="date"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Select booking date"
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Available Slots*
            </label>
            {slotsLoading ? (
              <div className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-gray-400">
                Loading slots...
              </div>
            ) : (
              <select
                required
                value={formData.slotId}
                onChange={(e) =>
                  setFormData({ ...formData, slotId: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label="Select time slot"
              >
                <option value="">Select a slot</option>
                {slots.map((slot) => (
                  <option key={slot.slot_id} value={slot.slot_id}>
                    {slot.start_time} - {slot.end_time}
                  </option>
                ))}
              </select>
            )}
            {slots.length === 0 && !slotsLoading && selectedDate && (
              <p className="text-red-400 text-sm mt-1">
                No slots available for this date. Please select another date.
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Booking Name*
          </label>
          <input
            type="text"
            required
            value={formData.bookingName}
            onChange={(e) =>
              setFormData({
                ...formData,
                bookingName: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter booking name"
            aria-label="Enter booking name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Persons*
          </label>
          <select
            required
            value={formData.persons}
            onChange={(e) =>
              setFormData({ ...formData, persons: e.target.value })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Select number of persons"
          >
            {[...Array(venue.base_members)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Person{i !== 0 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            WhatsApp Number*
          </label>
          <input
            type="tel"
            required
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData({ ...formData, whatsapp: e.target.value })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter WhatsApp number"
            aria-label="Enter WhatsApp number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email ID*
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter email address"
            aria-label="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Do you want decoration?*
          </label>
          <select
            required
            value={formData.decoration ? 'yes' : 'no'}
            onChange={(e) =>
              setFormData({
                ...formData,
                decoration: e.target.value === 'yes',
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Select decoration option"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.slotId}
        className={`w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-colors duration-300 font-bold mt-6 ${
          loading || !formData.slotId
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        aria-label="Proceed with booking"
      >
        {loading ? 'Processing...' : 'PROCEED'}
      </button>

      {error && (
        <p className="mt-4 text-red-500 text-center" role="alert">{error}</p>
      )}
    </form>
  );
};

export default BookingForm;