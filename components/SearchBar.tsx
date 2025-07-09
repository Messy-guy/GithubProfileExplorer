'use client';

import { useState } from 'react';

type Props = {
    onSearch: (username: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query.trim()); // 🔁 call back to HomePage
        setQuery('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full max-w-md mt-6"
        >
            <input
                type="text"
                placeholder="Enter GitHub username..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
                Search
            </button>
        </form>
    );
}
