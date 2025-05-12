// root.d.ts
declare module "try-zee/root" {
  /**
   * .*`مجموعه اصلی`|* یک کلاس برای مسیرها و تنظیمات مربوط به تارنما در کتابخانه اصلی است| |`🇮🇷-`
   * 
   * `-🇺🇸`| The *|`RootCollection`|* is a class for *|`zee`|* library related settings,
   * 
   * which define important paths for the website.
   * 
   * @param {Function} config object
   * @returns {Object} `object`
   * @example 🔑 export default new RootCollection (() => {
   * .     return
   * .     {
   * .        header: "./src/views/~~.js",
   * .        footer: "./src/views/~~.js",
   * .        main: "./src/views/~~.js",
   * .     }
   * .  });
   * @version 🔗 v0.9.10
   * @template T - نوع ساختار پیکربندی
   */
  export default class RootCollection<T = Record<string, string>> {
    /**
     * ایجاد یک نمونه جدید از RootCollection
     * 
     * @param {() => T} config - تابعی که ساختار مسیرها را برمی‌گرداند
     * 
     * @example
     * new RootCollection(() => ({
     *   header: "./src/views/header.js",
     *   footer: "./src/views/footer.js",
     *   main: "./src/views/main.js"
     * }));
     */
    constructor(config?: () => T);

    /**
     * دریافت تمام مسیرهای تعریف شده
     */
    readonly paths: T;

    /**
     * بررسی وجود مسیر برای یک کامپوننت خاص
     * @param key نام کامپوننت
     */
    hasPath(key: keyof T): boolean;

    /**
     * دریافت مسیر یک کامپوننت
     * @param key نام کامپوننت
     */
    getPath<K extends keyof T>(key: K): T[K];

    /**
     * دریافت مسیر یک کامپوننت
     * @param key نام کامپوننت
    */
    config: string;
  }

  /**
   * یک اینترفیس پیش‌فرض برای ساختار مسیرها
   */
  export interface DefaultPaths {
    header: string;
    footer: string;
    main: string;
    [key: string]: string;
  }
}
