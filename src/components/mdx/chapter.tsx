import { AccentRule } from "@/components/decorative/accent-rule";

export function Chapter({ marker, title }: { marker: string; title: string }) {
  return (
    <div className="mt-12 mb-6">
      <h3 className="my-0! text-xl md:text-2xl">{title}</h3>
      <p className="mt-2! mb-0! flex items-center gap-4 font-mono text-xs leading-none tracking-eyebrow text-primary uppercase">
        {marker}
        <AccentRule />
      </p>
    </div>
  );
}
