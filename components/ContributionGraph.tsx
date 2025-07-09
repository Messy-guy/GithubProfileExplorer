'use client';

import React, { useEffect, useState } from 'react';

type Day = {
    date: string;
    contributionCount: number;
    contributionLevel: string;
};

type Props = {
    username: string;
};

const levelColorMap: Record<string, string> = {
    NONE: '#e5e7eb',
    FIRST_QUARTILE: '#c6e48b',
    SECOND_QUARTILE: '#7bc96f',
    THIRD_QUARTILE: '#239a3b',
    FOURTH_QUARTILE: '#196127',
};

export default function ContributionGraph({ username }: Props) {
    const [data, setData] = useState<Day[][]>([]);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
                const json = await res.json();
                setData(json.contributions || []);
            } catch (err) {
                console.error('Failed to load contributions:', err);
            }
        };

        fetchContributions();
    }, [username]);

    return (
        <div className="mt-6 mb-10 px-2" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <h3 className="text-lg font-semibold mb-4 text-center">Contribution Graph</h3>
            <div className="flex flex-col gap-1 overflow-x-auto">
                {/* 7 rows - one for each day */}
                {Array.from({ length: 7 }).map((_, dayIdx) => (
                    <div key={dayIdx} className="flex gap-1">
                        {/* For each week, show the square for this day */}
                        {data.map((week, weekIdx) => {
                            const day = week[dayIdx];
                            if (!day)
                                return (
                                    <div
                                        key={weekIdx}
                                        className="w-6 h-6 rounded-sm bg-gray-200"
                                        title="No contributions"
                                    />
                                );
                            return (
                                <div
                                    key={weekIdx}
                                    className="w-6 h-6 rounded-sm cursor-pointer transition-transform hover:scale-125"
                                    title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`}
                                    style={{
                                        backgroundColor: levelColorMap[day.contributionLevel] || '#e5e7eb',
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
