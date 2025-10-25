'use client';
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
interface HistoryItem {
  id: number;
  concertId: number;
  userId: number;
  date: string;
  action: 'reserve' | 'cancel';
  concertevent: {
    id: number;
    concertName: string;
    description: string;
    seat: number;
    seatReserve: number;
    seatCancel: number;
  };
  user: {
    id: number;
    userName: string;
  };
}

export default function HistoryPage() {
  const [concertHistory, setConcertHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.concerts.history);
      setConcertHistory(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load concert history',
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    return action === 'reserve'
      ? 'text-green-600'
      : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">History</h1>
      </div>

      <div className="px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : concertHistory.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No history found</p>
              <p className="text-gray-500 mt-2">Concert reservations and cancellations will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concert name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {concertHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.user?.userName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.concertevent?.concertName || 'Unknown Concert'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getActionColor(item.action)} capitalize`}>
                        {item.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}