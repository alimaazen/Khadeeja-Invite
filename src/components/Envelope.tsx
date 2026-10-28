import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import envelopeVideo from "@/assets/Burgundy_Seal_Envelope_White.mp4";

interface EnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
}

export function Envelope({ onOpen, isOpen }: EnvelopeProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Handle already opened state
  useEffect(() => {
    if (isOpen && !isPlaying && !showFlash && !isDone) {
      setIsDone(true);
    }
  }, [isOpen, isPlaying, showFlash, isDone]);

  const startPlayback = () => {
    if (isPlaying || showFlash || isDone) return;

    const video = videoRef.current;
    if (!video) {
      triggerWebsiteTransition();
      return;
    }

    video.muted = true;
    setIsPlaying(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Video play error:", err);
        triggerWebsiteTransition();
      });
    }
  };

  const triggerWebsiteTransition = () => {
    if (showFlash || isDone) return;
    setShowFlash(true);
    onOpen();

    setTimeout(() => {
      setIsDone(true);
    }, 1800);
  };

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-full z-[100] flex items-center justify-center overflow-hidden bg-[#1A1412] select-none transition-opacity duration-1000 ${
        showFlash ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Video Container */}
      <div
        className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
        onClick={startPlayback}
      >
        <video
          ref={videoRef}
          src={`${envelopeVideo}#t=0.001`}
          muted
          playsInline
          preload="auto"
          suppressHydrationWarning
          onEnded={triggerWebsiteTransition}
          onTimeUpdate={() => {
            if (videoRef.current && isPlaying && !showFlash) {
              const { currentTime, duration } = videoRef.current;
              if (duration > 0 && currentTime >= duration - 0.2) {
                triggerWebsiteTransition();
              }
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current && !isPlaying) {
              videoRef.current.currentTime = 0.001;
            }
          }}
          className="w-full h-full object-cover select-none"
        />
      </div>

      {/* Seamless Transition Flash */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, times: [0, 0.3, 1], ease: "easeInOut" }}
            className="fixed inset-0 z-[110] bg-[#FCFAF2] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Envelope;
