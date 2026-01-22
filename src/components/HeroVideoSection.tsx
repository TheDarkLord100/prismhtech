import React from 'react'

export default function HeroVideoSection() {
    return (
        <>
            <div className="relative w-full h-[100vh] font-['Gotham']">
                {/* Video */}
                <video
                    src="/Assets/hero.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-cover w-full h-full absolute inset-0"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(7,7,7,1)_0%,rgba(67,44,17,0)_24%)]" />

                {/* Content */}
                <div className="absolute bottom-20 left-5 md:left-10 lg:left-20 w-4/5 lg:w-2/5 text-left z-10 ">
                    <div
                        className="inline-block px-6 md:px-10 py-6 rounded-2xl
      bg-black/25 md:bg-white/5 backdrop-blur shadow-lg border-t border-b border-white/30"
                    >
                        <h3 className="text-lg md:text-2xl text-white/90 drop-shadow-lg">
                            Pervesh Rasayan
                        </h3>

                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold italic text-yellow-400 drop-shadow-lg">
                            The Chemistry of Lasting Value
                        </h1>

                        <p className="text-sm md:text-base lg:text-lg mt-6 md:mt-10 lg:mt-16 text-white drop-shadow-md font-extralight md:font-normal">
                            Every product we deliver and every relationship we cultivate must embody
                            quality, trust and long-term value. We honor our past by renewing this everyday.
                        </p>

                        <button className="mt-4 md:mt-6 flex items-center gap-2 text-white/90 hover:text-white transition">
                            <span className="block w-6 md:w-8 h-[1px] bg-white/60" />
                            <span className="text-sm md:text-base tracking-wide">Discover</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-[100vh] font-['Gotham']">
                <video
                    src="/Assets/hero_2.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-cover w-full h-full absolute inset-0"
                />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(7,7,7,1)_0%,rgba(15,32,40,0)_24%)]" />

                <div className="absolute bottom-20 right-5 md:right-10 lg:right-20 w-4/5 lg:w-2/5 text-left">
                    <div
                        className="inline-block px-6 md:px-10 py-6 rounded-2xl
        bg-black/25 md:bg-white/5 backdrop-blur shadow-lg border-t border-b border-white/30"
                    >
                        <h3 className="text-lg md:text-2xl font-regular text-white/90 drop-shadow-lg">
                            Quality
                        </h3>

                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold italic text-yellow-400 drop-shadow-lg">
                            Built on Decades of Trust
                        </h1>

                        <p className="text-sm md:text-base lg:text-lg mt-6 md:mt-10 lg:mt-16 text-white drop-shadow-md">
                            "Built on 41 years of unwavering service, quality, and dedication. Our foundation is the enduring legacy of Shri M.L. Kakar, whose vision made us the trusted bridge between manufacturers and discerning end-users."
                        </p>

                        <button className="mt-4 md:mt-6 flex items-center gap-2 text-white/90 hover:text-white transition">
                            <span className="block w-6 md:w-8 h-[1px] bg-white/60" />
                            <span className="text-sm md:text-base tracking-wide">Discover</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
