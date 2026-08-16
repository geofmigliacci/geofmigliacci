"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { EASE } from "@/lib/motion";

/** A fixed composition: one portrait then two landscapes, and a fourth has no cell. */
const ABOUT_PHOTOS = [
  {
    src: "/about/20220714_200312.jpg",
    altKey: "viareggio",
    cell: "aspect-[2/3] lg:aspect-auto lg:row-span-2",
    sizes: "(min-width: 1024px) 15rem, 100vw",
  },
  {
    src: "/about/20220715_144923.jpg",
    altKey: "angera",
    cell: "aspect-[3/2] lg:aspect-auto",
    sizes: "(min-width: 1024px) 18rem, 100vw",
  },
  {
    src: "/about/20230914_100736.jpg",
    altKey: "isolaBella",
    cell: "aspect-[16/9] lg:aspect-auto",
    sizes: "(min-width: 1024px) 18rem, 100vw",
  },
];

const PHOTO_STAGGER = 0.12;
const SLIDE_FROM = 32;

export function AboutPhotos() {
  const t = useTranslations("about.photos");
  const reducedMotion = useReducedMotion();

  if (ABOUT_PHOTOS.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 lg:aspect-[4/3] lg:grid-cols-[5fr_6fr] lg:grid-rows-2">
      {ABOUT_PHOTOS.map((photo, index) => (
        <motion.div
          key={photo.src}
          className={`group relative overflow-hidden will-change-transform ${photo.cell}`}
          initial={reducedMotion ? false : { opacity: 0, x: SLIDE_FROM }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.7,
            ease: EASE,
            delay: index * PHOTO_STAGGER,
          }}
        >
          <Image
            src={photo.src}
            alt={t(photo.altKey)}
            fill
            sizes={photo.sizes}
            loading="eager"
            fetchPriority="high"
            className="object-cover saturate-[0.85] contrast-[1.05] photo-lift"
          />
        </motion.div>
      ))}
    </div>
  );
}
