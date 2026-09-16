"use client";

import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * Product image gallery for the details page.
 *
 * The main image fills its column. Thumbnails sit in a strip beneath it and
 * behave like tiles on a board: hover one and it swells up over its
 * neighbours on a springy curve, the neighbours give way a little, and the
 * main image previews it. Click to keep it. Drag or scroll the strip when
 * there are more thumbnails than fit.
 */
export default function ProductGallery({ images = [], name = "" }) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState({});

  // the strip pans by dragging; plain scroll and touch keep working too
  const stripRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  useEffect(() => {
    if (selected > images.length - 1) setSelected(0);
  }, [images.length, selected]);

  const shown = hovered ?? selected;
  const current = images[shown];

  const onPointerDown = (e) => {
    const el = stripRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    const el = stripRef.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    el.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
  };

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        <ImageOff className="h-12 w-12" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {/* main image: fills the column, cross-fades between views */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={i === 0 ? name : `${name} ${i + 1}`}
            onLoad={() => setLoaded((l) => ({ ...l, [i]: true }))}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
              i === shown ? "z-10 scale-100 opacity-100" : "z-0 scale-[1.03] opacity-0"
            }`}
            draggable={false}
          />
        ))}
        {!loaded[shown] && <div className="skeleton absolute inset-0 rounded-none" aria-hidden="true" />}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {shown + 1} / {images.length}
          </span>
        )}
      </div>

      {/* thumbnail strip */}
      {images.length > 1 && (
        <div
          ref={stripRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            endDrag();
            setHovered(null);
          }}
          className="scrollbar-none -mx-2 flex cursor-grab select-none gap-3 overflow-x-auto px-2 py-4 active:cursor-grabbing"
          role="listbox"
          aria-label={`${name} images`}
        >
          {images.map((src, i) => {
            const isHovered = hovered === i;
            const isSelected = selected === i;
            const isNeighbour = hovered !== null && Math.abs(hovered - i) === 1;
            return (
              <button
                key={src + i}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                onClick={() => {
                  // a drag that ended on a tile is not a pick
                  if (drag.current.moved) return;
                  setSelected(i);
                }}
                style={{
                  transform: isHovered
                    ? "scale(1.45) translateY(-6px)"
                    : isNeighbour
                      ? "scale(0.92)"
                      : "scale(1)",
                  transitionTimingFunction: isHovered
                    ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 transition-transform duration-500 focus:outline-none ${
                  isHovered ? "z-20 shadow-xl shadow-orange-200/60" : "z-0"
                } ${
                  isSelected
                    ? "ring-2 ring-orange-500 ring-offset-2"
                    : "ring-1 ring-gray-200"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
