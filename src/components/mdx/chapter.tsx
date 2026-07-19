export function Chapter({ marker, title }: { marker: string; title: string }) {
  return (
    <div className="mt-10 mb-6">
      <h3 className="my-0!">{title}</h3>
      <p className="mt-2! mb-0! flex items-center gap-4 font-mono text-xs leading-none tracking-[0.25em] text-primary uppercase">
        {marker}
        <span aria-hidden className="h-px min-w-6 flex-1 bg-primary/20" />
      </p>
    </div>
  );
}
