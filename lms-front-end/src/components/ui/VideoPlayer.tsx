import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import type { RefObject } from 'react';
import { getMediaUrl } from '../../utils/url';

interface VideoPlayerProps {
  url?: string;
  thumbnail?: string;
  videoRef?: RefObject<HTMLVideoElement | null>;
  onTimeUpdate?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onEnded?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export default function VideoPlayer({ 
  url, 
  thumbnail, 
  videoRef,
  onTimeUpdate,
  onEnded 
}: Readonly<VideoPlayerProps>) {
  const mediaUrl = getMediaUrl(url);
  const thumbUrl = getMediaUrl(thumbnail);

  if (!url) {
    return (
      <div className="aspect-video w-full bg-charcoal/5 flex flex-col items-center justify-center border border-charcoal/10 relative overflow-hidden">
        {thumbnail && (
          <img src={thumbUrl} alt="Lesson thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" />
        )}
        <div className="relative z-10 text-center">
          <AlertCircle className="w-10 h-10 text-warm-grey/40 mx-auto mb-3" />
          <p className="text-sm text-warm-grey font-heading italic">No video available for this lesson</p>
        </div>
      </div>
    );
  }

  // Check if it's a YouTube URL
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = new RegExp(regExp).exec(url);
    return (match?.[2]?.length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(url);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="aspect-video w-full bg-black border border-charcoal/10 overflow-hidden shadow-elevated"
    >
      {youtubeId ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          src={mediaUrl}
          controls
          className="w-full h-full"
          poster={thumbUrl}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      )}
    </motion.div>
  );
}

