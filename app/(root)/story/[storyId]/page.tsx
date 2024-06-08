"use client";
import React from 'react'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import StoryDetailPlayer from '@/components/StoryDetailPlayer';
import LoaderSpinner from '@/components/LoaderSpinner';
import { StoryCard } from '@/components/StoryCard';
import EmptyState from '@/components/EmptyState';
import { useUser } from '@clerk/nextjs';

const StoryDetails = ({ params: {storyId} }: {params: {storyId: Id<"stories">}}) => {
  const { user } = useUser();
  const story = useQuery(api.stories.getStoryById, {storyId});
  const similarStories = useQuery(api.stories.getStoryByVoiceType, {storyId});

  const isOwner = user?.id === story?.authorId;

  if(!similarStories || !story) return <LoaderSpinner />

  return (
    <section className='flex w-full flex-col'>

      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>Currently Playing</h1>
        <figure className='flex gap-3'>
          <Image 
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt='headphone'
          />
          <h2 className='text-16 font-bold text-white-1'>{story?.views}</h2>
        </figure>
      </header>

      <StoryDetailPlayer
        isOwner={isOwner}
        storyId={story._id}
        audioUrl={story.audioUrl}
        {...story}
      />

      <p className='text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center'>{story?.storyDescription}</p>

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
          <p className='text-16 font-medium text-white-2'>{story?.voicePrompt}</p>
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Thumbnail Prompt</h1>
          <p className='text-16 font-medium text-white-2'>{story?.imagePrompt}</p>
        </div>
      </div>

      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar Stories</h1>
        {similarStories && similarStories.length > 0 ? (
          <div className='story_grid'>
          {similarStories?.map(({ _id, storyTitle, storyDescription, imageUrl }) => (
            <StoryCard
              key={_id}
              imgUrl={imageUrl!}
              title={storyTitle}
              description={storyDescription}
              storyId={_id}
            />
          ))}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar stories found"
              buttonLink="/discover"
              buttonText="Discover more stories"
            />
          </>
        )}
      </section>

    </section>
  )
}

export default StoryDetails