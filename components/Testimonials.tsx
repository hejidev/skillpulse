// "use client";

// import { motion } from "framer-motion";
// import { Star } from "lucide-react";

// const testimonials = [
//   {
//     name: "David A.",
//     role: "Frontend Developer",
//     feedback:
//       "SkillPulse completely changed how I track my growth. I now see real progress instead of guessing.",
//   },
//   {
//     name: "Sarah K.",
//     role: "UI/UX Designer",
//     feedback:
//       "The reflection feature is powerful. It helps me understand how I learn best.",
//   },
//   {
//     name: "Michael T.",
//     role: "Student",
//     feedback:
//       "I’ve stayed consistent for weeks because of the streak system. It’s addictive in a good way.",
//   },
// ];

// export default function Testimonials() {
//   return (
//   <section
//     className="
//       relative overflow-hidden
//       py-24 px-6
//       bg-background
//       text-foreground
//       transition-colors duration-300
//     "
//   >

//     {/* BACKGROUND GLOW */}
//     <div className="absolute inset-0 -z-10">

//       <div className="absolute top-0 left-0 w-100 h-100 bg-primary/10 blur-[120px] rounded-full" />

//       <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-500/10 blur-[120px] rounded-full" />

//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />

//     </div>

//     <div className="max-w-6xl mx-auto text-center">

//       {/* 🔥 HEADING */}
//       <motion.h2
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: true }}
//         className="
//           text-4xl md:text-5xl
//           font-black tracking-tight
//         "
//       >
//         Loved by people serious about growth
//       </motion.h2>

//       <motion.p
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         viewport={{ once: true }}
//         className="
//           mt-5
//           text-muted-foreground
//           max-w-2xl mx-auto
//           leading-relaxed
//         "
//       >
//         Join others building skills with consistency,
//         focus and intentional daily progress.
//       </motion.p>

//       {/* 🚀 TESTIMONIALS */}
//       <div className="mt-20 grid md:grid-cols-3 gap-8">

//         {testimonials.map((t, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{
//               delay: i * 0.15,
//               duration: 0.6,
//             }}
//             viewport={{ once: true }}
//             whileHover={{
//               y: -8,
//               scale: 1.02,
//             }}
//             className="
//               group relative overflow-hidden
//               p-7 rounded-[28px]
//               border border-border
//               bg-card/60
//               backdrop-blur-2xl
//               text-left
//               transition-all duration-300
//               shadow-[0_0_40px_rgba(0,0,0,0.08)]
//               hover:border-primary/20
//             "
//           >

//             {/* HOVER GLOW */}
//             <div
//               className="
//                 absolute inset-0 opacity-0
//                 group-hover:opacity-100
//                 transition-opacity duration-500
//                 bg-linear-to-br
//                 from-primary/10
//                 via-transparent
//                 to-purple-500/10
//               "
//             />

//             <div className="relative z-10">

//               {/* ⭐ STARS */}
//               <div className="flex gap-1 mb-5">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     className="
//                       text-primary fill-primary
//                     "
//                   />
//                 ))}
//               </div>

//               {/* 💬 FEEDBACK */}
//               <p
//                 className="
//                   text-sm leading-relaxed
//                   text-muted-foreground
//                   mb-8
//                 "
//               >
//                 “{t.feedback}”
//               </p>

//               {/* 👤 USER */}
//               <div className="flex items-center gap-4">

//                 <div
//                   className="
//                     w-12 h-12 rounded-2xl
//                     bg-linear-to-br
//                     from-primary
//                     to-purple-500
//                     flex items-center justify-center
//                     text-black font-bold
//                     shadow-lg
//                   "
//                 >
//                   {t.name.charAt(0)}
//                 </div>

//                 <div>
//                   <p className="font-semibold">
//                     {t.name}
//                   </p>

//                   <p className="text-sm text-muted-foreground">
//                     {t.role}
//                   </p>
//                 </div>

//               </div>

//             </div>

//           </motion.div>
//         ))}

//       </div>
//     </div>
//   </section>
// );
// }

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getPublicAbout } from "@/lib/api/about-api";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  name: string;
  role: string;
  image?: string;
  quote: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [api, setApi] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    onSelect();

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getPublicAbout();

        setTestimonials(
          data?.about?.testimonials || []
        );
      } catch (error) {
        console.error(
          "Failed to load testimonials",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      className="
        relative overflow-hidden
        py-0 px-5
        text-foreground
      "
    >
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-100 h-100 blur-[120px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-500/10 blur-[120px] rounded-full" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Loved by people serious about growth
          </h2>

          <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">
            Hear from learners, professionals and creators
            using SkillPulse to accelerate their growth.
          </p>
        </motion.div>

        <div className="mt-10">

          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >

            <CarouselContent className="-ml-4">

              {testimonials.map((testimonial, index) => {
                const isActive = selectedIndex === index;
                return (

                  <CarouselItem
                    key={`${testimonial.name}-${index}`}
                    className="
    pl-4
    basis-[90%]
    md:basis-[65%]
    lg:basis-[45%]
    xl:basis-[38%]
  "
                  >

                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.88,
                        opacity: isActive ? 1 : 0.45,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      
                      className={`
  group relative overflow-hidden
  rounded-[15px]
  p-5
  border
  backdrop-blur-2xl
  transition-all duration-700

  ${isActive
                          ? `
        scale-100
        border-primary/40
        bg-card
        shadow-[0_20px_80px_rgba(99,102,241,0.25)]
        z-20
      `
                          : `
        scale-[0.88]
        opacity-50
        border-border
        bg-card/40
      `
                        }
`}
                    >

                      {
                        isActive && (
                          <>
                            <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-brand/50" />

                            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-[80px]" />
                          </>
                        )
                      }

                      {/* Glow */}
                      <div
                        className="
                absolute inset-0 opacity-0
                group-hover:opacity-100
                transition-opacity duration-500
                bg-linear-to-br
                from-primary/10
                via-transparent
                to-purple-500/10
              "
                      />

                      <div className="relative z-10 flex flex-col h-full">

                        {/* Stars */}
                        <div className="mb-2 flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="fill-primary text-primary"
                            />
                          ))}
                        </div>

                        {/* Quote */}
                        <p
                          className="
                  flex-1
                  text-sm leading-relaxed
                  text-muted-foreground
                  mb-3
                "
                        >
                          "{testimonial.quote}"
                        </p>

                        {/* User */}
                        <div className="flex items-center gap-4">

                          {testimonial.image ? (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="
                      h-12 w-12
                      rounded-2xl
                      object-cover
                      border border-border
                    "
                            />
                          ) : (
                            <div
                              className="
                      h-12 w-12
                      rounded-2xl
                      bg-linear-to-br
                      from-primary
                      to-purple-500
                      flex items-center justify-center
                      font-bold text-black
                    "
                            >
                              {testimonial.name.charAt(0)}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">
                              {testimonial.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>

                        </div>

                      </div>
                    </motion.div>

                  </CarouselItem>

                );
              })}

            </CarouselContent>

            <CarouselPrevious
              className="
        -left-5
        bg-background/80
        backdrop-blur-xl
      "
            />

            <CarouselNext
              className="
        -right-5
        bg-background/80
        backdrop-blur-xl
      "
            />

          </Carousel>

        </div>
      </div>
    </section>
  );
}