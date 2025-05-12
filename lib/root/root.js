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
*/

export default class RootCollection
{
    /**
     * 
     * @param {Function} config object
     * @returns {Object} object
    */

    constructor(config = () => {})
    {
        return config();
    }
}
