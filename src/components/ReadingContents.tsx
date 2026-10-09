import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { currentSection, type ReadingSection } from "../lib/readingContents";

export function ReadingContents({
  sections,
  label,
}: {
  sections: ReadingSection[];
  label: string;
}) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const measure = () => {
      frame = 0;
      setActive(
        currentSection(
          headings.map((element) => ({
            id: element.id,
            top: element.getBoundingClientRect().top,
          })),
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Images and rich content can change section positions after arrival.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);
  if (!sections.length) return null;
  return (
    <aside className="reading-contents">
      <p>On this page</p>
      <nav aria-label={label}>
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`#${section.id}`}
            aria-current={active === section.id ? "location" : undefined}
          >
            {section.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
