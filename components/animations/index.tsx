'use client'

import { animated, useSpring } from '@react-spring/web';
import { HTMLProps, ReactNode, useEffect, useRef, useState } from 'react';

type AnimatedDivProps = HTMLProps<HTMLDivElement>;

export const FadeInComponent = ({ children }: { children: ReactNode }) => {
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
        <animated.div {...props as any} ref={ref}>
            {children}
        </animated.div>
    );
};
