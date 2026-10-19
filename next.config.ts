import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // NOTE: PH Healthcare used `output: "export"`. Removed here because the FSM
  // dashboards have many dynamic routes ([id]) that cannot be pre-generated.
};

export default nextConfig;
