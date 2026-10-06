import React from 'react';

export default function SafeContainer({ children, className = "" }) {
  return (
    <div className={`card-babyblue p-6 ${className}`}>
      {children}
    </div>
  );
}
