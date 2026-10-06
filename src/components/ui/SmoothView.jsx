import React from 'react';

export default function SmoothView({ children, className = "" }) {
  return (
    <div className={`animate-slide-up w-full ${className}`}>
      {children}
    </div>
  );
}
