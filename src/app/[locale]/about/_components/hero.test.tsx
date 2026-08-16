// @vitest-environment jsdom

import { useReducedMotion } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "@/app/[locale]/about/_components/hero";
import { render, screen } from "@/test-utils";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

const mockedUseReducedMotion = vi.mocked(useReducedMotion);

afterEach(() => {
  mockedUseReducedMotion.mockReturnValue(false);
});

/** Motion writes its pre-entry state inline, so the animated blocks are the divs with one. */
const animatedBlocks = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLDivElement>("div[style]"),
];

describe("Hero", () => {
  it("hides its blocks before they rise into place", () => {
    const { container } = render(<Hero />);
    const blocks = animatedBlocks(container);

    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.every((block) => block.style.opacity === "0")).toBe(true);
  });

  // `style.transform` is `""` when nothing was written and `"none"` only when motion settled it.
  it("settles its blocks with no offset when the user prefers reduced motion", () => {
    mockedUseReducedMotion.mockReturnValue(true);
    const { container } = render(<Hero />);
    const blocks = animatedBlocks(container);

    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.every((block) => block.style.transform === "none")).toBe(
      true,
    );
    expect(blocks.every((block) => block.style.opacity === "1")).toBe(true);
  });

  it("renders the portrait photo and technical specialization line", () => {
    render(<Hero />);
    expect(
      screen.getByAltText("Portrait de Geoffrey Migliacci"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "+7 ans d'expérience · Performance · CQRS · Clean Architecture",
      ),
    ).toBeInTheDocument();
  });

  it("renders the name as the accessible heading", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Geoffrey Migliacci" }),
    ).toBeInTheDocument();
  });

  it("renders the job title, technical positioning, and personal tagline", () => {
    render(<Hero />);
    expect(screen.getByText("Ingénieur logiciel senior")).toBeInTheDocument();
    expect(
      screen.getByText(/je conçois des systèmes \.net/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/j'écris sur le code, les langues/i),
    ).toBeInTheDocument();
  });

  it("renders the prose that carries the page beyond the identity block", () => {
    render(<Hero />);
    // Matched on the platform name: the sentence around it will get reworded.
    expect(screen.getByText(/SA:MP/)).toBeInTheDocument();
    expect(screen.getByText(/randonner quelque part/i)).toBeInTheDocument();
  });

  it("closes on an invitation to write, above the contact links", () => {
    render(<Hero />);
    const invitation = screen.getByText(/écrivez-moi/i);
    const email = screen.getByRole("button", {
      name: "Me contacter par email",
    });

    expect(invitation).toBeInTheDocument();
    expect(
      invitation.compareDocumentPosition(email) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  // The header nav and the footer both already reach /blog; without this the cut reverts.
  it("does not render a blog CTA", () => {
    render(<Hero />);
    expect(
      screen.queryByRole("button", { name: /lire les billets/i }),
    ).not.toBeInTheDocument();
  });
});
