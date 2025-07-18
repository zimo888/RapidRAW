// src/components/ui/Slider.jsx

import React, { useState, useEffect, useRef } from 'react';

/**
 * A reusable slider component with a clickable reset icon and an interactive handle.
 * The slider's thumb animates with an "ease-in-out" effect when the value is set programmatically.
 * Double-clicking the label, value, or slider track will also reset the value.
 *
 * @param {string} label - The text label for the slider.
 * @param {number|string} value - The current value of the slider.
 * @param {function} onChange - The callback function to execute on value change.
 * @param {number|string} min - The minimum value of the slider.
 * @param {number|string} max - The maximum value of the slider.
 * @param {number|string} step - The increment step of the slider.
 * @param {number} [defaultValue=0] - The value to reset to on icon click or double-click. Defaults to 0.
 */
const Slider = ({ label, value, onChange, min, max, step, defaultValue = 0 }) => {
  const [displayValue, setDisplayValue] = useState(Number(value));
  const [isDragging, setIsDragging] = useState(false);
  const animationFrameRef = useRef();

  useEffect(() => {
    const handleDragEndGlobal = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleDragEndGlobal);
      window.addEventListener('touchend', handleDragEndGlobal);
    }

    return () => {
      window.removeEventListener('mouseup', handleDragEndGlobal);
      window.removeEventListener('touchend', handleDragEndGlobal);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const startValue = displayValue;
    const endValue = Number(value);
    const duration = 300;
    let startTime = null;

    const easeInOut = (t) => t * t * (3 - 2 * t);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const linearFraction = Math.min(progress / duration, 1);

      const easedFraction = easeInOut(linearFraction);

      const currentValue = startValue + (endValue - startValue) * easedFraction;
      setDisplayValue(currentValue);

      if (linearFraction < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, isDragging]);

  const handleReset = () => {
    const syntheticEvent = {
      target: {
        value: defaultValue,
      },
    };
    onChange(syntheticEvent);
  };

  const handleChange = (e) => {
    setDisplayValue(Number(e.target.value));
    onChange(e);
  };

  const stepStr = String(step);
  const decimalPlaces = stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
  
  const numericValue = isNaN(Number(value)) ? 0 : Number(value);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  const ResetIcon = () => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-text-secondary hover:text-text-primary transition-colors duration-150"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );

  return (
    <div className="mb-2 group">
      <div className="flex justify-between items-center mb-1">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onDoubleClick={handleReset}
          title={`Double-click to reset ${label.toLowerCase()}`}
        >
          <label className="text-sm font-medium text-text-secondary select-none">{label}</label>
          <button
            onClick={handleReset}
            className="p-0.5 rounded hover:bg-card-active transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 active:scale-95"
            title={`Reset to ${defaultValue}`}
            type="button"
          >
            <ResetIcon />
          </button>
        </div>
        <span 
          className="text-sm text-text-primary w-12 text-right select-none cursor-pointer"
          onDoubleClick={handleReset}
          title={`Double-click to reset to ${defaultValue}`}
        >
          {numericValue.toFixed(decimalPlaces)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={handleChange}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onDoubleClick={handleReset}
        className={`w-full h-1.5 bg-card-active rounded-full appearance-none cursor-pointer slider-input ${isDragging ? 'slider-thumb-active' : ''}`}
      />
    </div>
  );
};

export default Slider;