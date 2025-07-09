'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SearchBar from '@/components/SearchBar';
import UserCard from '@/components/UserCard';
import ReposList from "@/components/RepoList";
import ContributionGraph from "@/components/ContributionGraph";

type Profile = {
  name: string;
  login: string;
  bio: string;
  email: string;
  created_at: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [loggedInProfile, setLoggedInProfile] = useState<Profile | null>(null);
  const [searchedProfile, setSearchedProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${session.accessToken}`,
          },
        });

        const data: Profile = await res.json();
        setLoggedInProfile(data);
      } catch (err) {
        console.error('Failed to fetch GitHub profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) {
        alert('User not found!');
        setSearchedProfile(null);
        return;
      }
      const data: Profile = await res.json();
      setSearchedProfile(data);
      checkIfFollowing(data.login);
    } catch (err) {
      console.error('Error fetching searched user:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFollowing = async (username: string) => {
    if (!session?.accessToken) return;

    try {
      const res = await fetch(`https://api.github.com/user/following/${username}`, {
        headers: {
          Authorization: `token ${session.accessToken}`,
        },
      });

      setIsFollowing(res.status === 204); // 204 means is following
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const handleFollowToggle = async (username: string) => {
    if (!session?.accessToken) return;

    setLoadingFollow(true);
    try {
      const method = isFollowing ? 'DELETE' : 'PUT';
      const res = await fetch(`https://api.github.com/user/following/${username}`, {
        method,
        headers: {
          Authorization: `token ${session.accessToken}`,
          'Content-Length': '0',
        },
      });

      if (res.status === 204) {
        setIsFollowing(!isFollowing);

        // Update loggedInProfile.following count dynamically
        setLoggedInProfile((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            following: isFollowing ? prev.following - 1 : prev.following + 1,
          };
        });
      } else {
        const errorText = await res.text();
        console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'}:`, errorText);
        alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user.`);
      }
    } catch (err) {
      console.error(`Error during ${isFollowing ? 'unfollow' : 'follow'}:`, err);
      alert('Network error.');
    } finally {
      setLoadingFollow(false);
    }
  };


  if (status === 'loading' || loading) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
          <p className="text-gray-700 dark:text-gray-200">Loading...</p>
        </main>
    );
  }

  if (!session || !loggedInProfile) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
          <p className="text-gray-700 dark:text-gray-200">
            You must sign in to view this page.
          </p>
        </main>
    );
  }

  return (
      <main className="flex min-h-screen items-start justify-center dark:bg-black bg-gray-100">
        <div className="flex flex-col items-center justify-start mt-3 w-full">
          <h1 className="dark:text-gray-50 text-3xl font-bold text-center">
            Explore GitHub Profiles
          </h1>
          <p className="text-center mt-1.5 mb-4 text-gray-700 dark:text-gray-300">
            Discover developers and their projects <br /> in a clean interface
          </p>

          <SearchBar onSearch={handleSearch} />

          <div className="mt-6 w-full mx-[10px]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              🧍 Your GitHub Profile
            </h2>
            <UserCard
                name={loggedInProfile.name}
                username={loggedInProfile.login}
                bio={loggedInProfile.bio}
                email={loggedInProfile.email}
                joinDate={new Date(loggedInProfile.created_at).toDateString()}
                avatarUrl={loggedInProfile.avatar_url}
                stats={{
                  followers: loggedInProfile.followers,
                  following: loggedInProfile.following,
                  repos: loggedInProfile.public_repos,
                  gists: loggedInProfile.public_gists,
                  stars: 0,
                }}
            />
          </div>

          {searchedProfile && searchedProfile.login !== loggedInProfile.login && (
              <div className="mt-6 w-full mx-[10px]">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  🔍 Searched Profile
                </h2>
                <UserCard
                    name={searchedProfile.name}
                    username={searchedProfile.login}
                    bio={searchedProfile.bio}
                    email={searchedProfile.email}
                    joinDate={new Date(searchedProfile.created_at).toDateString()}
                    avatarUrl={searchedProfile.avatar_url}
                    stats={{
                      followers: searchedProfile.followers,
                      following: searchedProfile.following,
                      repos: searchedProfile.public_repos,
                      gists: searchedProfile.public_gists,
                      stars: 0,
                    }}
                    showFollowButton={true}
                    isFollowing={isFollowing}
                    loadingFollow={loadingFollow}
                    onFollow={handleFollowToggle}
                />

                <ReposList username={searchedProfile.login} />
                <ContributionGraph username={searchedProfile.login} />
              </div>
          )}
        </div>
      </main>
  );
}
