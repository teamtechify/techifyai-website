'use client'

import { useState, useEffect, LegacyRef } from "react"
import { Stream } from "@cloudflare/stream-react";
import { FaX, FaCirclePlay } from "react-icons/fa6";
import Image from "next/image";

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: 0,
      height: 0,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
       
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export const Video1 = ({src, overlay, noOverflow, disabled, className, autoplay, overlaySrc, ref} : {src: string, overlay?: string, noOverflow?: boolean, disabled?: boolean, className?: string, autoplay?: boolean, overlaySrc?: string, ref?: LegacyRef<HTMLDivElement> | undefined}) => {
    const [overlayEnabled, setOverlayEnabled] = useState(true)
    const [currentTime, setCurrentTime] = useState(1)
    const [muted, setMuted] = useState(true)
    const [controls, setControls] = useState(false)
    const windowSize = useWindowSize()
    const [popup, setPopup] = useState(false)
    const mobile = windowSize.width < 1024

    const Play = () => {
        setOverlayEnabled(false)
        setCurrentTime(0)
        setMuted(false)
        setControls(true)
        setPopup(true)
    }

    // const Stop = () => {
    //     setOverlayEnabled(true)
    //     setMuted(true)
    //     setControls(false)
    //     setPopup(false)
    // }

    return(
        <div className={`relative`}>
            <div className={noOverflow ? "w-full relative" : ` w-full relative`}>
                <div className={(mobile && !popup && !noOverflow) ? '': `relative max-w-[100%]`} ref={ref}>
                    { !mobile 
                        ? <Stream className={`w-full h-full hidden lg:block ${className && className}`} src={src}
                            height={"100%"}
                            width={"100%"}
                            responsive={true}
                            autoplay={autoplay ? autoplay : false}
                            loop={true}
                            muted={muted}
                            controls={controls}
                            currentTime={currentTime} />
                        : <Stream className={`w-full ${!noOverflow && ''} lg:hidden ${className && className}`} src={src}
                            height={"100%"}
                            width={"100%"}
                            responsive={true}
                            autoplay={autoplay ? autoplay : false}
                            loop={true}
                            muted={muted}
                            controls={controls}
                            currentTime={currentTime} />
                    }
                    {overlay && overlayEnabled && <div className={`absolute top-0 left-0 h-full w-full ${overlay && overlay}`}>
                    {overlaySrc && <Image src={overlaySrc} alt="Overlay Placeholder" className="w-full h-full object-fill" width={1200} height={1200} />}
                    {!disabled && <FaCirclePlay style={{
                                top: 'calc(50% - 32px)',
                                left: 'calc(50% - 32px)',
                            }} className="absolute h-[65px] w-[65px] lg:h-[83px] lg:w-[83px] cursor-pointer text-white" 
                            onClick={Play} height={256} width={256} />}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export const AltVideo1Desktop = ({src, overlay, noOverflow, disabled, autoplay, border} : {src: string, overlay?: string, noOverflow?: boolean, disabled?: boolean, autoplay?: boolean, border?: boolean}) => {
    const [overlayEnabled, setOverlayEnabled] = useState(true)
    const [currentTime, setCurrentTime] = useState(1)
    const [muted, setMuted] = useState(true)
    const [controls, setControls] = useState(false)
    const windowSize = useWindowSize()
    const mobile = windowSize.width < 1024
    const borderValue = border ? border : false

    const Play = () => {
        setOverlayEnabled(false)
        setCurrentTime(0)
        setMuted(false)
        setControls(true)
    }

    return(
        <div className={`relative h-full ${borderValue && ` lg:p-[1px] lg:min-h-[410px]`}`}>
            <div className={noOverflow ? "w-full relative" : `w-full relative ${!mobile && 'h-full lg:min-h-[410px]'}`}>
                <div className={(mobile && !noOverflow && !controls) ? 'w-[150%] ml-[-25%]': `relative h-full lg:min-h-[410px]`}>
                    { !mobile 
                        ? <Stream className={`w-full h-full hidden lg:block min-h-[410px]`} src={src}
                            height={"100%"}
                            width={"100%"}
                            responsive={true}
                            autoplay={autoplay ? autoplay : false}
                            loop={true}
                            muted={muted}
                            controls={controls}
                            currentTime={currentTime} />
                        : <Stream className={`w-full ${!noOverflow && 'min-h-[280px]'} lg:hidden`} src={src}
                            height={"100%"}
                            width={"100%"}
                            responsive={true}
                            autoplay={autoplay ? autoplay : false}
                            loop={true}
                            muted={muted}
                            controls={controls}
                            currentTime={currentTime} />
                    }
                    {overlay && overlayEnabled && <div className={`absolute top-0 left-0 h-full w-full ${overlay && overlay}`}>
                    {!disabled && <FaCirclePlay style={{
                                top: 'calc(50% - 32px)',
                                left: 'calc(50% - 32px)',
                            }} className="absolute h-[65px] w-[65px] lg:h-[83px] lg:w-[83px] cursor-pointer text-white" 
                            onClick={Play} height={256} width={256} />}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export const HeroVideo = ({src, overlay} : {src: string, overlay?: string }) => {
    const windowSize = useWindowSize()
    const mobile = windowSize.width < 1024

    return(
        <div className={`relative`}>
            { !mobile 
                ? <Stream className={`w-full h-full hidden lg:block`} src={src}
                    height={"100%"}
                    width={"100%"}
                    responsive={true}
                    autoplay={true}
                    loop={true}
                    muted={true}
                    controls={false} />
                : <Stream className={`w-full lg:hidden`} src={src}
                    height={"100%"}
                    width={"100%"}
                    responsive={true}
                    autoplay={true}
                    loop={true}
                    muted={true}
                    controls={false} />
            }
            {overlay && <div className={`absolute top-0 left-0 h-full w-full ${overlay && overlay}`}>
            </div>}
        </div>
    )
}