// Eased wheel scrolling (Lenis). It drives the real scrollY, so sticky, the fixed
// backdrops and the router's scroll restore keep working. Touch stays native.
import Lenis from 'lenis';

let lenis: Lenis | null = null;

// (Re)start on load and on every router swap: the swap wipes Lenis's classes off
// <html> and changes the page height, and a fresh instance drops any leftover glide.
// autoToggle stays off: nothing locks <html>, and destroy() leaks its listener.
export function startSmoothScroll() {
  lenis?.destroy();
  lenis = new Lenis({
    lerp: 0.14, // lower is floatier, higher tighter
    // Reduced motion: native wheel. Lenis's own fallback still glides ~7 frames;
    // it does make smoothScrollTo instant by itself.
    smoothWheel: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    allowNestedScroll: true, // drawer + dropdown lists keep their own scrolling
    autoRaf: true,
  });
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Programmatic scroll: cubic in-out, 0.9 s for a short hop up to a 1.6 s cap
export function smoothScrollTo(target: HTMLElement | number) {
  if (!lenis) return;
  lenis.resize(); // content may have just grown; Lenis's cached limit lags behind it
  const to = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  const dist = Math.abs(to - lenis.scroll);
  lenis.scrollTo(target, { duration: Math.min(1.6, 0.9 + dist / 2500), easing: easeInOut });
}

// Instant jump to the top that also cancels any glide still in flight
export function jumpToTop() {
  window.scrollTo(0, 0);
  startSmoothScroll();
}
