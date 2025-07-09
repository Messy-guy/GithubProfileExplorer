'use client';

import React, { useEffect, useState } from 'react';
import Button from './button';

type Repo = {
    name: string;
    html_url: string;
    clone_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
};

type Props = {
    username: string;
};

const ReposList = ({ username }: Props) => {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(5); // Initial 5 repos

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await fetch(`https://api.github.com/users/${username}/repos`);
                const data = await res.json();
                setRepos(data);
            } catch (error) {
                console.error('Failed to fetch repos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, [username]);

    const handleClone = (cloneUrl: string) => {
        navigator.clipboard.writeText(cloneUrl);
        alert('Clone URL copied to clipboard!');
    };

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    const handleShowLess = () => {
        setVisibleCount(5);
    };

    if (loading) return <p>Loading repos...</p>;

    return (
        <div className="mt-6 mx-[10px] space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Repositories</h3>

            {repos.slice(0, visibleCount).map((repo) => (
                <div
                    key={repo.name}
                    className="p-4 border rounded-md dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm"
                >
                    <p className="font-medium text-lg text-gray-900 dark:text-white">{repo.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {repo.description || 'No description'}
                    </p>
                    <div className="flex gap-3 text-sm mt-2 text-gray-700 dark:text-gray-200">
                        ⭐ {repo.stargazers_count}
                        🍴 {repo.forks_count}
                    </div>
                    <div className="mt-2 flex justify-between items-center gap-2">
                        <a
                            href={repo.html_url}
                            target="_blank"
                            className="text-blue-600 underline text-sm"
                            rel="noopener noreferrer"
                        >
                            View on GitHub
                        </a>
                        <Button onClick={() => handleClone(repo.clone_url)}>Clone</Button>
                    </div>
                </div>
            ))}

            {/* Show More / Show Less Buttons */}
            <div className="text-center space-x-2 mb-10">
                {visibleCount < repos.length && (
                    <Button onClick={handleShowMore} className="mt-2">
                        Show More
                    </Button>
                )}

                {visibleCount > 5 && (
                    <Button onClick={handleShowLess} className="mt-2">
                        Show Less
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ReposList;
