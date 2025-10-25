import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Concert Management",
  description: "Admin dashboard for concert management",
};

export default function AdminPage() {
  const concerts = [
    {
      id: 1,
      name: "Concert Name 1",
      description: "Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque.",
      seats: 500,
    },
    {
      id: 2,
      name: "Concert Name 2", 
      description: "Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a.",
      seats: 200,
    }
  ];

  const stats = {
    totalSeats: 500,
    reserved: 120,
    cancelled: 12
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Admin - Home</h1>
      </div>

 
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">Total of seats</p>
            <p className="text-4xl font-bold">{stats.totalSeats}</p>
          </div>

          <div className="bg-green-500 rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">Reserve</p>
            <p className="text-4xl font-bold">{stats.reserved}</p>
          </div>

          <div className="bg-red-500 rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">Cancel</p>
            <p className="text-4xl font-bold">{stats.cancelled}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
                Overview
              </button>
              <button className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">
                Create
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {concerts.map((concert) => (
                <div key={concert.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium text-blue-600 mb-3">
                      {concert.name}
                    </h3>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {concert.description}
                  </p>
                  
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                    <span className="font-medium">{concert.seats}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}