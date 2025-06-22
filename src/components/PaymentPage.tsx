import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [venueId, setVenueId] = useState<string>('');
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initVenue = async () => {
      try {
        const urlVenueId = searchParams.get('venue');
        if (!urlVenueId) {
          setError('No venue selected');
          return;
        }

        setVenueId(urlVenueId);
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('id', urlVenueId)
          .maybeSingle();

        if (venueError) {
          console.error('Error fetching venue:', venueError);
          setError('Error loading venue details');
          return;
        }

        if (!venueData) {
          setError('Venue not found');
          return;
        }

        setVenue(venueData);
        setError(null);
      } catch (err) {
        console.error('Error in venue initialization:', err);
        setError('Failed to load venue details');
      }
    };

    initVenue();
  }, [searchParams]);

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          venue_id: venueId,
          slot_id: formData.slotId,
          booking_date: formData.selectedDate,
          booking_name: formData.bookingName,
          persons: parseInt(formData.persons),
          whatsapp: formData.whatsapp,
          email: formData.email,
          decoration: formData.decoration,
          advance_paid: false,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      const basePrice = venue.price;
      const decorationFee = formData.decoration ? venue.decoration_fee : 0;
      const advanceAmount = 700;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: advanceAmount * 100,
        currency: 'INR',
        name: "Binge'N Celebration",
        description: `Booking for ${venue.name}`,
        image: '/BINGEN.png',
        order_id: booking.id,
        handler: async (response: any) => {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              advance_paid: true,
              payment_id: response.razorpay_payment_id,
            })
            .eq('id', booking.id);

          if (updateError) throw updateError;
          navigate('/booking-success');
        },
        prefill: {
          name: formData.bookingName,
          email: formData.email,
          contact: formData.whatsapp,
        },
        theme: {
          color: '#DB2777',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error('Error in booking process:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {error || 'Loading venue details...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <img
              src="/BINGEN.png"
              alt="Binge'N Celebration Logo"
              className="h-10 md:h-12 w-10 md:w-12"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Complete Your Booking
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <BookingForm
                venue={venue}
                venueId={venueId}
                onSubmit={handleFormSubmit}
                loading={loading}
                error={error}
              />
            </div>

            <div className="lg:col-span-1">
              <BookingSummary venue={venue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;