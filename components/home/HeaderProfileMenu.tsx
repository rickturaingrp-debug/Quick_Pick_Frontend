"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { RiUserLine, RiLogoutBoxRLine, RiHeartLine } from "react-icons/ri";
import { useAuthContext } from "@/providers/AuthProvider";

interface HeaderProfileMenuProps {
    dark?: boolean;
}

export default function HeaderProfileMenu({ dark = false }: HeaderProfileMenuProps) {
    const { user, logout } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full p-2.5 transition active:scale-95 flex items-center justify-center cursor-pointer ${
                    dark 
                        ? isOpen ? "bg-white/35 shadow-inner" : "bg-white/20 hover:bg-white/30 text-white"
                        : isOpen ? "bg-purple-100 text-purple-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
            >
                <RiUserLine size={20} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-1 w-52 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 p-1.5 z-[9999] animate-fade-in origin-top-right transform scale-100 opacity-100 transition-all text-left font-sans"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="px-3.5 py-2.5 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-800 truncate">
                            {user?.name || "Guest User"}
                        </p>
                    </div>

                    <div className="py-1">

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                            }}
                            className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer mt-0.5"
                        >
                            <RiLogoutBoxRLine size={15} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
