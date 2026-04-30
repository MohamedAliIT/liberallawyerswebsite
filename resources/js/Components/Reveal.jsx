import React, { useRef, useState, useEffect } from 'react';

/**
 * Reveal wrapper: fades and slides children into view on scroll
 *
 * Props:
 * - className: extra wrapper classes
 * - threshold: IntersectionObserver threshold (0–1)
 * - rootMargin: IntersectionObserver rootMargin to trigger early
 * - once: if true, animation runs only once (default)
 * - enter: Tailwind classes when visible
 * - exit: Tailwind classes when hidden
 * - delay: initial reveal delay in ms
 * - duration: animation duration in ms
 * - stagger: interval in ms between child reveals when multiple children
 * - direction: 'y' or 'x' axis for slide offset
 * - distance: translate distance in px
 *
 * Usage:
 * <Reveal delay={100} duration={800} direction="x" distance={20}>
 *   <div>Your content</div>
 * </Reveal>
 */
export default function Reveal({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '0px 0px -20% 0px',
  once = true,
  enter = 'opacity-100 translate-y-0',
  exit = 'opacity-0',
  delay = 0,
  duration = 700,
  stagger = 50,
  direction = 'y',
  distance = 16,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  // Build inline styles with delay, duration, and optional stagger
  const style = {};
  style.transitionProperty = 'opacity, transform';
  style.transitionDuration = `${duration}ms`;
  style.transitionTimingFunction = 'cubic-bezier(0.4,0,0.2,1)';

  return (
    <div
      ref={ref}
      className={className}
      style={style}
    >
      {React.Children.map(children, (child, i) => {
        const totalDelay = delay + i * stagger;
        const childStyle = {
          ...style,
          transitionDelay: `${totalDelay}ms`,
          transform: visible
            ? 'none'
            : direction === 'x'
            ? `translateX(${distance}px)`
            : `translateY(${distance}px)`,
          opacity: visible ? 1 : 0,
        };
        return (
          <div className={`${visible ? enter : exit}`} style={childStyle}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
