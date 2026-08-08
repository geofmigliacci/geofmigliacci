import type { StaticImageData } from "next/image";

/** The blur fields are not padding: `placeholder="blur"` makes `next/image` throw without them. */
export const testCover: StaticImageData = {
  src: "/_next/static/media/cover.jpg",
  width: 1712,
  height: 812,
  blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
  blurWidth: 8,
  blurHeight: 4,
};

export const testCoverAlt = "Un lac et des montagnes vus depuis une fenêtre.";
