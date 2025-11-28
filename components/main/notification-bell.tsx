"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markRead } from "@/actions/notifications";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const fetchNotes = async () => {
            const data = await getNotifications();          
            setNotifications(data);
        };

        fetchNotes();

        // Run every 5 seconds
        const interval = setInterval(fetchNotes, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleRead = async (id: string) => {
        await markRead(id);
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-900 transition"
            >
                <Bell className="h-5 w-5" />
                
                {/* Red Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b text-xs font-semibold text-gray-500">
                        Notifications
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-400">
                                No notifications
                            </div>
                        )}

                        {notifications.map((n) => (
                            <div 
                                key={n.id} 
                                onClick={() => handleRead(n.id)}
                                className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 transition ${!n.isRead ? 'bg-blue-50' : ''}`}
                            >
                                <p className="text-gray-800">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    {new Date(n.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}