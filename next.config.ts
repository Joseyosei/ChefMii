import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(process.cwd(), "src/visual-edits/component-tagger-loader.cjs");

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [
          {
            loader: LOADER,
            options: {},
          },
        ],
      },
    },
  },
};

export default nextConfig;
