'use client';

import React, { useState } from 'react';
import Button from './button';

type Props = {
    accessToken: string;
    onClose: () => void;
};

const CreateRepoForm = ({ accessToken, onClose }: Props) => {
    const [repoName, setRepoName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!repoName) {
            alert('Repository name is required!');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: {
                    Authorization: `token ${accessToken}`,
                    Accept: 'application/vnd.github+json',
                },
                body: JSON.stringify({
                    name: repoName,
                    description,
                    private: isPrivate,
                }),
            });

            if (res.ok) {
                alert('Repository created successfully!');
                setRepoName('');
                setDescription('');
                setIsPrivate(false);
                onClose();
            } else {
                const error = await res.json();
                console.error('Error creating repo:', error);
                alert('Failed to create repository!');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-[90%] max-w-md shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                    Create New Repository
                </h2>

                <label className="text-sm text-gray-700 dark:text-gray-300">Repository Name</label>
                <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border mt-1 mb-3 dark:bg-zinc-700 dark:text-white"
                />

                <label className="text-sm text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border mt-1 mb-3 dark:bg-zinc-700 dark:text-white"
                />

                <label className="flex items-center space-x-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={() => setIsPrivate(!isPrivate)}
                    />
                    <span>Private Repository</span>
                </label>

                <div className="flex justify-end gap-2">
                    <Button onClick={onClose} className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={loading} className="bg-green-600 text-white hover:bg-green-700">
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateRepoForm;
