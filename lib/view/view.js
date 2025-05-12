import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import _error from "../log/log.js";

const version = "0.104.120";
const web = "https://zeejs.com";
const doc = "https://docs.zeejs.com";

let components = {};
let objComponents = {};
let roots = {};
let essentialComponents = {};
let cacheItems = {};
let configCaches = {};
let maxRenderLoops = {};
let minifingHtmls = {};
let minifingMode = {};

const regex =
{
    nameTag: /<@([\w]+)/,
    allTags: /<@([\w]+)[/\d]+>/g,
    numberTag: /<@([\w]+)\/(\d+)>/,
    numberTags: /<@([\w]+)\/(\d+)>/g,
    scriptTag: /<js@([\s\S]+?)\/js>/,
    scriptTags: /<js@([\s\S]+?)\/js>/g,
    checkTags: /<@[\w]+[/\d]+>|<js@([\s\S]+?)\/js>/,
    escapeRegex: /[.*+?^${}()|[\]\\]/g,
    minifyV1: /\s+/g,
    minifyV2: /<!--[\s\S]*?-->/g,
    minifyV3: /\s*(<[^>]+>)\s*/g,
    minifyV4: />\s+</g,
}

const libraryTags =
{
    head: `
        <!-- ZeeJS Head Tags -->
        <meta name="library" content="zeejs">
        <meta name="library-version" content=${version}>
        <meta name="author" content="Amir-Hussein-Muhammadi-Fard">
        <link rel="canonical" href=${web}>
    `,
    body: `
        <!-- ZeeJS Body Tags -->
        <zeejs-library version=${version}></zeejs-library>
        <zeejs-library docs=${doc}></zeejs-library>
    `
};

// ? A function to find unusual words | یک تابع برای پیدا کردن کلمات غیر معمول

function escapeRegExp(string)
{
    return string.replace(regex.escapeRegex, "\\$&");
}

// ? Inserting library tags into HTML text | جایگذاری تگ های کتابخانه در متن اچ تی ام ال

function zeeTags(reqData)
{
    const isFullHTML = reqData.trim().startsWith("<!DOCTYPE html>");

    if (isFullHTML)
    {
        if (reqData.includes("</head>")) reqData = reqData.replace("</head>", libraryTags.head + "</head>");
        if (reqData.includes("</body>")) reqData = reqData.replace("</body>", libraryTags.body + "</body>");
    }

    return reqData;
}

// ? Minifing return html | کم کردن حجم اچ تی او ال

function minifyHtml(html)
{
    if(minifingMode) return html
        .replace(regex.minifyV1, " ")
        .replace(regex.minifyV2, "")
        .replace(regex.minifyV3, "$1")
        .trim();
    else return html.replace(regex.minifyV4, "><");
};

/**
 * .*`زی`|* یک کتابخانه برای توسعه دهندگان *|`وب پیشانی`|* می باشد| |`🇮🇷-`
 * 
 * `-🇺🇸`| *|`zee`|* is a library for *|`front-end`|* web developers.
 * 
 * @author *`Amir Hussein Muhammadi Fard`*
 * @license *`MIT`*
 * @link [website](https://www.zee.com/)
 * @link [github](https://github.com/qewr1324)
 * @returns {String} `Root` | `Render`
 * @version 🔗 v0.49.56
 */

export default class zee
{
    static #essentialCache = new Map();

    /**
     * .سند *|`مسیر اصلی`|* را به صورت خودکار در سرور وارد می کند |`🇮🇷-`
     *
     * `-🇺🇸`| Dynamically *|`import`|* the file *|`RootCollection`|* into the server.
     *
     * @returns {String} `string`
     * @type `static`
     * @version 🔗 v0.17.12
     */

