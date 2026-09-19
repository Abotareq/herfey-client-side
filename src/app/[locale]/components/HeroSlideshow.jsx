"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ArrowUpRight, ArrowUp, ArrowDown } from "lucide-react";
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
    <section className="mx-4 mb-6 mt-4 md:mx-8 md:mb-10 md:mt-6">
      <div
        ref={rootRef}
        tabIndex={0}
        aria-roledescription="carousel"
        className="hero-slides relative h-[72vh] min-h-[440px] max-h-[840px] w-full select-none touch-pan-y overflow-hidden rounded-[2rem] bg-orange-950 shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-orange-500/60"
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
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/85 via-orange-950/25 to-transparent" />
            </div>

            <div className="hero-slide__copy absolute inset-x-0 bottom-0 p-6 pe-28 text-white sm:p-10 sm:pe-40 md:p-14 md:pe-48">
              <h2 className="max-w-2xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
                {t(`slides.${slide.key}.title`)}
              </h2>
              <p className="mt-4 max-w-lg text-sm text-orange-50/90 sm:text-base md:text-lg">
                {t(`slides.${slide.key}.text`)}
              </p>
              <Link href="/products" className="btn btn-on-dark mt-7">
                {t("cta")}
                <span className="btn-disc" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 end-6 z-10 flex gap-2 sm:bottom-10 sm:end-10 md:bottom-14 md:end-14">
          <button
            type="button"
            data-hero-prev
            aria-label={t("prev")}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 ring-inset backdrop-blur-md transition duration-300 ease-out-soft hover:bg-white hover:text-gray-900 active:scale-95"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            data-hero-next
            aria-label={t("next")}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 ring-inset backdrop-blur-md transition duration-300 ease-out-soft hover:bg-white hover:text-gray-900 active:scale-95"
          >
            <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  );
}
