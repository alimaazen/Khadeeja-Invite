import { useState, useRef, useEffect } from "react";

const NikkahCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 300, height: 265 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
        }
      }
    };

    updateSize();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setSize({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const w = size.width;
  const h = size.height;
  const cornerPad = 30; // Corner notch offset
  const step = 5;
  const rOuter = cornerPad - step; // 25
  const inset = 4.5;
  const rInner = rOuter - inset; // 20.5

  // Mathematically flawless outer French notched path (1:1 with screen pixels)
  const outerPath = [
    `M ${cornerPad} 0`,
    `L ${w - cornerPad} 0`,
    `L ${w - cornerPad} ${step}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${w - step} ${cornerPad}`,
    `L ${w} ${cornerPad}`,
    `L ${w} ${h - cornerPad}`,
    `L ${w - step} ${h - cornerPad}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${w - cornerPad} ${h - step}`,
    `L ${w - cornerPad} ${h}`,
    `L ${cornerPad} ${h}`,
    `L ${cornerPad} ${h - step}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${step} ${h - cornerPad}`,
    `L 0 ${h - cornerPad}`,
    `L 0 ${cornerPad}`,
    `L ${step} ${cornerPad}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${cornerPad} ${step}`,
    `L ${cornerPad} 0`,
    "Z",
  ].join(" ");

  // Parallel inner French notched stroke with precise 4.5px uniform offset
  const innerPath = [
    `M ${cornerPad} ${inset}`,
    `L ${w - cornerPad} ${inset}`,
    `L ${w - cornerPad} ${inset + step}`,
    `A ${rInner} ${rInner} 0 0 1 ${w - inset - step} ${cornerPad}`,
    `L ${w - inset} ${cornerPad}`,
    `L ${w - inset} ${h - cornerPad}`,
    `L ${w - inset - step} ${h - cornerPad}`,
    `A ${rInner} ${rInner} 0 0 1 ${w - cornerPad} ${h - inset - step}`,
    `L ${w - cornerPad} ${h - inset}`,
    `L ${cornerPad} ${h - inset}`,
    `L ${cornerPad} ${h - inset - step}`,
    `A ${rInner} ${rInner} 0 0 1 ${inset + step} ${h - cornerPad}`,
    `L ${inset} ${h - cornerPad}`,
    `L ${inset} ${cornerPad}`,
    `L ${inset + step} ${cornerPad}`,
    `A ${rInner} ${rInner} 0 0 1 ${cornerPad} ${inset + step}`,
    `L ${cornerPad} ${inset}`,
    "Z",
  ].join(" ");

  return (
    <div className="relative w-full max-w-[320px] min-[360px]:max-w-[340px] mx-auto py-1.5 font-bold">
      {/* The Main Ornate French Notched Card Container */}
      <div
        ref={containerRef}
        className="relative w-full filter drop-shadow-[0_10px_28px_rgba(122,50,69,0.11)] font-bold"
      >
        {/* Dynamic 1:1 Vector SVG Background Frame with Very Light Pink Shade */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
        >
          <defs>
            <linearGradient id="cardParchmentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF9FA" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFF4F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FCEEEF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="goldBorderGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2A5B3" />
              <stop offset="50%" stopColor="#C88595" />
              <stop offset="100%" stopColor="#A86273" />
            </linearGradient>
          </defs>

          {/* Outer French Notched Frame Fill & Rose-Gold Stroke */}
          <path
            d={outerPath}
            fill="url(#cardParchmentGrad)"
            stroke="url(#goldBorderGrad)"
            strokeWidth="1.6"
          />

          {/* Inner Parallel French Notched Stroke with Matching Corner Curves */}
          <path d={innerPath} fill="none" stroke="#D69EA9" strokeWidth="1" strokeOpacity="0.85" />
        </svg>

        {/* Content Container - Compact and Elegantly Balanced */}
        <div className="relative z-10 px-4 pt-4 pb-3.5 min-[360px]:pt-5 min-[360px]:pb-4 text-center flex flex-col items-center font-bold">
          {/* Header Title: Nikkah in Flowing Wedding Script */}
          <h3
            className="text-4xl min-[360px]:text-[44px] sm:text-5xl text-[#7A3245] leading-tight mb-2 select-none font-bold"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            Nikkah
          </h3>

          {/* 3-Column Date Section */}
          <div className="flex items-center justify-center gap-3 min-[360px]:gap-4 w-full max-w-[280px] mx-auto my-2">
            {/* Left Column: SUNDAY / الأحد */}
            <div className="text-center flex flex-col items-center justify-center flex-1 min-w-0">
              <span
                className="text-xs min-[360px]:text-sm tracking-[0.18em] uppercase text-[#7A3245] font-bold whitespace-nowrap block text-center"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                Sunday
              </span>
              <span
                className="text-base min-[360px]:text-lg text-[#9E5A6C] mt-1 whitespace-nowrap block font-bold text-center"
                style={{ fontFamily: "'Reem Kufi', 'Amiri', serif", fontWeight: 700 }}
                dir="rtl"
                lang="ar"
              >
                الأحد
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="h-12 min-[360px]:h-14 w-px shrink-0 bg-[#9E5A6C]/40" />

            {/* Middle: 24 */}
            <div className="flex items-center justify-center w-14 min-[360px]:w-16 shrink-0">
              <span
                className="text-5xl min-[360px]:text-6xl sm:text-[60px] text-[#7A3245] leading-none font-serif font-extrabold"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 800 }}
              >
                24
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="h-12 min-[360px]:h-14 w-px shrink-0 bg-[#9E5A6C]/40" />

            {/* Right Column: JANUARY / 2027 */}
            <div className="text-center flex flex-col items-center justify-center flex-1 min-w-0">
              <span
                className="text-xs min-[360px]:text-sm tracking-[0.18em] uppercase text-[#7A3245] font-bold whitespace-nowrap block text-center"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                January
              </span>
              <span
                className="text-sm min-[360px]:text-base tracking-[0.2em] text-[#9E5A6C] mt-1 whitespace-nowrap block font-bold text-center"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                2027
              </span>
            </div>
          </div>

          {/* Ornamental Divider with Botanical Centerpiece */}
          <div className="flex items-center justify-center gap-2 w-full max-w-[210px] mx-auto my-1.5 min-[360px]:my-2">
            <div className="flex-1 h-[1px] bg-[#9E5A6C]/35" />
            <svg
              className="w-3.5 h-3 text-[#9E5A6C] shrink-0 opacity-90"
              viewBox="0 0 24 20"
              fill="currentColor"
            >
              <path d="M12 0C12 0 9.5 4 9.5 8C9.5 10 10.5 11 12 12C13.5 11 14.5 10 14.5 8C14.5 4 12 0 12 0Z" />
              <path d="M4 11C4 11 7 8 10 10C9.5 11.5 8.5 12.5 6.5 12.5C5 12.5 4 11 4 11Z" />
              <path d="M20 11C20 11 17 8 14 10C14.5 11.5 15.5 12.5 17.5 12.5C19 12.5 20 11 20 11Z" />
              <circle cx="12" cy="14" r="1.5" />
            </svg>
            <div className="flex-1 h-[1px] bg-[#9E5A6C]/35" />
          </div>

          {/* Islamic Hijri Date */}
          <div className="flex flex-col items-center gap-0.5 my-0.5 font-bold">
            <p
              className="text-sm min-[360px]:text-[15px] text-[#7A3245] font-bold tracking-wide"
              style={{ fontFamily: "'Amiri', 'Aref Ruqaa', serif", fontWeight: 700 }}
              dir="rtl"
              lang="ar"
            >
              ١٦ شعبان ١٤٤٨ هـ
            </p>
            <p
              className="text-[9px] min-[360px]:text-[10px] tracking-[0.16em] uppercase text-[#9E5A6C] font-bold"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              16 Shaʿbān 1448 AH
            </p>
          </div>

          {/* Bottom Badge: Pill with 6:30 PM */}
          <div className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#FCE8ED]/85 border border-[#E5B8C3] shadow-[0_2px_8px_rgba(122,50,69,0.06)] backdrop-blur-sm">
            <span className="text-[#9E5A6C] text-[10px]">✤</span>
            <span
              className="text-[11px] min-[360px]:text-xs tracking-[0.2em] font-bold uppercase text-[#7A3245]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
            >
              6:30 PM
            </span>
            <span className="text-[#9E5A6C] text-[10px]">✤</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NikkahCard;
