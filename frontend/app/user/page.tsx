'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import Swal from "sweetalert2";


interface Concert {
  id: number;
  concertName: string;
  description: string;
  seat: number;
  seatReserve: number;
}

export default function UserPage() {
  const router = useRouter();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fecthAllConcerts();
  }, []);

  const fecthAllConcerts = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.concerts.base);
      setConcerts(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load concerts',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (concertId: number, typeSubmit: string) => {
    if (typeSubmit === 'reserve') {

      const result = await Swal.fire({
        title: 'Confirm Reservation',
        text: 'Are you sure you want to reserve a seat?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, reserve it!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: "#29b10eff",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;

      try {
        const response = await axios.post(API_ENDPOINTS.user.submitEventConcert(concertId, 'reserve'));
        if (response.data.status !== 'success') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Successfully reserved a seat!',
          });
        }
        fecthAllConcerts(); // Reload concerts
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'เกิดข้อผิดพลาดในการจองที่นั่ง',
        });
      }
    } else if (typeSubmit === 'cancel') {
      try {
        const response = await axios.post(API_ENDPOINTS.user.submitEventConcert(concertId, 'cancel'));
        if (response.data.status !== 'success') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Successfully cancelled a seat!',
          });
        }
        fecthAllConcerts();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'เกิดข้อผิดพลาดในการยกเลิกที่นั่ง',
        });
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">


      {/* Content */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">loading...</p>
          </div>
        ) : concerts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-gray-600 text-lg"> No concerts available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {concerts.map((concert) => {
              const availableSeats = (concert.seat || 0) - (concert.seatReserve || 0);
              const hasAvailableSeats = availableSeats > 0;
              const hasReservedSeats = (concert.seatReserve || 0) > 0;

              return (
                <div key={concert.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-medium text-blue-600 mb-3">
                    {concert.concertName}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {concert.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="font-medium">{availableSeats}</span>
                    </div>

                    <div className="flex gap-3">
                      {hasReservedSeats && (
                        <button
                          onClick={() => handleSubmit(concert.id, 'cancel')}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => handleSubmit(concert.id, 'reserve')}
                        disabled={!hasAvailableSeats}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${hasAvailableSeats
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}