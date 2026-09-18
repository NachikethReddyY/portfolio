import type { ReactNode } from "react";

export type DeviceKind = "browser" | "desktop" | "phone" | "artwork";
/** Frames supply platform context; their children retain the original media and semantics. */
export function DeviceFrame({
  kind,
  title,
  children,
}: {
  kind: DeviceKind;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`device-frame device-${kind}`}>
      {kind === "browser" && (
        <div className="device-toolbar" aria-hidden="true">
          <span className="device-dots">
            <i />
            <i />
            <i />
          </span>
          <span>{title}</span>
          <span className="device-toolbar-end">+</span>
        </div>
      )}
      {kind === "phone" && (
        <span className="device-island" aria-hidden="true" />
      )}
      <div className="device-screen">{children}</div>
      {kind === "phone" && <span className="device-home" aria-hidden="true" />}
      {kind === "desktop" && (
        <span className="device-stand" aria-hidden="true" />
      )}
    </div>
  );
}
