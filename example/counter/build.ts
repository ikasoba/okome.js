import { globby as glob } from "globby";
import { build, context } from "esbuild";

const flag = process.argv.slice(2).at(-1);

(async () => {
  const contexts = [
    await context({
      entryPoints: await glob("src/*.{ts,tsx}"),
      outdir: "src/",
      allowOverwrite: true,
      jsx: "transform",
      bundle: true,
      minify: true,
      sourcemap: "inline",
    }),
  ];
  if (flag == "build" || !flag) {
    await Promise.all(contexts.map((x) => x.rebuild()));
  } else {
    await Promise.all(contexts.map((x) => x.watch()));
  }

  contexts.map((x) => x.dispose());
})();
