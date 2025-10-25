'use client';
import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { useEffect } from "react";

export default function AdminPage() {
    const [form, setForm] = useState<{ concertName: string; description: string; seats: number }>({
        concertName: "",
        description: "",
        seats: 0,
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "seats" ? Number(value) : value,
        }));
    };

    const resetForm = () =>
        setForm({
            concertName: "",
            description: "",
            seats: 0,
        });
    const [concerts, setConcerts] = useState<Array<{ id: number; concertName: string; description: string; seat: number, seatReserve: number }>>([]);
    const [activeTab, setActiveTab] = useState("overview");
    // const stats = {
    //     totalSeats: 500,
    //     reserved: 120,
    //     cancelled: 12
    // };

    const [stats, setStats] = useState<{ totalSeats: number; reserved: number; cancelled: number }>({
        totalSeats: 0,
        reserved: 0,
        cancelled: 0
    });

    const switchTab = (tab: string) => {
        setActiveTab(tab);
    }
    const handleCreateConcert = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(API_ENDPOINTS.concerts.base + '/create', {
                concert_name: form.concertName,
                seat: form.seats,
                description: form.description
            });
            alert('Concert created successfully!');
            fecthAllConcerts();
            resetForm();
        } catch (error) {
            console.error('Error creating concert:', error);
            alert('Failed to create concert');
        }
    }

    const fecthAllConcerts = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.concerts.base);
            console.log('Fetched concerts:', response.data);
            setConcerts(response.data);

            const dashboardResponse = await axios.get(API_ENDPOINTS.concerts.base + '/dashboard');
            console.log('Dashboard data:', dashboardResponse.data);
            setStats({
                totalSeats: dashboardResponse.data.totalSeat,
                reserved: dashboardResponse.data.totalSeatReserve,
                cancelled: dashboardResponse.data.totalSeatCancel
            });
        } catch (error) {
            console.error('Error fetching concerts:', error);
        }


    }


    useEffect(() => {
        fecthAllConcerts();
    }, []);

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
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
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
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
                            <button
                                className={`px-6 py-3 font-medium transition-colors ${activeTab === "overview"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => switchTab("overview")} >
                                Overview
                            </button>
                            <button
                                className={`px-6 py-3 font-medium transition-colors ${activeTab === "create"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => switchTab("create")}
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === "overview" && concerts.length > 0 && <div className="space-y-6">
                            {concerts.map((concert) => (
                                <div key={concert.id} className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-medium text-blue-600 mb-3">
                                            {concert.concertName}
                                        </h3>
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>

                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {concert.description}
                                    </p>

                                    <div className="flex items-center text-gray-500">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                        </svg>
                                        <span className="font-medium">{concert.seat}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 3a1 1 0 000 2h1.22l.305 1.222M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-11 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="font-medium">{concert.seatReserve}</span>
                                    </div>
                                </div>
                            ))}
                        </div>}
                        {
                            activeTab === "overview" && concerts.length == 0 && <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">
                                    No concerts available
                                </p>
                            </div>
                        }

                        {activeTab === "create" && (
                            <div className="max-w-4xl">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Concert</h3>

                                <form className="space-y-6" onSubmit={handleCreateConcert}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="concertName" className="block text-sm font-medium text-gray-700 mb-2">
                                                Concert Name
                                            </label>
                                            <input
                                                type="text"
                                                id="concertName"
                                                name="concertName"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                                placeholder="Please input concert name"
                                                value={form.concertName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                                                Total of seat
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    id="seats"
                                                    name="seats"
                                                    min="1"
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                                    placeholder="500"
                                                    value={form.seats}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
                                            placeholder="Please input description"
                                            value={form.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">

                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                            </svg>
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}