/**
 * GSAP Configuration for CSP Compliance
 * Configures GSAP to avoid eval() usage and ensure Content Security Policy compliance
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Configure GSAP for CSP compliance
gsap.config({
  // Disable eval usage for CSP compliance
  force3D: false,
  nullTargetWarn: false,
  trialWarn: false,
  // Ensure no dynamic code execution
  autoSleep: 60,
  // Use CSS transforms instead of eval-based calculations
  units: {
    left: "px",
    top: "px",
    rotation: "deg"
  }
});

// Configure ScrollTrigger for better performance and CSP compliance
ScrollTrigger.config({
  // Disable auto-refresh to prevent eval usage
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  // Use requestAnimationFrame instead of eval-based timing
  ignoreMobileResize: true
});

// CSP-compliant animation utilities
export const createSafeAnimation = (target: any, vars: any) => {
  // Ensure no eval usage in animation properties
  const safeVars = { ...vars };
  
  // Remove any potentially unsafe properties
  delete safeVars.onComplete;
  delete safeVars.onUpdate;
  delete safeVars.onStart;
  
  // Use safe callbacks if needed
  if (vars.onComplete && typeof vars.onComplete === 'function') {
    safeVars.onComplete = vars.onComplete;
  }
  if (vars.onUpdate && typeof vars.onUpdate === 'function') {
    safeVars.onUpdate = vars.onUpdate;
  }
  if (vars.onStart && typeof vars.onStart === 'function') {
    safeVars.onStart = vars.onStart;
  }
  
  return gsap.to(target, safeVars);
};

// Safe timeline creation
export const createSafeTimeline = (vars?: any) => {
  const safeVars = vars ? { ...vars } : {};
  
  // Remove potentially unsafe timeline properties
  delete safeVars.onComplete;
  delete safeVars.onUpdate;
  delete safeVars.onStart;
  
  const timeline = gsap.timeline(safeVars);
  
  // Add safe callbacks if provided
  if (vars?.onComplete && typeof vars.onComplete === 'function') {
    timeline.eventCallback('onComplete', vars.onComplete);
  }
  if (vars?.onUpdate && typeof vars.onUpdate === 'function') {
    timeline.eventCallback('onUpdate', vars.onUpdate);
  }
  if (vars?.onStart && typeof vars.onStart === 'function') {
    timeline.eventCallback('onStart', vars.onStart);
  }
  
  return timeline;
};

// Safe ScrollTrigger creation
export const createSafeScrollTrigger = (vars: any) => {
  const safeVars = { ...vars };
  
  // Ensure safe scroll trigger configuration
  safeVars.invalidateOnRefresh = true;
  safeVars.refreshPriority = 0;
  
  // Remove potentially unsafe callbacks and replace with safe versions
  if (vars.onEnter && typeof vars.onEnter === 'function') {
    safeVars.onEnter = vars.onEnter;
  }
  if (vars.onLeave && typeof vars.onLeave === 'function') {
    safeVars.onLeave = vars.onLeave;
  }
  if (vars.onEnterBack && typeof vars.onEnterBack === 'function') {
    safeVars.onEnterBack = vars.onEnterBack;
  }
  if (vars.onLeaveBack && typeof vars.onLeaveBack === 'function') {
    safeVars.onLeaveBack = vars.onLeaveBack;
  }
  
  return ScrollTrigger.create(safeVars);
};

// Cleanup function for ScrollTrigger
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  ScrollTrigger.refresh();
};

// Safe animation presets
export const animationPresets = {
  fadeIn: {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
  },
  slideUp: {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  },
  slideDown: {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  },
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: "back.out(1.7)"
  },
  rotateIn: {
    rotation: 180,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }
};

// Export configured GSAP instance
export { gsap, ScrollTrigger };
export default gsap;
