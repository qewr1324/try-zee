import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_FOLDERS = ["wwwroot", "public", "static", "assets", "project", "app", "src", "server"];

export default async function help()
{
  try
  {
    const helpText = await readFile(resolve(__dirname, "../../docs/help.txt"), "utf8");
    console.log(helpText);
  }
  catch
  {
    console.log(`
📚 ZEE CLI Help:

Usage: zee <command> [options]

  Commands:
    zee help                           نمایش این راهنما
    zee generate                       جستجو در پوشه‌های پیش‌فرض (${DEFAULT_FOLDERS.join(", ")})
    zee generate <نام-پوشه>            اسکن پوشه دلخواه
    zee generate <نام-پوشه> -type <لیست> اسکن با نوع فایل‌های مشخص شده
    zee generate <نام-پوشه> -depth <عدد> تعیین عمق جستجو (پیش‌فرض: 3)

    مثال‌ها:
    zee generate                      (جستجوی خودکار در پوشه‌های پیش‌فرض)
    zee generate assets               (اسکن پوشه assets)
    zee generate static -type png jpg (اسکن با نوع فایل‌های مشخص شده)
    zee generate src -depth 5         (جستجو تا عمق 5 پوشه)
`);}
}
