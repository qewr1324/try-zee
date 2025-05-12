import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

import { existsSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { join, basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { builtinModules } from "node:module";

const loadUserConfig = async () =>
{
    const userProjectRoot = process.cwd();
    const configPath = resolve(userProjectRoot, "zee.config.js");

    if (!existsSync(configPath))
    {
        const exampleConfig = `
            // ? The necessary configuration file zee.js | zee.js فایل پیکربندی ضروری
            export default
            {
                // ? Static settings | تنظیمات استاتیک
                staticRoot:
                {
                    _example: "./src/assets/example.svg"
                },
            
                // ? Component settings | تنظیمات کامپوننت‌ها
                component:
                {
                    home: "./src/views/home.js"
                },
            
                // ? Optional Rollup Settings | Rollup تنظیمات اختیاری
                rollupConfig:
                {
                    input: "src/main.js",    // ? Default entry point | نقطه ورود پیش‌فرض
                    output:
                    {
                      dir: "dist",          // ? Output folder | پوشه خروجی
                      format: "esm"         // ? Output format | فرمت خروجی
                    }
                }
            };
            
            // ? If you don't have this file named zee.config.js,
            you can download the zee-p plugin and use it to create
            such a file by writing the command 'zee config'.

            //? رو ندارید zee.config.js اگر این سند با نام
            رو بارگیری و با نوشتن دستور zee-p می توانید افزونه
            .از آن برای ساخت چنین سندی استفاده کنید'zee config'
        `;

        throw new Error(
          `⛔ zee.config.js configuration file not found | یافت نشد zee.config.js فایل پیکربندی \n` +
          `Expected route | مسیر مورد انتظار: ${configPath}\n\n` +
          `Please create the file with this content | لطفاً فایل را با این محتوا ایجاد کنید:\n\n${exampleConfig}`
        );
    }

    try
    {
        const configUrl = pathToFileURL(configPath).href;
        return (await import(configUrl)).default;
    }
    catch (err)
    {
        throw new Error(
          `zee.config.js read error | zee.config.js خطا در خواندن:\n${err.message}\n\n` +
          `Please make sure the file is valid | لطفاً مطمئن شوید فایل معتبر است`
        );
    }
};

const DEFAULT_CONFIG =
{
    input: "src/main.js",
    output:
    {
        dir: "release",
        format: "esm",
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "components/[name]-[hash].js"
    }
};

export default async () =>
{
    const userConfig = await loadUserConfig();
    const { minify, minifyOption: { ecma, module, log, comments, beautify, quote_style, unused, dead_code, booleans, keep_classnames, keep_fnames }, external } = userConfig.rollupConfig;

    const finalConfig =
    {
        ...DEFAULT_CONFIG,
        ...(userConfig.rollupConfig || {}),
        output:
        {
            ...DEFAULT_CONFIG.output,
            ...(userConfig.rollupConfig?.output || {})
        },
    };

    const outputDir = resolve(process.cwd(), finalConfig.output.dir);
    const assetsDir = join(outputDir, "assets");
    const componentsDir = join(outputDir, "components");

    [assetsDir, componentsDir].forEach(dir =>
    {
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    });

    const compress = () =>
    {
        if(minify)
            {
                return terser(
                        {
                            ecma: ecma || 2015,
                            module: module || true,
                            compress:
                            {
                                drop_console: log || false,
                                unused: unused || true,
                                dead_code: dead_code || true,
                                booleans: booleans || true,
                            },
                            format:
                            {
                                comments: comments || false,
                                beautify: beautify || false,
                                quote_style: quote_style || 1
                            },
                            mangle: {
                                keep_classnames: keep_classnames || true,
                                keep_fnames: keep_fnames || true,
                            },
                        })
            }
            else return null;
    }

    const copyFiles = () =>
    {
        try
        {
            Object.entries(userConfig.staticRoot || {}).forEach(([key, srcPath]) =>
            {
                const src = resolve(process.cwd(), srcPath);
                if (existsSync(src))
                {
                    const dest = join(assetsDir, basename(src));
                    copyFileSync(src, dest);
                    console.log(`✅ Copied static file | سند ایستا رو نوشت شده: ${key} -> ${dest}`);
                }
            });

            Object.entries(userConfig.component || {}).forEach(([key, srcPath]) =>
            {
                const src = resolve(process.cwd(), srcPath);
                if (existsSync(src))
                {
                    const dest = join(componentsDir, basename(src));
                    copyFileSync(src, dest);
                    console.log(`✅ Copied component | مولفه رو نوشت شده: ${key} -> ${dest}`);
                }
            });
        }
        catch (err)
        {
            console.error("⚠️ Error copying files | خطا در کپی کردن فایل‌ها: ", err);
        }
    };

    return {
        ...finalConfig,
        plugins: [
            json(),
            image(
            {
                include: Object.values(userConfig.staticRoot || {}).map((path) => resolve(process.cwd(), path)),
            }),
            nodeResolve({
                browser: false,
                preferBuiltins: true,
            }),
            commonjs(),
            {
                name: "zee-file-copier",
                writeBundle()
                {
                    copyFiles();

                    const processedConfig =
                    {
                        ...userConfig,
                        staticRoot: Object.fromEntries(Object.entries(userConfig.staticRoot || {}).map(([k, v]) => [k, `./assets/${basename(v)}`])),
                        component: Object.fromEntries(Object.entries(userConfig.component || {}).map(([k, v]) => [k, `./components/${basename(v)}`])),
                    };

                    writeFileSync(join(outputDir, "zee.config.js"), `export default ${JSON.stringify(processedConfig, null, 2)};`);
                },
            },
            compress()
        ],
        external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`), "dotenv", external],
    };
};
