import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History - Concert App",
  description: "View your concert history and past events",
};
export default function HistoryPage() {
  // Mock data for demonstration - replace with actual data fetching
  const concertHistory = [
    {
      id: 1,
      artist: "The Rolling Stones",
      venue: "Madison Square Garden",
      date: "2024-08-15",
      ticketPrice: 150,
      status: "Attended"
    },
    {
      id: 2,
      artist: "Taylor Swift",
      venue: "MetLife Stadium",
      date: "2024-07-22",
      ticketPrice: 200,
      status: "Attended"
    },
    {
      id: 3,
      artist: "Coldplay",
      venue: "Barclays Center",
      date: "2024-06-10",
      ticketPrice: 120,
      status: "Cancelled"
    },
    {
      id: 4,
      artist: "Ed Sheeran",
      venue: "Radio City Music Hall",
      date: "2024-05-18",
      ticketPrice: 90,
      status: "Attended"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Attended':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">History</h1>
      </div>
      
      <div className="px-6 py-8">
        {/* Stats Section */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Concerts
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {concertHistory.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Attended
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {concertHistory.filter(concert => concert.status === 'Attended').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Spent
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${concertHistory
                .filter(concert => concert.status === 'Attended')
                .reduce((total, concert) => total + concert.ticketPrice, 0)}
            </p>
          </div>
        </div>

        {/* Concert History List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Concerts
            </h2>
          </div>
          
          {concertHistory.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 text-lg">
                No concert history found
              </p>
              <p className="text-gray-500 mt-2">
                Your attended concerts will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {concertHistory.map((concert) => (
                <div key={concert.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {concert.artist}
                          </h3>
                          <p className="text-gray-600">
                            {concert.venue}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(concert.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${concert.ticketPrice}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(concert.status)}`}>
                          {concert.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}