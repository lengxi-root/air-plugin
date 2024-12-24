import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { randomUUID as uuid } from 'node:crypto';
import fs from "fs";
const { Notebook } = require('crossnote');
const puppeteer = require('puppeteer');
const path = require('path');
const _path = process.cwd().replace(/\\/g, '/')
var notebook = null
var browser = null

async function loada(){
browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
}
async function loadb(){
notebook = await Notebook.init({
    notebookPath: _path + '/temp',
    config: {
      previewTheme: 'github-light.css',
      mathRenderingOption: 'KaTeX',
      codeBlockTheme: 'github.css',
      printBackground: true,
      enableScriptExecution: false, // <= For running code chunks.
    },
  });
}

export default async function md2img(markdownText) {
    if (!browser) {
    await loada()
    }
    if (!notebook) {
    await loadb()
    }

    const currentTimeString = uuid();
    const readmeFilePath = path.join(_path, 'temp', `${currentTimeString}.md`);
    const readmeHtmlPath = path.join(_path, 'temp', `${currentTimeString}.html`);
    await fs.promises.writeFile(readmeFilePath, markdownText);
    const engine = notebook.getNoteMarkdownEngine(readmeFilePath);
    await engine.htmlExport({ offline: false, runAllCodeChunks: false });
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport({ width: 300, height: 100, deviceScaleFactor: 1 });
    await page.goto("file://" + readmeHtmlPath, { waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"][2] });
    const imageBuffer = Buffer.from(await page.screenshot({ fullPage: true }));
    await page.close();
    await context.close();
    await Promise.all([
      fs.unlinkSync(readmeHtmlPath),
      fs.unlinkSync(readmeFilePath)
    ]);
    return imageBuffer;
  }
Bot.md2img = async (mdtext) => {
  return await md2img(mdtext)
};

