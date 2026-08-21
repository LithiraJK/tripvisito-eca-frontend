/**
 * Framer Motion Animation Variants
 * Reusable animation configurations following best practices
 */

import type { Variants } from "framer-motion";

/**
 * Page container animations - for wrapping entire pages
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

/**
 * Fade in animation - simple and performant
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Fade in from bottom - for cards and sections
 */
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Scale and fade - for cards on hover
 */
export const scaleOnHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: { scale: 0.98 },
} as const;

/**
 * Button hover effects - optimized for performance
 */
export const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  tap: { scale: 0.95 },
} as const;

/**
 * Stagger children container - for lists and grids
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item - for individual items in a list
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/**
 * Slide in from left
 */
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Slide in from right
 */
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Modal/Dialog animation
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2 },
  },
};

/**
 * Card hover with shadow effect (CSS only, no layout shift)
 */
export const cardHoverVariants = {
  rest: {
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
} as const;

/**
 * Notification/Alert slide from top
 */
export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -100,
    transition: { duration: 0.3 },
  },
};

/**
 * Number counter animation helper
 */
export const counterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Common viewport settings for scroll-triggered animations
 * Triggers animation when element enters viewport
 */
export const scrollRevealViewport = {
  once: true, // Animate only once
  amount: 0.2, // Trigger when 20% of element is in view
  margin: "0px 0px -100px 0px", // Trigger slightly before element enters view
};
