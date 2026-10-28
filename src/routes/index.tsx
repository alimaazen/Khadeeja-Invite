import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import bg08 from "@/assets/bg08.jpg";
import FallingPetals from "@/components/FallingPetals";
import ScrollInvitation from "@/components/ScrollInvitation";
import { Envelope } from "@/components/Envelope";
import AudioPlayer from "@/components/AudioPlayer";
import ScrollIndicator from "@/components/ScrollIndicator";
import branchTall from "@/assets/flowers-branch-tall.png";
import cornerLeft from "@/assets/flowers-corner-left.png";
import cornerRight from "@/assets/flowers-corner-right.png";
import meadow from "@/assets/flowers-meadow.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nikkah Invitation - Khadeeja & Savad" },
      {
        name: "description",
        content:
          "Wedding celebration of Khadeeja Abdul Shukkoor & Mohamed Savad — 24 January 2027.",
      },
      { property: "og:title", content: "Nikkah Invitation - Khadeeja & Savad" },
      {
        property: "og:description",
        content: "Wedding celebration of Khadeeja Abdul Shukkoor & Mohamed Savad.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
  }),
  component: Index,
});

function Index() {
  const [isOpened, setIsOpened] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    if (isOpened) {
      const timer = setTimeout(() => {
        setShowScrollIndicator(true);
      }, 6000); // Wait 6 seconds for Bismillah animation to complete
      return () => clearTimeout(timer);
    }
  }, [isOpened]);

  return (
    <div className="min-h-screen w-full bg-[#1A1412] flex justify-center items-start overflow-x-hidden">
      <main className="relative min-h-screen w-full max-w-[430px] mx-auto bg-[#FCFAF2] sm:shadow-[0_0_70px_rgba(0,0,0,0.45)] sm:border-x sm:border-[#8C6D53]/25 overflow-x-hidden">
        {/* 0. Envelope (z-[100]) - strictly locked to mobile portrait frame */}
        <Envelope isOpen={isOpened} onOpen={() => setIsOpened(true)} />

        {/* Audio Player - starts playing from envelope screen and persists throughout */}
        <AudioPlayer autoPlayTrigger={true} />
        {/* Scroll Indicator */}
        {showScrollIndicator && <ScrollIndicator />}

        {/* 1. Fixed stationary background (z-0) - locked to mobile frame */}
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-full z-0 pointer-events-none overflow-hidden">
          <img className="w-full h-full object-cover" src={bg08} alt="Background" />
        </div>

        {/* 2. Scrollable page content (z-10) - inside mobile container */}
        <div
          className={`relative z-10 w-full max-w-[430px] mx-auto ${
            isOpened ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity duration-1500`}
        >
          <ScrollInvitation isEnvelopeOpened={isOpened} />
        </div>

        {/* 3. Fixed floral overlay (z-20) - strictly framed inside mobile portrait */}
        <div
          className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-full pointer-events-none z-20 overflow-hidden ${
            isOpened ? "opacity-100" : "opacity-0"
          } transition-opacity duration-1500`}
          role="img"
          aria-label="Pink peonies, roses and wildflowers"
        >
          <FallingPetals />

          <div className="cluster cluster-corner-tl absolute pointer-events-none w-[58%] -top-[4%] -left-[6%] opacity-1">
            <img src={cornerLeft} width={1024} height={1024} alt="" />
          </div>
          <div className="cluster cluster-corner-tr absolute pointer-events-none w-[66%] -top-[6%] -right-[9%] opacity-1">
            <img src={cornerRight} width={1024} height={1024} alt="" />
          </div>
          <div className="cluster cluster-stem-left absolute pointer-events-none w-[36%] -bottom-[18%] -left-[7%] opacity-1">
            <img src={branchTall} width={768} height={1536} alt="" />
          </div>
          <div className="cluster cluster-stem-right absolute pointer-events-none w-[44%] -bottom-[16%] -right-[6%] opacity-1">
            <img src={branchTall} width={768} height={1536} alt="" />
          </div>
          <div className="cluster cluster-stem-mid absolute pointer-events-none w-[26%] -bottom-[20%] left-[24%] opacity-1">
            <img src={branchTall} width={768} height={1536} alt="" />
          </div>
          <div className="cluster cluster-meadow-back absolute pointer-events-none w-[132%] -left-[16%] -bottom-[8%] opacity-1">
            <img src={meadow} width={1536} height={768} alt="" />
          </div>
          <div className="cluster cluster-meadow-front absolute pointer-events-none w-[148%] -left-[24%] -bottom-[15%] opacity-1">
            <img src={meadow} width={1536} height={768} alt="" />
          </div>
        </div>
      </main>
    </div>
  );
}
