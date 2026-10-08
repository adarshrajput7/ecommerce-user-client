
// const Hero = () => {
//   return (
//       <div>
//       <img src="https://i.pinimg.com/1200x/43/59/be/4359be63c618ee5a0267c35fdd775d80.jpg" alt="" className="w-screen h-screen object-cover block m-0" />
//     </div>
//   )
// }

// export default Hero


import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
    const [current, setCurrent] = useState(0);

    const slides = [
        {
            type: "image",
            // src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=90",
            src: "https://plus.unsplash.com/premium_photo-1708633003354-a699da0d8481?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            number: "01",
            small: "NEW DROP",
            title: "MOVE",
            highlight: "DIFFERENT.",
        },
        {
            type: "image",
            src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=90",
            number: "02",
            small: "THE COLLECTION",
            title: "OWN",
            highlight: "THE MOMENT.",
        },
        {
            type: "image",
            // type: "video",
            src: "https://images.unsplash.com/photo-1596456214405-f1a90099fb5c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            // src: "https://cdn.coverr.co/videos/coverr-woman-in-a-clothing-store-1577/1080p.mp4",
            number: "03",
            small: "WATCH THE DROP",
            title: "STYLE",
            highlight: "IN MOTION.",
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5500);

        return () => clearInterval(timer);
    }, []);

    const next = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const slide = slides[current];

    return (
        <section className="relative h-svh min-h-150 w-full overflow-hidden bg-black">

            {/* Background */}
            {slides.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1400 ease-out ${
                        current === index
                            ? "scale-100 opacity-100"
                            : "scale-110 opacity-0"
                    }`}
                >
                    {item.type === "video" ? (
                        <video
                            src={item.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src={item.src}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
            ))}

            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/10" />

            

            {/* Main content */}
            <div className="absolute inset-0 z-10 flex items-center">
                <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">

                    <div className="max-w-5xl">

                        {/* Small label */}
                        <div className="mb-6 flex items-center gap-3">
                            <span className="h-px w-10 bg-[#00FFFF]" />

                            <span className="text-[11px] font-bold tracking-[0.35em] text-[#00FFFF]">
                                {slide.small}
                            </span>
                        </div>

                        {/* Huge title */}
                        <h1 className="text-[17vw] font-black leading-[0.78] tracking-[-0.07em] text-white sm:text-[13vw] md:text-[11vw] lg:text-[9vw]">
                            {slide.title}
                            <br />
                            <span className="text-[#00FFFF]">
                                {slide.highlight}
                            </span>
                        </h1>

                        {/* Bottom content */}
                        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">

                            <button className="group flex w-fit items-center gap-5 rounded-full bg-[#00FFFF] px-6 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:gap-7 hover:bg-white">
                                EXPLORE COLLECTION
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                                    <ArrowUpRight size={15} />
                                </span>
                            </button>

                            <p className="max-w-xs text-xs leading-5 text-white/60">
                                Designed for the bold.
                                <br />
                                Made for everyday movement.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Slide number */}
            <div className="absolute bottom-8 left-6 z-20 flex items-end gap-2 sm:left-10 lg:left-16">
                <span className="text-4xl font-light text-white">
                    {slide.number}
                </span>

                <span className="mb-1 text-xs text-white/40">
                    / 03
                </span>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-8 right-6 z-20 flex gap-2 sm:right-10 lg:right-16">

                <button
                    onClick={prev}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black"
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={next}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black"
                >
                    <ChevronRight size={20} />
                </button>

            </div>

            {/* Progress */}
            <div className="absolute bottom-0 left-0 z-20 h-1  w-full bg-white/10">
                <div
                    key={current}
                    className="h-full bg-[#00FFFF] animate-[progress_5.5s_linear]"
                    style={{ width: "100%" }}
                />
            </div>

            <style>{`
                @keyframes progress {
                    from {
                        transform: scaleX(0);
                        transform-origin: left;
                    }
                    to {
                        transform: scaleX(1);
                        transform-origin: left;
                    }
                }
            `}</style>

        </section>
    );
};

export default Hero;