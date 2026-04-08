"use client";

import type { ReactNode } from "react";

type SidebarShellProps = {
  id?: string;
  side: "left" | "right";
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
};

export function SidebarShell({
  id,
  side,
  open,
  title,
  eyebrow,
  onClose,
  footer,
  children,
}: SidebarShellProps) {
  const sideClass = side === "left" ? "sidebar-rail-left" : "sidebar-rail-right";

  return (
    <aside
      id={id}
      className={`sidebar-rail ${sideClass} ${open ? "open" : ""}`}
      aria-hidden={!open}
      aria-label={title}
    >
      <div className="sidebar-rail-inner">
        <div className="sidebar-rail-header">
          {eyebrow ? <p className="sidebar-rail-eyebrow">{eyebrow}</p> : null}
          <button
            className="sidebar-rail-close"
            onClick={onClose}
            aria-label={`Close ${title}`}
            type="button"
          >
            ✕
          </button>
        </div>

        <h2 className="sidebar-rail-title">{title}</h2>

        <div className="sidebar-rail-body">{children}</div>

        {footer ? <div className="sidebar-rail-footer">{footer}</div> : null}
      </div>
    </aside>
  );
}
