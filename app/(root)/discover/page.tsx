"use client";

import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import SearchBar from '@/components/SearchBar';
import { StoryCard } from '@/components/StoryCard';
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search} }: { searchParams : { search: string }}) => {
  const storiesData = useQuery(api.stories.getStoryBySearch, { search: search || '' })

  return (
    <div className='flex flex-col gap-9'>
      <SearchBar />
      <div className='flex flex-col gap-9'>
        <h1 className='text-20 font-bold text-white-1'>
          {!search ? 'Discover Treanding Stories' : 'Search results for '}
          {search && <span className='text-white-2'>{search}</span>}
        </h1>
        {storiesData ? (
          <>
            {storiesData.length > 0 ? (
              <div className='story_grid'>
                {storiesData?.map(({ _id, storyTitle, storyDescription, imageUrl }) => (
                  <StoryCard
                    key={_id}
                    imgUrl={imageUrl!}
                    title={storyTitle}
                    description={storyDescription}
                    storyId={_id}
                  />
              ))}
              </div>
            ): <EmptyState title='No results found' />}
          </>
        ) : <LoaderSpinner />}
      </div>
    </div>
  )
}

export default Discover