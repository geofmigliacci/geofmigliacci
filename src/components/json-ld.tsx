import type { Graph } from "schema-dts";

export function JsonLd({ data }: { data: Graph }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js's documented pattern for injecting JSON-LD
      dangerouslySetInnerHTML={{
        // A literal `</script>` in a title would close this element early.
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
