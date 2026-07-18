import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Soft background volume
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}bgm.mp3`}
        loop
        preload="auto"
      />
      <motion.button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-2xl backdrop-blur-md"
        style={{ 
          backgroundColor: 'rgba(28,15,34,0.85)', 
          border: '1px solid var(--color-gold)',
          color: 'var(--color-gold-bright)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={!isPlaying ? {
          boxShadow: [
            '0 0 0 0 rgba(203,162,77,0.4)',
            '0 0 0 10px rgba(203,162,77,0)',
            '0 0 0 0 rgba(203,162,77,0)'
          ]
        } : {}}
        transition={!isPlaying ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-1">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        )}
      </motion.button>
    </>
  );
}
