import LogoMosaic from './LogoMosaic'

export default function ChannelPartner() {
    return (
        <section className="w-full py-20 px-8 bg-transparent">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">

                {/* TEXT BLOCK */}
                <div className="w-full flex flex-col gap-6 items-start text-left">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-white text-lg uppercase tracking-widest font-light">
                            OUR
                        </h3>
                        <h2 className="text-5xl font-bold text-[#F4E16E] italic leading-tight">
                            CHANNEL <br /> PARTNERS
                        </h2>
                        <div className="w-12 h-0.5 bg-gray-400 my-2"></div>
                    </div>
                </div>

            </div>

            {/* FULL WIDTH IMAGE */}
            <LogoMosaic />
        </section>
    )
}