    static async Roots()
    {
        const rawPath = resolve(process.cwd(), "zee.config.js");
        const { href: purePath } = pathToFileURL(rawPath);
        const { default: { component, staticRoot, essentialComponent, configCache, maxRenderLoop, cacheItem, minifingHtml } } = (await import(purePath));

        roots = staticRoot || {};
        components = component || {};
        essentialComponents = essentialComponent || [];
        configCaches = configCache || {};
        maxRenderLoops = maxRenderLoop || {};
        cacheItems = cacheItem || {};
        minifingHtmls = minifingHtml.minifing || false;
        switch(minifingHtml.mode)
        {
            case "fast": minifingMode = false; break;
            case "slow": minifingMode = true; break;
            default: minifingMode = false; break;
        }
        objComponents = Object.keys(components) || {};
        for(const name of essentialComponents)
        {
            try
            {
                const module = await import(pathToFileURL(resolve(process.cwd(), components[name])).href);
                this.#essentialCache.set(name, module.default || module);
            }
            catch (err)
            {
                console.error("Failed to preload " + name + ":", err);
            }
        }
    }

    /**
     * .این تابع برای *|`صدا`|* زدن صفحه ای است که در سند *|`مسیر اصلی`|* ناوبری شده است `🇮🇷-`
     *
     * `-🇺🇸`| This function is for *|`calling`|* the page that is routed in the *|`RootCollection`|* document.
     *
     * @param {StringConstructor} [page=String] name "home"
     * @param {() => void} [resData=() => {}] return data for response
     * @param {ObjectConstructor} [rawData=Object] json {` title: "zee", ... `}
     * @returns {String} `return html page`
     * @type `static`
     * @version 🔗 v0.28.46
     */

