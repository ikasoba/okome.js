import { build } from "esbuild";
import { globby as glob } from "globby";

(async() => {

build({
  entryPoints: await glob("{src/*.ts,src/**/*.ts}"),
  format: "esm",
  minify: true,
  outdir: "./src",
});

build({
  entryPoints: ["src/okome.ts"],
  format: "esm",
  minify: true,
  bundle: true,
  outfile: "./src/okome.min.js",
});

})()