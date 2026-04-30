import { TESTIMONIALS } from '@/data'
import React from 'react'

function Testimonial() {
  return (
     <section className="w-full bg-[#eaf7f2] overflow-hidden">
            <div className="flex flex-col items-center gap-[70px] lg:gap-9 pb-[80px] lg:pb-[120px]">
              <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-[1200px] pt-[80px] lg:pt-[120px] px-5 lg:px-0 gap-10 lg:gap-0">
                <div className="flex flex-col gap-3 items-center lg:items-start">
                  <p className="text-[#24a170] font-bold text-base">
                    290K happy customers in Worldwide · 19M meals delivered
                  </p>
                  <h2
                    className="text-[#343b42] font-black text-center lg:text-left"
                    style={{ fontSize: "48px", lineHeight: "56px" }}
                  >
                    Real results, real stories
                  </h2>
                </div>
              </div>
    
              {/* Testimonial cards scroll */}
              <div className="w-full overflow-x-auto flex gap-6 px-5 scrollbar-hide">
                {TESTIMONIALS.map((t) => (
                  <div
                    key={t.id}
                    className="flex-shrink-0 w-[293px] lg:w-[561px] min-h-[254px] lg:min-h-[216px] bg-white rounded-[20px] p-8 flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-[46px] h-[46px] rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-[#343b42] text-base">
                          {t.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#343b42] text-sm leading-5 line-clamp-4">
                      {t.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
  )
}

export default Testimonial