'use client';

import { useEffect, useRef } from 'react';
import { Close, lockScroll, unlockScroll } from './ui';

/**
 * Right-hand drawer used for service details, package booking and legal text.
 * Pauses smooth scrolling while open, traps Escape, and returns focus on close.
 */
// Open overlays, most recent last, so Escape only closes the top one.
export const overlayStack = [];

export default function Drawer({ open, onClose, title, sub, label, top = false, center = false, children }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    lockScroll();
    const token = {};
    overlayStack.push(token);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = e => {
      if (e.key === 'Escape' && overlayStack[overlayStack.length - 1] === token) onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      overlayStack.splice(overlayStack.indexOf(token), 1);
      unlockScroll();
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <div className={`scrim${open ? ' open' : ''}${top ? ' top' : ''}${center ? ' center' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={ref}
        className={`drawer on-light${open ? ' open' : ''}${top ? ' top' : ''}${center ? ' center' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label || title}
        aria-hidden={!open}
        data-lenis-prevent
      >
        <div className="drawer-head">
          <div>
            {sub && <p className="sub">{sub}</p>}
            <h2 className="disp">{title}</h2>
          </div>
          <button ref={closeRef} type="button" className="x" onClick={onClose} aria-label="Close">
            <Close />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}
