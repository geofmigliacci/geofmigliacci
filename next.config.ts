import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` would otherwise prepend a managed block to AGENTS.md, restating its opening paragraph.
  agentRules: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      { source: "/articles", destination: "/blog", permanent: true },
      {
        source: "/articles/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-mdx-toc", { skipDepth: [1, 4, 5, 6] }],
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
