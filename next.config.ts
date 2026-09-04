import type { NextConfig } from "next";

// `inngest/experimental` (pulled in by @inngest/agent-kit) drags in
// @opentelemetry/auto-instrumentations-node and @traceloop/*, which use dynamic
// `require` for runtime patching. Bundling and file-tracing that graph is what
// exhausts memory on Vercel's 2-core/8GB builder during "Collecting build
// traces". Keeping these external leaves them as plain node_modules requires,
// which is both what they need to work correctly and far cheaper to build.
const instrumentationPackages = [
  "@opentelemetry/api",
  "@opentelemetry/auto-instrumentations-node",
  "@opentelemetry/instrumentation",
  "@opentelemetry/instrumentation-winston",
  "@opentelemetry/sdk-node",
  "@traceloop/instrumentation-anthropic",
  "@traceloop/node-server-sdk",
  "require-in-the-middle",
  "import-in-the-middle",
];

const nextConfig: NextConfig = {
  serverExternalPackages: instrumentationPackages,

  outputFileTracingExcludes: {
    "**/*": [
      "./node_modules/@opentelemetry/auto-instrumentations-*/**",
      "./node_modules/@opentelemetry/instrumentation-*/**",
      "./node_modules/@traceloop/**",
      "./node_modules/@next/swc-*/**",
      "./node_modules/@esbuild/**",
      "./node_modules/esbuild/**",
      "./node_modules/typescript/**",
    ],
  },
};

export default nextConfig;
