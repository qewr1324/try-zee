#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import process from "node:process";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const COMMANDS =
{
    help: "./command/help.js",
    generate: "./command/generate.js",
    config: "./command/config.js",
    build: "../rollup.config.js"
};

async function main()
{
    const [,, command, ...args] = process.argv;

    if (["-v", "--version"].includes(command))
    {
        const pkg = require(resolve(__dirname, "../package.json"));
        console.log(pkg.version);
        return;
    }

    if (!command || !COMMANDS[command])
    {
        const { default: help } = await import("./command/help.js");
        await help();
        process.exit(command ? 1 : 0);
    }
    
    if (command === "build")
    {
        try
        {
            const configPath = resolve(__dirname, "../rollup.config.js");
            execSync(`npx rollup -c "${configPath}"`, { stdio: "inherit", shell: true });
            console.log("✅ Build completed successfully");
        }
        catch (error)
        {
            console.error("❌ Build failed: ", error.message);
            process.exit(1);
        }
        return;
    }

    try
    {
        const modulePath = COMMANDS[command];
        const { default: commandFn } = await import(modulePath);
        await commandFn(...args);
    }
    catch (error)
    {
        // console.error(`❌ Error executing ${command}: `, error.message);
        process.exit(1);
    }
}

main().catch(console.error);
