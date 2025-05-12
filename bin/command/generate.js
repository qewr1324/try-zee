#!/usr/bin/env node

import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const DEFAULT_TYPES = ["css", "png", "html", "js", "jpg", "jpeg", "gif", "svg", "ico", "webp", "json"];
const DEFAULT_FOLDERS = ["wwwroot", "public", "static", "assets", "project", "app", "src", "server"];

function normalizePath(path)
{
    return path.replace(/\\/g, "/");
}

function findFoldersRecursively(rootDir, targetFolder, depth = 3, currentDepth = 0)
{
    if (currentDepth > depth) return [];

    const folders = [];
    try
    {
        const items = readdirSync(rootDir);

        for (const item of items)
        {
            const fullPath = join(rootDir, item);
            try
            {
                const stat = statSync(fullPath);

                if (stat.isDirectory())
                {
                    if (item.toLowerCase() === targetFolder.toLowerCase()) folders.push(fullPath);
                  
                    if (currentDepth < depth)
                    {
                        const subFolders = findFoldersRecursively(fullPath, targetFolder, depth, currentDepth + 1);
                        folders.push(...subFolders);
                    }
                }
            }
            catch (error)
            {
                console.warn(`⚠️ خطا در دسترسی به ${fullPath}: ${error.message}`);
            }
        }
    }
    catch (error)
    {
        console.warn(`⚠️ خطا در خواندن محتوای ${rootDir}: ${error.message}`);
    }

    return folders;
}

function parseArgs(args)
{
    const result =
    {
        command: null,
        folderName: null,
        types: [...DEFAULT_TYPES],
        help: false,
        depth: 3
    };

    for (let i = 0; i < args.length; i++)
    {
        const arg = args[i];

        if (arg === "help" || arg === "--help" || arg === "-h")
        {
            result.help = true;
            continue;
        }
      
        if (arg === "generate")
        {
            result.command = "generate";
            continue;
        }
      
        if (arg === "-type" && i + 1 < args.length)
        {
            result.types = args[i + 1].split(" ").map(t => t.toLowerCase());
            i++;
            continue;
        }
      
        if (arg === "-depth" && i + 1 < args.length)
        {
            result.depth = parseInt(args[i + 1]) || 3;
            i++;
            continue;
        }
      
        if (!result.command && !result.help)
        {
            result.command = arg;
            continue;
        }
      
        if (result.command && !result.folderName && !arg.startsWith("-")) result.folderName = arg;
    }

    return result;
}

async function scanAndGenerateConfig(folderPath, fileTypes)
{
    try
    {
        const projectDir = process.cwd();
        const relativePath = relative(projectDir, folderPath);

        console.log(`\n🔍 شروع اسکن پوشه: ${relativePath}`);
        console.log(`📌 نوع فایل‌های مجاز: ${fileTypes.join(", ")}`);

        const scanDir = (dir, fileList = []) =>
        {
            const files = readdirSync(dir);

            files.forEach(file =>
            {
                const filePath = join(dir, file);
                try
                {
                    const stat = statSync(filePath);
                  
                    if (stat.isDirectory())
                    {
                        scanDir(filePath, fileList);
                    }
                    else
                    {
                        const ext = extname(file).toLowerCase().slice(1);
                        if (fileTypes.includes(ext))
                        {
                            fileList.push(
                            {
                              name: file,
                              path: normalizePath(relative(folderPath, filePath)),
                              ext: ext,
                              size: stat.size,
                              modified: stat.mtime.toISOString()
                            });
                        }
                    }
                }
                catch (error)
                {
                    console.warn(`⚠️ خطا در پردازش ${filePath}: ${error.message}`);
                }
            });
            return fileList;
        };

        const files = scanDir(folderPath);

        if (files.length === 0)
        {
            console.warn(`⚠️ هیچ فایل معتبری با پسوندهای مجاز در این پوشه یافت نشد`);
            return null;
        }

        const configObject =
        {
            metadata:
            {
              // generatedAt: new Date().toISOString(),
              sourceFolder: basename(folderPath),
              absolutePath: normalizePath(folderPath),
              fileTypes: [...new Set(files.map(f => f.ext))],
              totalFiles: files.length,
              totalSize: files.reduce((sum, file) => sum + file.size, 0)
            },
            files: {}
        };

        files.forEach(file =>
        {
            const fileName = basename(file.path, extname(file.path));
            configObject.files[fileName] = `./${normalizePath(join(relativePath, file.path))}`;
        });

        const jsonContent = JSON.stringify(configObject, null, 2);

        const configPath = join(projectDir, "zee.config.json");
        writeFileSync(configPath, jsonContent);

        console.log(`✅ فایل zee.Config.json با موفقیت ایجاد شد!`);
        console.log(`📁 تعداد فایل‌های پردازش شده: ${files.length}`);
        console.log(`📝 مسیر فایل: ${configPath}`);

        return configPath;
    }
    catch (error)
    {
        console.error(`❌ خطا در پردازش پوشه ${folderPath}: ${error.message}`);
        return null;
    }
}

const args = process.argv.slice(2);
const { command, folderName, types, help, depth } = parseArgs(args);

if (help || !command)
{
    console.log(`
    📚 راهنمای دستورات zee-cli:

    zee help                           نمایش این راهنما
    zee generate                       جستجو در پوشه‌های پیش‌فرض (${DEFAULT_FOLDERS.join(', ')})
    zee generate <نام-پوشه>            اسکن پوشه دلخواه
    zee generate <نام-پوشه> -type <لیست> اسکن با نوع فایل‌های مشخص شده
    zee generate <نام-پوشه> -depth <عدد> تعیین عمق جستجو (پیش‌فرض: 3)

    مثال‌ها:
    zee generate                      (جستجوی خودکار در پوشه‌های پیش‌فرض)
    zee generate assets               (اسکن پوشه assets)
    zee generate static -type png jpg (اسکن با نوع فایل‌های مشخص شده)
    zee generate src -depth 5         (جستجو تا عمق 5 پوشه)
    `);
} 
else if (command === "generate")
{
    try
    {
        const projectDir = process.cwd();
        console.log(`📂 مسیر جاری پروژه: ${projectDir}`);

        if (folderName)
        {
            const foundFolders = findFoldersRecursively(projectDir, folderName, depth);
          
            if (foundFolders.length === 0)
            {
                console.error(`❌ هیچ پوشه‌ای با نام '${folderName}' یافت نشد!`);
                console.log(`🔍 جستجو تا عمق ${depth} پوشه انجام شد.`);
                process.exit(1);
            }
          
            await scanAndGenerateConfig(foundFolders[0], types);
        }
        else
        {
            const foundFolders = DEFAULT_FOLDERS
                .map(folder => join(projectDir, folder))
                .filter(folderPath => existsSync(folderPath));

            if (foundFolders.length === 0)
            {
                console.error(`❌ هیچ یک از پوشه‌های پیش‌فرض یافت نشد!`);
                console.log(`پوشه‌های پیش‌فرض: ${DEFAULT_FOLDERS.join(", ")}`);
                process.exit(1);
            }

            await scanAndGenerateConfig(foundFolders[0], types);
        }
    }
    catch (error)
    {
        console.error(`❌ خطای کلی: ${error.message}`);
        process.exit(1);
    }
}
else
{
  console.error(`❌ دستور نامعتبر!`);
  console.log(`برای مشاهده راهنما از دستور زیر استفاده کنید:`);
  console.log(`zee help`);
  process.exit(1);
}
