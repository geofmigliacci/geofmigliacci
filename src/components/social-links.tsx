import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { person, social } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Me contacter par email"
        nativeButton={false}
        render={<a href={person.email} />}
      >
        <FaEnvelope aria-hidden />
      </Button>
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="GitHub"
        nativeButton={false}
        render={<a href={social.github} target="_blank" rel="noreferrer" />}
      >
        <FaGithub aria-hidden />
      </Button>
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="LinkedIn"
        nativeButton={false}
        render={<a href={social.linkedin} target="_blank" rel="noreferrer" />}
      >
        <FaLinkedinIn aria-hidden />
      </Button>
    </div>
  );
}
