'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function MotionFadeIn({
  children,
  delay = 0,
  duration = 0.45,
  y = 16,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({
  children,
  stagger = 0.08,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className = '',
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
