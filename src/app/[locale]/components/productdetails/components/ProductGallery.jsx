"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * One large stage image, and under it the thumbnails as a grid of equal
 * tiles with the "make way" interaction: click a tile and it swells in
 * place while every other tile is pushed away from it -- the closer, the
 * further it moves -- and the stage shows that image. Click it again to
 * let everything settle back; click another to hand over.
 *
 * Ported from Codrops' Make Way Grid Effect. The push is computed the same
 * way (linear falloff along the line between tile centres), but spread and
 * range are expressed in tile widths so the feel survives any column width.
 */
const SCALE = 1.6;
const DURATION_MS = 950;
// one long ease-out for everything: no overshoot, nothing snaps
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// the open tile sits just above its neighbours; nothing needs to clear the page chrome
const Z_OPEN = 10;

const map = (v, inMin, inMax, outMin, outMax) =>
  ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

export default function ProductGallery({ images = [], name = "" }) {
  const tileRefs = useRef([]);
  const [expanded, setExpanded] = useState(-1);
  const [placement, setPlacement] = useState({});

  const layout = useCallback((target) => {
    const tiles = tileRefs.current.filter(Boolean);
    if (target === -1) {
      setPlacement({});
      return;
    }
    const focus = tiles[target];
    if (!focus) return;

    const tile = focus.offsetWidth;
    const spread = tile * 0.75; // push at zero distance; adjacent tiles move ~half a tile
    const range = tile * 4; // beyond this nothing moves
    const centre = (el) => ({
      x: el.offsetLeft + el.offsetWidth / 2,
      y: el.offsetTop + el.offsetHeight / 2,
    });
    const fc = centre(focus);

    const next = {};
    tiles.forEach((el, i) => {
      if (i === target) {
        next[i] = { x: 0, y: 0, scale: SCALE, z: Z_OPEN };
        return;
      }
      const c = centre(el);
      const dist = Math.hypot(c.x - fc.x, c.y - fc.y);
      const push = Math.max(map(dist, 0, range, spread, 0), 0);
      const angle = Math.atan2(Math.abs(fc.y - c.y), Math.abs(fc.x - c.x));
      const dx = Math.abs(Math.cos(angle) * push);
      const dy = Math.abs(Math.sin(angle) * push);
      next[i] = {
        x: c.x < fc.x ? -dx : dx,
        y: c.y < fc.y ? -dy : dy,
        scale: 1,
        // closer tiles layer above farther ones, within 1..9
        z: Math.max(1, Math.round(map(Math.min(dist, range), 0, range, Z_OPEN - 1, 1))),
      };
    });
    setPlacement(next);
  }, []);

  const toggle = (i) => {
    const next = expanded === i ? -1 : i;
    setExpanded(next);
    layout(next);
  };

  // positions are measured, so re-measure if the column changes width
  useEffect(() => {
    if (expanded === -1) return;
    const onResize = () => layout(expanded);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [expanded, layout]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && expanded !== -1 && toggle(expanded);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        <ImageOff className="h-12 w-12" aria-hidden="true" />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
        <img src={images[0]} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  const active = expanded === -1 ? 0 : expanded;
  const cols = Math.min(5, Math.max(4, images.length));
  const gap = 10;
  // inner padding keeps a swollen tile on the edge inside the column
  const pad = `calc((100% - ${gap * (cols - 1)}px) / ${cols} * ${(SCALE - 1) / 2})`;

  return (
    <div className="w-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xs sm:aspect-square">
        <img
          key={images[active]}
          src={images[active]}
          alt={name}
          className="enter h-full w-full object-cover"
          draggable={false}
        />
      </div>

    <div
      className="relative mt-3 grid w-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap,
        padding: pad,
      }}
      role="group"
      aria-label={`${name} images`}
    >
      {images.map((src, i) => {
        const p = placement[i] || { x: 0, y: 0, scale: 1, z: 1 };
        const isOpen = expanded === i;
        return (
          <button
            key={src + i}
            ref={(el) => (tileRefs.current[i] = el)}
            type="button"
            aria-pressed={isOpen}
            aria-label={`${name} image ${i + 1}${isOpen ? ", expanded" : ""}`}
            onClick={() => toggle(i)}
            style={{
              transform: `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.scale})`,
              zIndex: p.z,
              transition: `transform ${DURATION_MS}ms ${EASE}, box-shadow ${DURATION_MS}ms ${EASE}`,
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
            className={`relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 ring-2 ring-inset transition-[ring-color] focus:outline-none focus-visible:ring-orange-500 ${
              isOpen ? "shadow-xl ring-orange-500" : active === i ? "ring-orange-500/60" : "ring-transparent"
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
    </div>
  );
}
