"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./scrollWheelPicker.module.css";

interface ScrollWheelPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
  padZero?: boolean;
}

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

export default function ScrollWheelPicker({
  value,
  onChange,
  min,
  max,
  label,
  padZero = true,
}: ScrollWheelPickerProps) {
  const range = max - min + 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedValue, setTypedValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragStartY = useRef(0);
  const dragStartValue = useRef(0);
  const lastVelocity = useRef(0);
  const lastMoveTime = useRef(0);
  const lastMoveY = useRef(0);
  const animFrameRef = useRef<number>(0);
  const momentumRef = useRef<number>(0);

  const formatValue = useCallback(
    (v: number) => (padZero && v < 10 ? `0${v}` : `${v}`),
    [padZero]
  );

  const wrapValue = useCallback(
    (v: number) => {
      let result = v;
      while (result < min) result += range;
      while (result > max) result -= range;
      return result;
    },
    [min, max, range]
  );

  // Generate visible items (current + neighbors)
  const getVisibleItems = useCallback(() => {
    const items: { value: number; offset: number }[] = [];
    const half = Math.floor(VISIBLE_ITEMS / 2);
    for (let i = -half; i <= half; i++) {
      items.push({
        value: wrapValue(value + i),
        offset: i,
      });
    }
    return items;
  }, [value, wrapValue]);

  // Mouse/Touch drag handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isTyping) return;
      e.preventDefault();
      setIsDragging(true);
      dragStartY.current = e.clientY;
      dragStartValue.current = value;
      lastMoveTime.current = Date.now();
      lastMoveY.current = e.clientY;
      lastVelocity.current = 0;

      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
        momentumRef.current = 0;
      }

      const el = containerRef.current;
      if (el) {
        el.setPointerCapture(e.pointerId);
      }
    },
    [isTyping, value]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const now = Date.now();
      const dt = now - lastMoveTime.current;
      if (dt > 0) {
        lastVelocity.current = (e.clientY - lastMoveY.current) / dt;
      }
      lastMoveTime.current = now;
      lastMoveY.current = e.clientY;

      const deltaY = e.clientY - dragStartY.current;
      const steps = Math.round(-deltaY / ITEM_HEIGHT);
      const newValue = wrapValue(dragStartValue.current + steps);
      if (newValue !== value) {
        onChange(newValue);
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(8);
        }
      }
    },
    [isDragging, value, onChange, wrapValue]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      const el = containerRef.current;
      if (el) {
        el.releasePointerCapture(e.pointerId);
      }

      // Momentum scrolling
      const velocity = lastVelocity.current;
      if (Math.abs(velocity) > 0.3) {
        let currentVelocity = velocity;
        let currentValue = value;

        const animate = () => {
          currentVelocity *= 0.92;
          if (Math.abs(currentVelocity) < 0.01) return;

          const step = currentVelocity * 16;
          if (Math.abs(step) >= ITEM_HEIGHT * 0.3) {
            const direction = step > 0 ? -1 : 1;
            currentValue = wrapValue(currentValue + direction);
            onChange(currentValue);
            if (navigator.vibrate) {
              navigator.vibrate(5);
            }
          }

          momentumRef.current = requestAnimationFrame(animate);
        };
        momentumRef.current = requestAnimationFrame(animate);
      }
    },
    [isDragging, value, onChange, wrapValue]
  );

  // Mouse wheel handler
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const newValue = wrapValue(value + direction);
      onChange(newValue);
      if (navigator.vibrate) {
        navigator.vibrate(5);
      }
    },
    [value, onChange, wrapValue]
  );

  // Keyboard support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isTyping) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        onChange(wrapValue(value - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onChange(wrapValue(value + 1));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsTyping(true);
        setTypedValue(formatValue(value));
      }
    },
    [isTyping, value, onChange, wrapValue, formatValue]
  );

  // Tap to enter typing mode
  const handleTap = useCallback(() => {
    if (!isDragging) {
      setIsTyping(true);
      setTypedValue(formatValue(value));
    }
  }, [isDragging, value, formatValue]);

  // Handle typed input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (raw.length <= 2) {
        setTypedValue(raw);
      }
    },
    []
  );

  const commitTypedValue = useCallback(() => {
    const parsed = parseInt(typedValue, 10);
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      onChange(parsed);
    }
    setIsTyping(false);
    setTypedValue("");
  }, [typedValue, min, max, onChange]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitTypedValue();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsTyping(false);
        setTypedValue("");
      }
    },
    [commitTypedValue]
  );

  // Focus input when typing mode activates
  useEffect(() => {
    if (isTyping && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isTyping]);

  // Cleanup momentum on unmount
  useEffect(() => {
    return () => {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
      }
    };
  }, []);

  const visibleItems = getVisibleItems();
  const halfVisible = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div className={styles.pickerWrapper}>
      {label && <span className={styles.pickerLabel}>{label}</span>}
      <div
        className={`${styles.pickerContainer} ${isDragging ? styles.dragging : ""}`}
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        style={{
          height: ITEM_HEIGHT * VISIBLE_ITEMS,
          touchAction: "none",
        }}
      >
        {/* Gradient masks */}
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />

        {/* Selection highlight */}
        <div
          className={styles.selectionHighlight}
          style={{
            top: ITEM_HEIGHT * halfVisible,
            height: ITEM_HEIGHT,
          }}
        />

        {/* Items */}
        <div className={styles.itemsContainer}>
          {visibleItems.map((item) => {
            const isSelected = item.offset === 0;
            const distance = Math.abs(item.offset);
            const opacity = isSelected ? 1 : Math.max(0.2, 1 - distance * 0.25);
            const scale = isSelected ? 1 : Math.max(0.75, 1 - distance * 0.08);

            return (
              <div
                key={`${item.value}-${item.offset}`}
                className={`${styles.pickerItem} ${isSelected ? styles.pickerItemSelected : ""}`}
                style={{
                  height: ITEM_HEIGHT,
                  opacity,
                  transform: `scale(${scale})`,
                }}
              >
                {isTyping && isSelected ? (
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={styles.typingInput}
                    value={typedValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={commitTypedValue}
                    maxLength={2}
                  />
                ) : (
                  <span
                    onClick={isSelected ? handleTap : undefined}
                    className={isSelected ? styles.tappable : undefined}
                  >
                    {formatValue(item.value)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
