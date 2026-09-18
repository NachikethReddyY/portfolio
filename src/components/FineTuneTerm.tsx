import { useId, useState, useRef, useLayoutEffect } from "react";

export function FineTuneTerm() {
  const id = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = !dismissed && (hovered || focused || tapped);
  const diagram = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const node = diagram.current;
      if (!node) return;
      node.style.translate = "0px 0px";
      const bounds = node.getBoundingClientRect();
      const shift = Math.max(
        12 - bounds.left,
        Math.min(0, window.innerWidth - 12 - bounds.right),
      );
      node.style.translate = `${shift}px 0px`;
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [open]);
  return (
    <span
      className="fine-tune-term"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setHovered(true);
          setDismissed(false);
        }
      }}
      onPointerLeave={() => {
        setHovered(false);
        setDismissed(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            setFocused(true);
            setDismissed(false);
          }
        }}
        onBlur={() => {
          setFocused(false);
          setTapped(false);
          setDismissed(false);
        }}
        onClick={() => {
          setTapped((value) => !value);
          setDismissed(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setDismissed(true);
            setTapped(false);
          }
        }}
      >
        fine-tune
      </button>
      <span
        ref={diagram}
        className="fine-tune-diagram"
        id={id}
        hidden={!open}
        role="note"
      >
        <span className="fine-tune-step">Task examples</span>
        <span aria-hidden="true">→</span>
        <span className="fine-tune-step">Train adapters</span>
        <span aria-hidden="true">→</span>
        <span className="fine-tune-step">Evaluate</span>
        <small>Keep a separate test set. Compare before and after.</small>
      </span>
    </span>
  );
}
