"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAudio } from "@/providers/AudioProvider";
import { storyProps, ProfileCardProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";

const ProfileCard = ({
  storyData,
  imageUrl,
  userFirstName,
}: ProfileCardProps) => {
  const { setAudio } = useAudio();

  const [randomStory, setRandomStory] = useState<storyProps | null>(null);

  const playRandomStory = () => {
    const randomIndex = Math.floor(Math.random() * storyData.stories.length);

    setRandomStory(storyData.stories[randomIndex]);
  };

  useEffect(() => {
    if (randomStory) {
      setAudio({
        title: randomStory.storyTitle,
        audioUrl: randomStory.audioUrl || "",
        imageUrl: randomStory.imageUrl || "",
        author: randomStory.author,
        storyId: randomStory._id,
      });
    }
  }, [randomStory, setAudio]);

  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      <Image
        src={imageUrl}
        width={250}
        height={250}
        alt="Storyer"
        className="aspect-square rounded-lg bg-black-2"
      />
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {userFirstName}
          </h1>
        </div>
        <figure className="flex gap-3 py-6">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphones"
          />
          <h2 className="text-16 font-semibold text-white-1">
            {storyData?.listeners} &nbsp;
            <span className="font-normal text-white-2">monthly listeners</span>
          </h2>
        </figure>
        {storyData?.stories.length > 0 && (
          <Button
            onClick={playRandomStory}
            className="text-16 bg-teal-600 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play a random story
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;