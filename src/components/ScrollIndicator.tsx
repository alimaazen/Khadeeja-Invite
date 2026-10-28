import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A03354]/90 backdrop-blur-sm border border-[#FAF6F0]/30 shadow-lg"
      >
        <ChevronDown className="w-3 h-3 text-[#FAF6F0]" />
        <span
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#FAF6F0]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
        >
          Scroll Down
        </span>
        <ChevronDown className="w-3 h-3 text-[#FAF6F0]" />
      </motion.div>
    </motion.div>
  );
}

export default ScrollIndicator;
