// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { RecoveryAction } from "@/components/recovery-action";

describe("RecoveryAction", () => {
  it("renders a link when given an href", () => {
    render(
      <RecoveryAction icon={ArrowLeft} href="/">
        Retour à l'accueil
      </RecoveryAction>,
    );

    expect(
      screen.getByRole("link", { name: "Retour à l'accueil" }),
    ).toHaveAttribute("href", "/");
  });

  it("renders a real button when given a handler, so Space activates it too", () => {
    const onClick = vi.fn();
    render(
      <RecoveryAction icon={RotateCcw} onClick={onClick}>
        Réessayer
      </RecoveryAction>,
    );

    const button = screen.getByRole("button", { name: "Réessayer" });
    expect(button).toHaveAttribute("type", "button");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("labels itself from the text, not the icon", () => {
    render(
      <RecoveryAction icon={ArrowLeft} href="/">
        Accueil
      </RecoveryAction>,
    );

    expect(screen.getByRole("link")).toHaveAccessibleName("Accueil");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
