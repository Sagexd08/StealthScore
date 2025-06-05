import { useEffect, useRef } from "react"; 
import { useInView, useMotionValue, useSpring } from "framer-motion"; 
 
interface CountUpProps { 
    to: number; 
    from?: number; 
    direction?: "up" | "down"; 
    delay?: number; 
    duration?: number; 
    className?: string; 
    startWhen?: boolean; 
    separator?: string; 
    suffix?: string;
    prefix?: string;
    decimals?: number;
    onStart?: () => void; 
    onEnd?: () => void; 
} 
 
export default function CountUp({ 
    to, 
    from = 0, 
    direction = "up", 
    delay = 0, 
    duration = 2, 
    className = "", 
    startWhen = true, 
    separator = "", 
    suffix = "",
    prefix = "",
    decimals = 0,
    onStart, 
    onEnd, 
}: CountUpProps) { 
    const ref = useRef<HTMLSpanElement>(null); 
    const motionValue = useMotionValue(direction === "down" ? to : from); 
 
    // Enhanced spring configuration for smoother animations
    const damping = 25 + 35 * (1 / duration);
    const stiffness = 120 * (1 / duration);
 
    const springValue = useSpring(motionValue, { 
        damping, 
        stiffness,
        restDelta: 0.001,
    }); 
 
    const isInView = useInView(ref, { once: true, margin: "-10%" }); 
 
    // Enhanced number formatting function
    const formatNumber = (value: number) => {
        const options = { 
            useGrouping: !!separator, 
            minimumFractionDigits: decimals, 
            maximumFractionDigits: decimals, 
        }; 

        const formattedNumber = Intl.NumberFormat("en-US", options).format(
            Number(value.toFixed(decimals))
        ); 

        return separator 
            ? formattedNumber.replace(/,/g, separator) 
            : formattedNumber;
    };

    // Set initial text content to the initial value based on direction 
    useEffect(() => { 
        if (ref.current) { 
            const initialValue = direction === "down" ? to : from;
            const formattedValue = formatNumber(initialValue);
            ref.current.textContent = `${prefix}${formattedValue}${suffix}`;
        } 
    }, [from, to, direction, prefix, suffix, separator, decimals]); 
 
    // Start the animation when in view and startWhen is true 
    useEffect(() => { 
        if (isInView && startWhen) { 
            if (typeof onStart === "function") { 
                onStart(); 
            } 
 
            const timeoutId = setTimeout(() => { 
                motionValue.set(direction === "down" ? from : to); 
            }, delay * 1000); 
 
            const durationTimeoutId = setTimeout(() => { 
                if (typeof onEnd === "function") { 
                    onEnd(); 
                } 
            }, delay * 1000 + duration * 1000); 
 
            return () => { 
                clearTimeout(timeoutId); 
                clearTimeout(durationTimeoutId); 
            }; 
        } 
    }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]); 
 
    // Update text content with formatted number on spring value change 
    useEffect(() => { 
        const unsubscribe = springValue.on("change", (latest) => { 
            if (ref.current) { 
                const formattedValue = formatNumber(latest);
                ref.current.textContent = `${prefix}${formattedValue}${suffix}`;
            } 
        }); 
 
        return () => unsubscribe(); 
    }, [springValue, separator, suffix, prefix, decimals]); 
 
    return <span className={`${className}`} ref={ref} />; 
}
