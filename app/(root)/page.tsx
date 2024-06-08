"use client";
import React from 'react'
import { StoryCard } from '@/components/StoryCard'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {
  const treandingStories = useQuery(api.stories.getTreandingStories);

  return (
    <div className='mt-9 flex flex-col gap-9 md:overflow-hidden'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Treanding Stories</h1>

        <div className='story_grid'>
        {treandingStories?.map(({ _id, storyTitle, storyDescription, imageUrl }) => (
          <StoryCard
            key={_id}
            imgUrl={imageUrl!}
            title={storyTitle}
            description={storyDescription}
            storyId={_id}
          />
        ))}
        </div>
      </section>

    </div>
  )
}

export default Home