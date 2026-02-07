import esbuild from "esbuild";
import path from "path";

esbuild.build({
  entryPoints: [path.join(process.cwd(), "src", "index.jsx")],
  bundle: true,
  outfile: path.join(process.cwd(), "dist", "bundle.js"),
  platform: "browser",
  format: "iife",
  loader: {
    ".js": "jsx",
    ".jsx": "jsx"
  }
}).catch(() => process.exit(1));
