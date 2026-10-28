import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import bgMusicFile from "@/assets/bgmusic.mp3";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export function AudioPlayer({ autoPlayTrigger: _autoPlayTrigger = true }: AudioPlayerProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(bgMusicFile);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const startAudio = () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay waiting for initial interaction:", err);
          });
      }
    };

    // Attempt immediate playback upon arriving at the website
    startAudio();

    // Fallback: If strict browser autoplay policy blocks unprompted playback,
    // unlock audio on the very first tap/click anywhere on the screen (e.g. tapping envelope seal)
    const handleFirstGesture = () => {
      startAudio();
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Playback failed:", err);
        });
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[120] pointer-events-auto">
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF6F0]/85 backdrop-blur-md border border-[#8C6D53]/30 shadow-md text-[#5C3A21] hover:bg-[#FAF6F0] transition-all duration-300 ${
          isPlaying ? "ring-2 ring-[#C88595]/50 animate-pulse" : ""
        }`}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-[#7A3245]" />
        ) : (
          <VolumeX className="w-4 h-4 text-[#8C6D53]/60" />
        )}
      </button>
    </div>
  );
}

export default AudioPlayer;
