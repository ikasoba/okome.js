import { globby as glob } from "globby";
import { build, context } from "esbuild";

(async () => {
  (
    await context({
      entryPoints: await glob("src/*.{ts,tsx}"),
      outdir: "src/",
      allowOverwrite: true,
      jsx: "transform",
      bundle: true,
      minify: true,
      sourcemap: "inline",
      inject: ["./jsx-header.ts"],
    })
  ).watch();
})();
