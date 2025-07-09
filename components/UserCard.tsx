"use client";

import React, { useState } from "react";
import Button from "@/components/button";
import CreateRepoForm from "@/components/CreateRepoForm";
import { useSession } from "next-auth/react";

type Props = {
    name: string;
    username: string;
    bio: string;
    email?: string;
    joinDate?: string;
    avatarUrl: string;
    stats: {
        followers: number;
        following: number;
        repos: number;
        gists: number;
        stars: number;
    };
    showFollowButton?: boolean;
    isFollowing?: boolean;
    loadingFollow?: boolean;
    onFollow?: (username: string) => void;
};

function UserCard({
                      name,
                      username,
                      bio,
                      email,
                      joinDate,
                      avatarUrl,
                      stats,
                      showFollowButton = false,
                      isFollowing = false,
                      loadingFollow = false,
                      onFollow,
                  }: Props) {
    const { data: session } = useSession();

    // State to toggle create repo form visibility
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Check if current logged-in user is the profile owner and has access token
    const isProfileOwner = session?.user?.name === name && session?.accessToken;

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mx-[10px] w-[calc(100vw-20px)] p-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-5">
                <img
                    src={avatarUrl}
                    alt="Profile Picture"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                />

                <div className="flex-1">
                    <p className="font-bold text-lg">{name}</p>
                    <p className="text-gray-500 text-sm">@{username}</p>
                    <p className="mt-1 text-sm">{bio || "No bio available."}</p>

                    {email && (
                        <div className="flex items-center space-x-2 mt-2 text-sm">
                            📧 <p>{email}</p>
                        </div>
                    )}
                    {joinDate && (
                        <div className="flex items-center space-x-2 mt-1 text-sm">
                            📅 <p>Joined {joinDate}</p>
                        </div>
                    )}

                    {/* Follow button logic */}
                    {showFollowButton && (
                        <div className="mt-3">
                            <Button
                                onClick={() => onFollow?.(username)}
                                disabled={loadingFollow}
                                className={
                                    isFollowing
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 border-t pt-3 text-center text-sm">
                <div>
                    <p className="font-semibold text-base">{stats.followers}</p>
                    <p className="text-gray-500">Followers</p>
                </div>
                <div>
                    <p className="font-semibold text-base">{stats.following}</p>
                    <p className="text-gray-500">Following</p>
                </div>
                <div>
                    <p className="font-semibold text-base">{stats.repos}</p>
                    <p className="text-gray-500">Repos</p>
                </div>
                <div>
                    <p className="font-semibold text-base">{stats.gists}</p>
                    <p className="text-gray-500">Gists</p>
                </div>
                <div>
                    <p className="font-semibold text-base">{stats.stars}</p>
                    <p className="text-gray-500">Stars</p>
                </div>
            </div>

            {/* Create New Repository Button and Form (only for profile owner) */}
            {isProfileOwner && (
                <div className="mt-6 px-2">
                    {!showCreateForm ? (
                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
                        >
                            + Create New Repository
                        </Button>
                    ) : (
                        <CreateRepoForm
                            accessToken={session.accessToken as string}
                            onClose={() => setShowCreateForm(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default UserCard;
