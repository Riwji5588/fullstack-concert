'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
    isOpen?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const currentState = pathname.startsWith('/admin') ? 'Admin' : 'User';
    const menuItemsAdmin = [
        {
            label: 'Home',
            href: '/admin',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            )
        },
        {
            label: 'History',
            href: '/admin/history',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            label: 'Switch to ' + (currentState === 'Admin' ? 'user' : 'admin'),
            href: currentState === 'Admin' ? '/user' : '/admin',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
            )
        }
    ];
    const menuItemsUser = [
        {
            label: 'Switch to ' + (currentState === 'Admin' ? 'user' : 'admin'),
            href: currentState === 'Admin' ? '/user' : '/admin',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative lg:translate-x-0 
                w-64 bg-gray-100 border-r border-gray-200 min-h-screen z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Mobile Close Button */}
                <div className="lg:hidden absolute top-4 right-4">
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">{currentState}</h2>
                </div>

            {/* Navigation */}
            <nav className="mt-6">
                <div className="px-3">
                    {currentState === 'Admin' && menuItemsAdmin.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-3 mb-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}

                    {currentState === 'User' && menuItemsUser.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-3 mb-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="absolute bottom-6 left-3 right-3">


                <Link
                    href="/logout"
                    className="flex items-center px-3 py-3 mt-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-2 0V4H5v12h10v-2a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M11 5a1 1 0 011 1v8a1 1 0 11-2 0V8.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 7 6.293 4.707a1 1 0 011.414-1.414L10 5.586V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Logout
                </Link>
            </div>
        </div>
        </>
    );
}