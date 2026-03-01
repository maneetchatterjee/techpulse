'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  rate?: number; // increment per second
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: boolean;
}

export default function AnimatedCounter({
  value,
  rate = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  format = true,
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(value);
  const startRef = useRef(value);
  const startTimeRef = useRef(Date.now());
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = value;
    startTimeRef.current = Date.now();
    setCurrent(value);
  }, [value]);

  useEffect(() => {
    if (rate === 0) return;

    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setCurrent(startRef.current + elapsed * rate);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [rate]);

  const displayValue = format
    ? current >= 1e12
      ? (current / 1e12).toFixed(decimals) + 'T'
      : current >= 1e9
      ? (current / 1e9).toFixed(decimals) + 'B'
      : current >= 1e6
      ? (current / 1e6).toFixed(decimals) + 'M'
      : current >= 1e3
      ? (current / 1e3).toFixed(decimals) + 'K'
      : current.toFixed(decimals)
    : current.toFixed(decimals);

  return (
    <span className={`font-mono neon-text-cyan text-cyan-400 ${className}`}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
