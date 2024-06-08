'use client';

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { sidebarLinks } from '@/constants'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils';
import { SignedOut } from '@clerk/nextjs';
import { Button } from './ui/button';
import { SignedIn, useClerk } from '@clerk/clerk-react';
import { useAudio } from '@/providers/AudioProvider';

const LeftSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    const { audio } = useAudio();

    return (
        <section className="left_sidebar h-dvh">
            <nav className='flex flex-col gap-6'>
                <Link href="/" className='flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center'>
                    <Image src="/icons/logo.svg" alt='logo' width={23} height={27} priority={true} />
                    <h1 className='text-24 font-extrabold text-white-1 max-lg:hidden'>Storyteller</h1>
                </Link>
                {sidebarLinks.map(({route, label, imgUrl}) => {
                    const isActive = pathname === route || pathname.startsWith(`${route}/`); 
                    return (
                        <Link href={route} key={label} className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start', {'bg-nav-focus border-r-4 border-teal-600': isActive })}>
                            <Image src={imgUrl} alt={label} width={24} height={24} />
                            <p>{label}</p>
                        </Link>
                    )
                })}
            </nav>
            <SignedOut>
                <div className={cn('flex-center w-full pb-10 max-lg:px-4 lg:pr-8', {'pb-[128px]': audio?.audioUrl})}>
                    <Button className='text-16 w-full bg-teal-600 font-extrabold'>
                        <Link href="/sign-in">
                            Sign in
                        </Link>
                    </Button>
                </div>
            </SignedOut>
            <SignedIn>
                <div className={cn('flex-center w-full pb-10 max-lg:px-4 lg:pr-8', {'pb-[128px]': audio?.audioUrl})}>
                    <Button className='text-16 w-full bg-teal-600 font-extrabold' onClick={() => signOut(() => router.push('/'))}>
                        Sign out
                    </Button>
                </div>
            </SignedIn>
        </section>
    )
}

export default LeftSidebar