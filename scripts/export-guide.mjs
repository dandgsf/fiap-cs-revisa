import { cpSync, existsSync, mkdirSync, lstatSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { files } from "./project-files.mjs";

const root = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
const destination = resolve(process.argv[2] || "output/fiap-cs-revisa");
const within = (parent, child) => { const path = relative(parent, child); return path === "" || (!path.startsWith(".." + sep) && path !== ".." && !isAbsolute(path)); };
if (existsSync(destination)) throw new Error("O destino já existe. Escolha uma pasta nova; nenhum arquivo foi alterado.");
if (within(destination, root)) throw new Error("O destino não pode conter a pasta de origem.");
for (const file of files) {
  const source = join(root, file);
  if (lstatSync(source).isSymbolicLink() || !lstatSync(source).isFile() || !within(root, realpathSync(source))) throw new Error("Arquivo de origem inválido: " + file);
}
mkdirSync(destination, { recursive: true });
for (const file of files) {
  mkdirSync(dirname(join(destination, file)), { recursive: true });
  cpSync(join(root, file), join(destination, file), { errorOnExist: true, force: false });
}
const size = files.reduce((total, file) => total + lstatSync(join(destination, file)).size, 0);
console.log("FIAP CS Revisa exportado: " + destination);
console.log(files.length + " arquivos, " + Math.ceil(size / 1024) + " KiB. Sem PDFs privados, progresso de alunos ou histórico Git.");
console.log("Execute npm test na cópia. Abra index.html ou execute npm start.");