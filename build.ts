import { build, context } from "esbuild";
import { globby as glob } from "globby";

const flag = process.argv.slice(2).at(-1);

(async () => {
  const contexts = [
    await context({
      entryPoints: await glob("{src/*.ts,src/**/*.ts}"),
      format: "esm",
      minify: true,
      sourcemap: "linked",
      outdir: "./src",
    }),
    await context({
      entryPoints: ["src/okome.ts"],
      format: "esm",
      bundle: true,
      minify: true,
      outfile: "./src/okome.min.js",
    }),
  ];

  if (flag == "build" || !flag) {
    await Promise.all(contexts.map((x) => x.rebuild()));
  } else {
    await Promise.all(contexts.map((x) => x.watch()));
  }

  contexts.map((x) => x.dispose());
})();
