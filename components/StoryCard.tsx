import React from 'react'
import Image from 'next/image'
import { storyCardProps } from '@/types'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export const StoryCard = ({imgUrl, title, description, storyId}: storyCardProps) => {
  const router = useRouter();
  const updateViews = useMutation(api.stories.updateStoryViews);

  const handleViews = () => {
    router.push(`/story/${storyId}`, {
      scroll: true
    });
    updateViews({storyId});
  }

  return (
    <div className='cursor-pointer' onClick={handleViews}>
        <figure className='flex flex-col gap-2'>
            <Image src={imgUrl} width={174} height={174} alt={title} priority={true}
            className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'/>
            <div className='flex flex-col'>
                <h1 className='text-16 truncate font-bold text-white-1'>{title}</h1>
                <h2 className='text-12 truncate font-normal capitalize text-white-4'>{description}</h2>
            </div>
        </figure>
    </div>
  )
}

export default StoryCard;
