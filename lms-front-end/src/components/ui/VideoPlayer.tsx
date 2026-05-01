import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ReactPlayer from 'react-player';
import { getMediaUrl } from '../../utils/url';

interface VideoPlayerProps {
  url?: string;
  thumbnail?: string;
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onEnded?: () => void;
}

export default function VideoPlayer({ 
  url, 
  thumbnail, 
  onProgress,
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

  // To ensure we properly detect standard mp4 vs youtube
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const finalUrl = isYoutube ? url : mediaUrl;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="aspect-video w-full bg-black border border-charcoal/10 overflow-hidden shadow-elevated relative"
    >
      <ReactPlayer
        src={finalUrl}
        width="100%"
        height="100%"
        controls
        light={thumbnail ? thumbUrl : false}
        onTimeUpdate={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          if (onProgress) {
            const target = e.currentTarget;
            onProgress({
              played: target.duration ? target.currentTime / target.duration : 0,
              playedSeconds: target.currentTime,
              loaded: 0,
              loadedSeconds: 0
            });
          }
        }}
        onEnded={onEnded}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </motion.div>
  );
}
