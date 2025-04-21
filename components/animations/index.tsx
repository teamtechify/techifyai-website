'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export const FadeInComponent = ({children}: {children: ReactNode}) => {
    const ref = useRef<HTMLDivElement | null>(null); // Reference for the component
    const [isVisible, setIsVisible] = useState(false); // State to track visibility

    // Spring configuration
    const props = useSpring({
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
        config: { duration: 1000 },
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true); // Set visible when in view
                        observer.unobserve(entry.target); // Stop observing after it's visible
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
        );

        if (ref.current) {
            observer.observe(ref.current); // Start observing the element
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current); // Cleanup observer on unmount
            }
        };
    }, []);

    return (
        // @ts-expect-error animated bs
        <animated.div ref={ref} style={props}>
            {children}
        </animated.div>
    );
};