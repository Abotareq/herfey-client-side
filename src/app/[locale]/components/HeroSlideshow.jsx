"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import woodwork from "@public/hero/woodwork.jpg";
import baskets from "@public/hero/baskets.jpg";
import engraving from "@public/hero/engraving.jpg";
import leather from "@public/hero/leather.jpg";
import palmBaskets from "@public/hero/palm-baskets.jpg";

// Slide transition after Codrops' "Slideshow Animations" (demo 1): the
// outgoing slide leaves vertically while its image drifts the other way, and
// the incoming slide enters from the opposite edge with the same parallax.
// https://github.com/codrops/SlideshowAnimations

const NEXT = 1;
const PREV = -1;
const AUTOPLAY_MS = 5000;

const SLIDES = [
  { key: "woodwork", src: woodwork },
  { key: "baskets", src: baskets },
  { key: "engraving", src: engraving },
  { key: "leather", src: leather },
  { key: "palm-baskets", src: palmBaskets },
];

gsap.registerPlugin(Observer);

export default function HeroSlideshow() {
  const t = useTranslations("Hero");
  const rootRef = useRef(null);
  const slideRefs = useRef([]);
  const innerRefs = useRef([]);
  const current = useRef(0);
  const isAnimating = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    const slides = slideRefs.current;
    const inners = innerRefs.current;
    const total = slides.length;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    slides[current.current].classList.add("hero-slide--current");

    const navigate = (direction) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const previous = current.current;
      current.current = (previous + direction + total) % total;

      const currentSlide = slides[previous];
      const currentInner = inners[previous];
      const upcomingSlide = slides[current.current];
      const upcomingInner = inners[current.current];

      gsap
        .timeline({
          defaults: {
            duration: reduceMotion ? 0 : 1.5,
            ease: "power4.inOut",
          },
          onStart: () => {
            upcomingSlide.classList.add("hero-slide--current");
            upcomingSlide.removeAttribute("aria-hidden");
          },
          onComplete: () => {
            currentSlide.classList.remove("hero-slide--current");
            currentSlide.setAttribute("aria-hidden", "true");
            isAnimating.current = false;
          },
        })
        .addLabel("start", 0)
        .to(currentSlide, { yPercent: -direction * 100 }, "start")
        .to(currentInner, { yPercent: direction * 30 }, "start")
        .fromTo(
          upcomingSlide,
          { yPercent: direction * 100 },
          { yPercent: 0 },
          "start"
        )
        .fromTo(
          upcomingInner,
          { yPercent: -direction * 30 },
          { yPercent: 0 },
          "start"
        );
    };

    const restartAutoplay = () => {
      clearInterval(timer.current);
      if (reduceMotion) return;
      timer.current = setInterval(() => navigate(NEXT), AUTOPLAY_MS);
    };
    const stopAutoplay = () => clearInterval(timer.current);

    const next = () => {
      navigate(NEXT);
      restartAutoplay();
    };
    const prev = () => {
      navigate(PREV);
      restartAutoplay();
    };

    const root = rootRef.current;
    const prevBtn = root.querySelector("[data-hero-prev]");
    const nextBtn = root.querySelector("[data-hero-next]");
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    // Horizontal drag / swipe inside the slideshow. Wheel and vertical swipe
    // are deliberately left out (see `touch-pan-y`) so the slideshow never
    // captures the page scroll. Swiping towards the reading direction's end
    // goes forward, so it is mirrored for Arabic.
    const rtl = getComputedStyle(root).direction === "rtl";
    const observer = Observer.create({
      target: root,
      type: "touch,pointer",
      onLeft: rtl ? prev : next,
      onRight: rtl ? next : prev,
      tolerance: 10,
    });

    const onKey = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") prev();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next();
    };
    // Autoplay keeps running while the mouse rests on the hero (a 70vh
    // block is where the cursor usually sits); only keyboard focus pauses it.
    root.addEventListener("keydown", onKey);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", restartAutoplay);

    restartAutoplay();

    return () => {
      stopAutoplay();
      observer.kill();
      prevBtn.removeEventListener("click", prev);
      nextBtn.removeEventListener("click", next);
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("focusin", stopAutoplay);
      root.removeEventListener("focusout", restartAutoplay);
      gsap.killTweensOf([...slides, ...inners]);
    };
  }, []);

  return (
    <section className="mx-4 my-8 md:mx-12">
      <div
        ref={rootRef}
        tabIndex={0}
        aria-roledescription="carousel"
        className="hero-slides relative h-[70vh] min-h-[420px] max-h-[820px] w-full select-none touch-pan-y overflow-hidden rounded-2xl bg-orange-950 shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-orange-500/60"
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.key}
            ref={(el) => (slideRefs.current[i] = el)}
            className="hero-slide"
            aria-hidden={i !== 0}
          >
            <div
              ref={(el) => (innerRefs.current[i] = el)}
              className="hero-slide__img"
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 92vw"
                priority={i === 0}
                placeholder="blur"
                draggable={false}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="hero-slide__copy absolute inset-x-0 bottom-0 p-6 pe-24 text-white sm:p-10 sm:pe-36 md:p-14 md:pe-44">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300">
                {t("eyebrow")}
              </p>
              <h2 className="max-w-2xl text-3xl font-bold leading-tight drop-shadow sm:text-4xl md:text-5xl">
                {t(`slides.${slide.key}.title`)}
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base md:text-lg">
                {t(`slides.${slide.key}.text`)}
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 end-6 z-10 flex gap-2 sm:bottom-10 sm:end-10 md:bottom-14 md:end-14">
          <button
            type="button"
            data-hero-prev
            aria-label={t("prev")}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lg text-gray-900 shadow transition-colors hover:bg-orange-600 hover:text-white"
          >
            ↑
          </button>
          <button
            type="button"
            data-hero-next
            aria-label={t("next")}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lg text-gray-900 shadow transition-colors hover:bg-orange-600 hover:text-white"
          >
            ↓
          </button>
        </div>
      </div>
    </section>
  );
}
