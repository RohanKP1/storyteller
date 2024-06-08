"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import StoryCard from "@/components/StoryCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const storiesData = useQuery(api.stories.getStoryByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !storiesData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Creator Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          storyData={storiesData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Stories</h1>
        {storiesData && storiesData.stories.length > 0 ? (
          <div className="story_grid">
            {storiesData?.stories
              ?.slice(0, 4)
              .map((story) => (
                <StoryCard
                  key={story._id}
                  imgUrl={story.imageUrl!}
                  title={story.storyTitle!}
                  description={story.storyDescription}
                  storyId={story._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any stories yet"
            buttonLink="/create-story"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;