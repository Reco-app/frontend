import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack(config: any) {
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ["@svgr/webpack"],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: "/customers",
      },
      {
        source: "/funcionarios",
        destination: "/employees",
      },
      {
        source: "/clientes",
        destination: "/customers",
      },
      {
        source: "/clientes/:id",
        destination: "/customers/:id",
      },
      {
        source: "/veiculos",
        destination: "/vehicles",
      },
      {
        source: "/veiculos/:id",
        destination: "/vehicles/:id",
      },
      {
        source: "/estoque",
        destination: "/inventory",
      },
      {
        source: "/estoque/:id",
        destination: "/inventory/:id",
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
