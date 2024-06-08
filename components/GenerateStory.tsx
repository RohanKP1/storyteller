import { GenerateStoryProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Loader } from 'lucide-react'
import { Button } from './ui/button'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuuidv4 } from 'uuid'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useToast } from "@/components/ui/use-toast"

const useGenerateStory = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GenerateStoryProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()

  const getStoryAudio = useAction(api.openai.generateAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioUrl = useMutation(api.stories.getUrl);

  const generateStory = async () => {
    setIsGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({
          title: "Please provide a voiceType to generate story",
        }) 
      return setIsGenerating(false);
    }
    try {
      const response = await getStoryAudio({voice: voiceType, input: voicePrompt});

      const blob = new Blob([response], {type: 'audio/mpeg'});
      const fileName = `story-${uuuidv4()}.mp3`;
      const file = new File([blob], fileName, {type: 'audio/mpeg'});

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Story generated successfully",
      }) 
    } catch (error) {
      console.log("Error generating story", error)

      toast({
        title: "Error generating story",
        variant: 'destructive'
      }) 
      setIsGenerating(false);
    }
  }

  return {isGenerating, generateStory}
}

const GenerateStory = (props: GenerateStoryProps) => {
    const {isGenerating, generateStory} = useGenerateStory(props);
    return (
      <div>
        <div className='flex flex-col gap-2.5'>
          <Label className="text-16 font-bold text-white-1">AI Prompt to generate Story</Label>
          <Textarea className='input-class font-light focus-visible:ring-offset-teal-600' placeholder='Provide text to generate audio' rows={5} value={props.voicePrompt} onChange={(e) => props.setVoicePrompt(e.target.value)} />
        </div>
        <div className='mt-5 w-full max-w-[200px]'>
          <Button type="submit" className="text-16 bg-teal-600 py-4 font-bold text-white-1" disabled={isGenerating ? true : false} onClick={generateStory}>
            {isGenerating ? (
              <>
              Generating
              <Loader size={20} className="ml-2 animate-spin" />
              </>
            ) : (
              'Generate'
            )}
          </Button>
        </div>
        {props.audio && (
          <audio 
            controls
            src={props.audio}
            autoPlay
            className='mt-5'
            onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
          />
        )}
      </div>
    )
}

export default GenerateStory