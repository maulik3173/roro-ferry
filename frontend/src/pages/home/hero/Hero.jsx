import React from 'react'
import { motion } from 'framer-motion'
import Search from './search/Search'

const variants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 }
}

const Hero = () => {
    return (
        <motion.div 
            className='w-full flex-1 h-screen relative overflow-hidden'
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.85, ease: "easeInOut" }}
        >
            {/* Background Video */}
            <video 
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay 
                loop 
                muted 
                playsInline
            >
                <source src="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay & Content */}
            <div className="absolute top-0 left-0 w-full h-full py-[9ch] bg-gradient-to-b from-neutral-50/70 via-neutral-50/15 to-neutral-50/5 flex items-center justify-start text-center flex-col gap-9">
                
                <div className='space-y-2'>
                    <motion.p
                        initial={{ opacity: 0, y: -900 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -800 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className='text-xl text-gray-600 mb-8 mt-4 font-light italic'
                    >
                         Get your RORO ticket now 
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: -900 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -800 }}
                        transition={{ duration: 1.85, ease: "easeOut" }}
                        className='text-6xl text-gray-900 font-extrabold tracking-wide uppercase'
                    >
                        SKIP THE TRAFFIC, RIDE THE WAVES!
                    </motion.h1>

                    {/* Search section */}
                    <Search />
                </div>
            </div>
        </motion.div>
    )
}

export default Hero
