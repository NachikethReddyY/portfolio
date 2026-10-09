import { useEffect, useId, useRef, useState } from "react";
import type { CaseStudy } from "../content/types";
import { portfolioImage } from "../content/images";
import { galleryStep } from "../lib/workInteractions";

export function ProjectGallery({
  images,
}: {
  images: NonNullable<CaseStudy["gallery"]>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const captionId = useId();
  const image = selected === null ? null : images[selected];
  useEffect(() => {
    if (selected !== null) {
      if (!dialog.current?.open) dialog.current?.showModal();
    } else if (dialog.current?.open) dialog.current.close();
  }, [selected]);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus({ preventScroll: true });
  };
  return (
    <>
      <div className="project-gallery">
        {images.map((item, index) => (
          <figure key={item.url}>
            <button
              type="button"
              className="gallery-open"
              aria-label={`Enlarge image: ${item.alt || item.caption || `Project image ${index + 1}`}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(index);
              }}
            >
              <img
                src={portfolioImage(item.url, 1400)}
                alt={item.alt}
                loading="lazy"
              />
              <span aria-hidden="true">View image ↗</span>
            </button>
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <dialog
        className="media-lightbox"
        ref={dialog}
        aria-label="Project image viewer"
        aria-describedby={image?.caption ? captionId : undefined}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          setSelected(null);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (selected === null || images.length < 2) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            setSelected(
              galleryStep(
                selected,
                event.key === "ArrowRight" ? 1 : -1,
                images.length,
              ),
            );
          }
        }}
      >
        <div className="lightbox-toolbar">
          <span aria-live="polite">
            {selected === null ? "" : `${selected + 1} / ${images.length}`}
          </span>
          <button type="button" onClick={close} autoFocus>
            Close ×
          </button>
        </div>
        {image && (
          <figure>
            <img
              key={image.url}
              src={portfolioImage(image.url, 2000)}
              alt={image.alt}
            />
            {image.caption && (
              <figcaption id={captionId}>{image.caption}</figcaption>
            )}
          </figure>
        )}
        {images.length > 1 && (
          <div className="lightbox-navigation">
            <button
              type="button"
              onClick={() =>
                setSelected((index) =>
                  galleryStep(index ?? 0, -1, images.length),
                )
              }
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setSelected((index) =>
                  galleryStep(index ?? 0, 1, images.length),
                )
              }
            >
              Next →
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
