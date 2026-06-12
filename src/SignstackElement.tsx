import { createElement, useEffect, useRef } from 'react';

type AttributeValue = string | null | undefined;
export type EventHandler = (event: Event) => void;

interface SignstackElementProps {
  /** Custom element tag name, e.g. "signstack-participant". */
  tag: string;
  /** Attributes to set on the element. Empty/undefined values remove the attribute. */
  attributes?: Record<string, AttributeValue>;
  /** CustomEvent names → handlers, bound via addEventListener. */
  events?: Record<string, EventHandler>;
}

/**
 * Thin wrapper for a SignStack web component. We set string attributes
 * imperatively and bind CustomEvents via addEventListener, which React's
 * synthetic event system doesn't cover.
 */
export function SignstackElement({ tag, attributes = {}, events = {} }: SignstackElementProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (const [key, value] of Object.entries(attributes)) {
      if (value === undefined || value === null || value === '') {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    }
  }, [attributes]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const entries = Object.entries(events);
    for (const [name, handler] of entries) el.addEventListener(name, handler);
    return () => {
      for (const [name, handler] of entries) el.removeEventListener(name, handler);
    };
  }, [events]);

  return createElement(tag, { ref });
}
