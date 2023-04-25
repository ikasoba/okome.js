import {globby as glob} from "globby"
import {build} from "esbuild"

(async() => {

build({
  entryPoints: await glob("src/*{ts,tsx}"),
  outdir: "src/",
  allowOverwrite: true,
  jsx: "transform",
  bundle: true,
  jsxFactory: "Okome.createElement",
  inject: ["./jsx-header.ts"]
})

})()