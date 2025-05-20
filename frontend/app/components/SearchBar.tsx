'use client';

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-1 py-1 pl-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
      />
      <svg
        className="absolute right-1 top-1 transform  h-1 w-1 text-gray-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 1500 1500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
} 