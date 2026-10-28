import React, { useEffect, useRef, useState } from "react";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isFirst?: boolean;
}

const ScrollSection = ({
  children,
  className = "",
  delay = 0,
  isFirst = false,
}: ScrollSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(isFirst);

  useEffect(() => {
    if (isFirst) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isFirst]);

  return (
    <section
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`min-h-[85vh] w-full flex flex-col items-center justify-center py-16 px-4 relative overflow-visible transition-all duration-1200 ease-out ${
        isVisible ? "opacity-100 blur-0 scale-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </section>
  );
};

export default ScrollSection;
