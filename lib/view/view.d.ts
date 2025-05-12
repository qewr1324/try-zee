// view.d.ts
declare module "zee/view" {
    import { URL } from "node:url";

    interface RegexPatterns {
        nameTag: RegExp;
        allTags: RegExp;
        numberTag: RegExp;
        numberTags: RegExp;
        scriptTag: RegExp;
        scriptTags: RegExp;
        checkTags: RegExp;
        escapeRegex: RegExp;
        minifyV1: RegExp;
        minifyV2: RegExp;
        minifyV3: RegExp;
        minifyV4: RegExp;
    }

    interface LibraryTags {
        head: string;
        body: string;
    }

    interface MinifyConfig {
        minifing?: boolean;
        mode?: "fast" | "slow";
    }

    interface ZeeConfig {
        component?: Record<string, string>;
        staticRoot?: Record<string, string>;
        essentialComponent?: string[];
        configCache?: Record<string, { extensions?: string[]; policy: string }>;
        maxRenderLoop?: number;
        cacheItem?: Record<string, any>;
        minifingHtml?: MinifyConfig;
    }

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
     * @version 🔗 v0.25.34
     */ 
    export default class zee {
        private static essentialCache: Map<string, any>;

        /**
         * .سند *|`مسیر اصلی`|* را به صورت خودکار در سرور وارد می کند |`🇮🇷-`
         *
         * `-🇺🇸`| Dynamically *|`import`|* the file *|`RootCollection`|* into the server.
         *
         * @returns {String} `string`
         * @type `static`
         * @version 🔗 v0.15.8
         */
        static Roots(): Promise<void>;

        /**
         * .این تابع برای *|`صدا`|* زدن صفحه ای است که در سند *|`مسیر اصلی`|* ناوبری شده است `🇮🇷-`
         *
         * `-🇺🇸`| This function is for *|`calling`|* the page that is routed in the *|`RootCollection`|* document.
         *
         * @param {StringConstructor} [page=String] name "home"
         * @param {() => void} [resData=() => {}] return data for response
         * @param {ObjectConstructor} [rawData=Object] json {` title: "zee", ... `}
         * @returns {String} `return html page`
         * @throws Error if page is invalid or rendering fails
         * @type `static`
         * @version 🔗 v0.21.43
         */
        static Render(
            page: string,
            resData: (html: string) => void,
            rawData?: Record<string, any>
        ): Promise<void>;

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
         * @version 🔗 v0.4.4
         */
        static staticRender(
            url: URL,
            resData: (response: { data: string | Buffer; header: Record<string, string> } | false) => void
        ): Promise<void>;

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
        static updateITEMS(cacheData: Record<string, any>): Promise<void>;
    }
}
