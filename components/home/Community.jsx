import { COMMUNITY_POSTS } from "@/data";
import React, { useEffect, useRef } from "react";

function Community() {
  const communityAnimRef = useRef<HTMLDivElement>(null);

  // Community infinite scroll animation
  // useEffect(() => {
  //   const el = communityAnimRef.current;
  //   if (!el) return;
  //   let pos = 0;
  //   const speed = 0.5;
  //   const totalWidth = el.scrollWidth / 2;
  //   let raf: number;
  //   const animate = () => {
  //     pos += speed;
  //     if (pos >= totalWidth) pos = 0;
  //     el.style.transform = `translateX(-${pos}px)`;
  //     raf = requestAnimationFrame(animate);
  //   };
  //   raf = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(raf);
  // }, []);

  return (
    <section className="w-full bg-[#28b17b] overflow-hidden">
      <div className="flex flex-col gap-[22px] lg:gap-8 py-[42px] pl-5 lg:pl-[112px] overflow-hidden">
        <h2
          className="text-white font-bold lg:font-black"
          style={{ fontSize: "clamp(32px, 3vw, 40px)", lineHeight: "44px" }}
        >
          From The Community
        </h2>
        {/* Infinite scroll container */}
        <div className="w-full overflow-hidden">
          <div
            ref={communityAnimRef}
            className="flex gap-[22px] will-change-transform"
            style={{ width: "max-content" }}
          >
            {/* Duplicate for infinite loop */}
            {[...COMMUNITY_POSTS, ...COMMUNITY_POSTS].map((post, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white rounded-[12px] p-3 pb-[22px] flex flex-col gap-3 cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="w-[211px] h-[197px] rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt={`${post.username} food content`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden">
                    <img
                      src={post.avatar}
                      alt={`${post.username} profile`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[#343b42] text-sm font-bold truncate max-w-[150px]">
                    {post.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Community;
