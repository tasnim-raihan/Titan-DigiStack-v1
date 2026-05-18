import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  isActive: boolean;
  onClose?: () => void;
}

export function useFocusTrap<T extends HTMLElement>({ isActive, onClose }: FocusTrapProps) {
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Cache the currently focused element to restore it on unmount/close
    previousFocusRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Find all focusable nodes inside our trapped container
    const focusableElementsSelector = 
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    
    const focusableElements = container.querySelectorAll<HTMLElement>(focusableElementsSelector);
    
    // Focus the first focusable item initially
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onClose) {
          onClose();
        }
        return;
      }

      if (e.key !== 'Tab') return;

      const currentFocusable = container.querySelectorAll<HTMLElement>(focusableElementsSelector);
      if (currentFocusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = currentFocusable[0];
      const lastElement = currentFocusable[currentFocusable.length - 1];

      // Shift + Tab focus wrapping
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } 
      // Tab focus wrapping
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the cached original element once HUD is closed
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, onClose]);

  return containerRef;
}
