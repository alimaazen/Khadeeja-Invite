import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // 24 January 2027 at 6:30 PM (GST UAE / UTC+4)
    const weddingDate = new Date("2027-01-24T18:30:00+04:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      className="flex justify-center gap-2 min-[360px]:gap-2.5 sm:gap-3 mt-5 px-3 max-w-[340px] mx-auto w-full font-bold"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {timeBlocks.map((block, index) => (
        <motion.div
          key={block.label}
          className="text-center flex flex-col items-center flex-1 max-w-[72px]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(74,46,27,0.1)] px-4 py-5 min-[360px]:px-5 min-[360px]:py-6 sm:px-6 sm:py-7 border border-[#8C6D53]/35 w-full flex items-center justify-center">
            <motion.span
              key={block.value}
              className="text-3xl min-[360px]:text-4xl sm:text-5xl text-[#3B2213] leading-none font-bold"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              suppressHydrationWarning
            >
              {String(block.value).padStart(2, "0")}
            </motion.span>
          </div>
          <p
            className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#6B4E3D] font-serif font-bold mt-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            {block.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CountdownTimer;
