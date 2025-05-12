#!/usr/bin/env node

import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFIG_TEMPLATE = `
import RootCollection from "zee/root";

export default new RootCollection(() => {
    return {
        maxRenderLoop: 20,
        minifingHtml: {
            minifing: true,
            mode: "slow",
        },
        rollupConfig: {
            input: "./app.js",
            output: {
                dir: "release",
                format: "esm",
            },
            minify: false,
            minifyOption: {
                ecma: 2015,
                module: true,
                log: false,
                comments: false,
                beautify: false,
                quote_style: 2,
                unused: true,
                dead_code: true,
                booleans: true,
                keep_classnames: true,
                keep_fnames: true,
            },
            external: [],
        },
        cacheItem: [],
        essentialComponent: [],
        configCache: {
            images: {
                extensions: ["png", "jpg", "jpeg", "webp", "avif", "gif"],
                policy: "public, max-age=31536000, immutable",
            },
            scripts: {
                extensions: ["js", "mjs", "cjs"],
                policy: "public, max-age=3600",
            },
            fonts: {
                extensions: ["woff", "woff2", "ttf", "otf"],
                policy: "public, max-age=31536000, immutable",
            },
            styles: {
                extensions: ["css"],
                policy: "public, max-age=604800",
            },
            svg: {
                extensions: ["svg"],
                policy: "public, max-age=2592000",
            },
            html: {
                extensions: ["html", "htm"],
                policy: "no-cache",
            },
        },
        staticRoot: {},
        component: {},
    };
});
`;

async function createConfigFile()
{
    const projectDir = process.cwd();
    
    const configFiles =
    [
        "zee.config.js",
        "zee.config.v2.js",
        "zee.config.v3.js"
    ];

    let newConfigFile = "zee.config.js";
    let version = 1;

    for (const file of configFiles)
    {
        if (!existsSync(join(projectDir, file)))
        {
            newConfigFile = file;
            version = file.includes(".v") ? parseInt(file.split(".v")[1].split(".")[0]) : 1;
            break;
        }
    }

    if (existsSync(join(projectDir, newConfigFile)))
    {
        const highestVersion = configFiles.reduce((max, file) =>
        {
            const v = file.includes(".v") ? parseInt(file.split(".v")[1].split(".")[0]) : 1;
            return v > max ? v : max;
        }, 0);

        newConfigFile = `zee.config.v${highestVersion + 1}.js`;
        version = highestVersion + 1;
    }

    const configPath = join(projectDir, newConfigFile);
    writeFileSync(configPath, CONFIG_TEMPLATE);

    console.log(`✅ فایل پیکربندی ${newConfigFile} با موفقیت ایجاد شد!`);
    console.log(`📝 مسیر فایل: ${configPath}`);
    console.log(`🔄 نسخه پیکربندی: ${version}`);
}

const args = process.argv.slice(2);
const command = args[0];

if (command === "config")
{
    try
    {
        await createConfigFile();
    }
    catch (error)
    {
        console.error(`❌ خطا در ایجاد فایل پیکربندی: ${error.message}`);
        process.exit(1);
    }
} else {
    console.error("❌ دستور نامعتبر!");
    console.log("برای ایجاد فایل پیکربندی از دستور زیر استفاده کنید: ");
    console.log("zee config");
    process.exit(1);
}
