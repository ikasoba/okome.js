import { build, context } from "esbuild";
import { globby as glob } from "globby";

(async () => {
  (
    await context({
      entryPoints: await glob("{src/*.ts,src/**/*.ts}"),
      format: "esm",
      minify: true,
      sourcemap: "linked",
      outdir: "./src",
    })
  ).watch();

  (
    await context({
      entryPoints: ["src/okome.ts"],
      format: "esm",
      bundle: true,
      minify: true,
      outfile: "./src/okome.min.js",
    })
  ).watch();
})();
