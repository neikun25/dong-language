/*
 * Design: 全宽轮播图组件
 * 中国风插画轮播，左右箭头导航，底部圆点指示器
 */
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const bannerImages = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/banner1-EELMC4QXVm9cuMSuKPUczR.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/banner2-ZSoUzvjk4MNoxQybZ9MiMJ.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/banner3-CwPZViqTsaCWdQTZPo7Eeh.webp",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % bannerImages.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + bannerImages.length) % bannerImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "21/9" }}>
      {/* Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {bannerImages.map((src, i) => (
          <div key={i} className="w-full h-full flex-shrink-0">
            <img
              src={src}
              alt={`侗族文化轮播图 ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="上一张"
      >
        <ChevronLeft className="w-10 h-10 md:w-14 md:h-14 drop-shadow-lg" strokeWidth={2.5} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="下一张"
      >
        <ChevronRight className="w-10 h-10 md:w-14 md:h-14 drop-shadow-lg" strokeWidth={2.5} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5">
        {bannerImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`切换到第 ${i + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