    static async Render(page = String, resData = () => {}, rawData = Object)
    {
        if (!page || !components[page]) throw new Error(_error.invalidPage);

        const componentCache = new Map();
        const importCache = new Map();

        const fastImport = async (path) =>
        {
            if (importCache.has(path)) return importCache.get(path);
            const module = await import(pathToFileURL(resolve(process.cwd(), path)).href);
            importCache.set(path, module);
            return module;
        };

        const loadComponent = async (name) =>
        {
            if(this.#essentialCache.has(name)) return this.#essentialCache.get(name);
            const module = await fastImport(components[name]);
            return module.default || module;
        }
        
        try
        {
            const { default: data } = await fastImport(components[page]);
            const exeData = typeof data !== "function" 
                ? data 
                : data(rawData);

            if (!/<@[\w]+[/\d]+>/.test(exeData)) return resData(exeData);

            let orgData = exeData;
            let changed;
            let loop = 0;

            do {
                changed = false;

                loop++;
                if (loop > maxRenderLoops) return resData(_error.maxLoop);

                if(regex.numberTag.test(orgData))
                {
                    orgData = orgData.replace(regex.numberTags, (_, name, count) =>
                    {
                        return Array(parseInt(count)).fill(`<@${name}/>`).join('');
                    });
                }

                if(regex.scriptTag.test(orgData))
                {
                    orgData = orgData.replace(regex.scriptTags, (_, code) =>
                    {
                        try
                        {
                            const trimmedCode = code.trim();
                            const isExpression = !trimmedCode.startsWith("return") && 
                                               !trimmedCode.includes(";") && 
                                               !["{", "}", "for", "if", "while", "switch", "try", ":"]
                                                   .some(kw => trimmedCode.includes(kw));
                        
                            if (isExpression)
                            {
                                const func = new Function("data", `return (${trimmedCode})`);
                                return func(rawData);
                            }
                            else
                            {
                                const func = new Function("data", `
                                    let __output = "";
                                    with(data || {})
                                    {
                                        try
                                        {
                                            ${trimmedCode}
                                        }
                                        catch(e)
                                        {
                                            console.error('Template JS error:', e);
                                            __output = \`<div class="js-error">\${e.message}</div>\`;
                                        }
                                    }
                                    return __output;
                                `);
                                return func(rawData);
                            }
                        }
                        catch (err)
                        {
                            console.error(_error.jsExecutionError, err);
                            return `<div class="js-error">${err.message}</div>`;
                        }
                    });
                }

                const matches = orgData.match(regex.allTags) || [];

                for (const match of matches)
                {
                    const componentTag = match.match(regex.nameTag)[1];

                    if (objComponents[componentTag]) continue;

                    try
                    {
                        if (!componentCache.has(componentTag))
                        {
                            const component = await loadComponent(componentTag);
                            componentCache.set(componentTag, component);
                        }

                        const component = componentCache.get(componentTag);
                        const reqData = typeof component !== "function"
                            ? component
                            : component(rawData);

                        orgData = orgData.replace(
                            new RegExp(escapeRegExp(match), "g"),
                            reqData
                        );
                        changed = true;
                    }
                    catch (err)
                    {
                        console.error(_error.tryCatch, err);
                        const error = `<div class="component-error">
                            Error processing component | خطا در بارگذاری مؤلفه
                            ${components[componentTag]}<small>${err.message}</small></div>`;
                        orgData = orgData.replace(
                            new RegExp(escapeRegExp(match), "g"),
                            error
                        );
                    }
                }
            } while (changed && regex.checkTags.test(orgData));

            orgData = await zeeTags(orgData);
            orgData = minifingHtmls ? await minifyHtml(orgData) : orgData;
            return resData(orgData);
        }
        catch (err)
        {
            console.error("Render error:", err);
            return resData(_error.renderError, { "Cache-Control": "no-cache" });
        }
    }

    /**
     * .این تابع برای *|`صدا`|* زدن محتویات ایستا ای است که در *|`تارنما`|* ناوبری شده است `🇮🇷-`
     *
     * `-🇺🇸`| This function is for *|`calling`|* the static content that is routed in the *|`web`|* page.
     *
     * @param {URL} [url=URL] name "url"
     * @param {() => void} [resData=() => {}] return data for response
     * @returns {String} `return static content`
     * @returns {Headers} `cache files in browser with extension '~.js = 1 hour | ~.png = 1 year'`
     * @type `static`
     * @version 🔗 v0.21.20
     */

    static async staticRender(url = URL, resData = () => {})
    {
        const getContentType = (ext) =>
        {
            const types =
            {
                "png": "image/png",
                "jpg": "image/jpeg",
                "jpeg": "image/jpeg",
                "webp": "image/webp",
                "gif": "image/gif",
                "svg": "image/svg+xml",
                "js": "application/javascript",
                "mjs": "application/javascript",
                "cjs": "application/javascript",
                "woff": "font/woff",
                "woff2": "font/woff2",
                "ttf": "font/ttf",
                "otf": "font/otf",
                "css": "text/css",
                "html": "text/html",
                "htm": "text/html",
                "mp4": "video/mp4"
            };
            return types[ext] || "application/octet-stream";
        };

        const cacheHeaders = (name) =>
        {
            const ext = roots[name].split(".").pop().toLowerCase();
            
            const headers =
            {
                "Content-Type": getContentType(ext),
                "Vary": "Accept-Encoding"
            };

            for(const [type, config] of Object.entries(configCaches))
            {
                if(config.extensions?.includes(ext))
                {
                    headers["Cache-Control"] = config.policy;
                    return headers;
                }
            }
            headers["Cache-Control"] = "no-cache";
            return headers;
        }

        try
        {
            const word = url.toString().replace("/", "");
            const configheader = cacheHeaders(word);
            const rawPath = resolve(process.cwd(), roots[word]);

            const isTextType = [ "svg", "js", "css", "html", "htm" ]
                .includes(configheader["Content-Type"]
                .split("/")[1]);
            
            const file = await readFile(rawPath, isTextType ? "utf-8" : null);
            configheader["X-Library"] = "zeejs";
            configheader["X-Library-Version"] = version;
            configheader["X-Library-Docs"] = doc;

            const data = { data: file, header: configheader };
            return resData(data);
        }
        catch(err)
        {
            console.error("staticRender: " + err);
            return resData(false);
            // TODO notfound error----------
        }
    }

    /**
     * .این تابع برای *|`بارگیری`|* مجدد اطلاعات در قسمت *|`کش`|* می باشد `🇮🇷-`
     *
     * `-🇺🇸`| This function is for *|`reloading`|* information in the *|`cache`|*.
     *
     * @param {Object} [cacheData=Obj] data
     * @returns {String} `return static content`
     * @type `static`
     * @version 🔗 v0.1.2
     */

    static async updateITEMS(cacheData = Object){
        // TODO----------
    }
}
