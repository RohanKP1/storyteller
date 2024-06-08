"use client";

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Carousel from './Carousel';
import Header from './Header';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import LoaderSpinner from './LoaderSpinner';

const RightSidebar = () => {
  const { user } = useUser();
  const topCreators = useQuery(api.users.getTopUserBystoryCount);
  const router = useRouter();

  if(!topCreators) return <LoaderSpinner/>

  return (
    <section className="right_sidebar text-white-1 h-dvh">
        <SignedIn>
          <Link href={`/profile/${user?.id}`} className='flex gap-3 pb-12'>
            <UserButton/>
            <div className='flex w-full items-center justify-between'>
              <h1 className='text-16 truncate font-semibold text-white-1'>{user?.firstName} {user?.lastName}</h1>
              <Image src="/icons/right-arrow.svg" alt='arrow' width={24} height={24}/>
            </div>
          </Link>
        </SignedIn>
        <section>
          <Header headerTitle="Fans Like You" />
          <Carousel fansLikeDetail={topCreators!} />
        </section>
        <section className='flex flex-col gap-8 pt-12'>
          <Header headerTitle="Top Creators" />
          <div className='flex flex-col gap-6'>
            {topCreators?.slice(0, 4).map((creator) => (
              <div key={creator._id} className='flex cursor-pointer justify-between' onClick={() => router.push(`/profile/${creator.clerkId}`)}>
                <figure className='flex items-center gap-2'>
                  <Image
                    src={creator.imageUrl}
                    alt={creator.name}
                    width={44}
                    height={44}
                    className='aspect-square rounded-lg bg-black-5'
                  />
                  <h2 className='text-14 font-semibold text-white-1'>{creator.name}</h2>
                </figure>
                <div className='flex items-center'>
                  <p className='text-12 font-normal'>{creator.totalStories} {(creator.totalStories > 1) ? 'stories' : 'story'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
    </section>
  )
}

export default RightSidebar