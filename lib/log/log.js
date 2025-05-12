const _color =
{
    forground:
    {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        black: "\x1b[30m",
    },
    background:
    {
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        black: "\x1b[40m",
    },
};

const _error =
{
    staticType: "\n" + _color.background.red + "🧊 Zee.staticType: There is no Type | ﺖﺳﺍ ﻩﺪﺸﻧ ﻪﯿﺒﻌﺗ ﻞﯾﺎﻓ ﺯﺍ ﯽﻋﻮﻧ ﭻﯿﻫ" + _color.background.yellow + _color.forground.blue + "\n🧷 Expample | ﻪﻧﻮﻤﻧ: Zee.staticType('css', 'png', 'mp4');" + _color.background.black + _color.forground.yellow + "\n",
    file: "\n" + _color.background.red + "📁 Zee.file: There is no Root Folder | ﺩﺭﺍﺪﻧ ﺩﻮﺟﻭ ﺕﻭﺭ ﻪﺷﻮﭘ ﭻﯿﻫ ﺎﺠﻨﯾﺍ" + _color.background.yellow + _color.forground.blue + "\n🧷 Expample | ﻪﻧﻮﻤﻧ: Zee.Root('./wwwroot or ./public');" + _color.background.black + _color.forground.white + "\n",
    staticUrl: "\n" + _color.background.blue + "🔍 Zee.staticUrl: For use this option, import the staticType Method | ﺪﯿﻨﮐ ﯽﻧﺍﻮﺧﺍﺮﻓ اﺭ ﺎﺘﺴﯾﺍ ﻉﻮﻧ ﻊﺑﺎﺗ ﺖﺴﯾﺎﺑ ﯽﻣ ،ﺕﺎﻤﯿﻈﻨﺗ ﻦﯾﺍ ﺯﺍ ﻩﺩﺎﻔﺘﺳﺍ ﯼﺍﺮﺑ" + _color.background.yellow + _color.forground.blue + "\n🧷 Expample | ﻪﻧﻮﻤﻧ: Zee.staticType('html', 'svg', 'css');" + _color.background.black + "\n" + _color.forground.white,
    importUrl: "\n" + _color.background.red + "🧊 Zee.staticUrl: Please enter the request parameter | ﺪﯿﻨﮐ ﺩﺭﺍﻭ 'ﺖﺳﺍﻮﺧﺭﺩ' ﻉﻮﻧ ﺯﺍ ﺭﺍﺪﻘﻣ ﮏﯾ ﺎﻔﻄﻟ" + _color.background.yellow + _color.forground.yellow + "\n🧷 Expample | ﻪﻧﻮﻤﻧ: Zee.staticUrl(req, http.res or null);" + _color.background.black + "\n",
    booleanUrl: _color.background.blue + "🧷 (http.res) null: Build a static path and send it back as a string | ﻪﺘﺷﺭ ﮏﯾ ﻥﺍﻮﻨﻋ ﻪﺑ ﻥﺁ ﻥﺩﺎﺘﺳﺮﻓ ﻭ ﺎﺘﺴﯾﺍ ﺮﯿﺴﻣ ﮏﯾ ﺖﺧﺎﺳ" + _color.background.black + "\n" + _color.background.blue + "🧷 (http.res) true: Build a static path and send that 'asset' to client with 'fs' module | 'fs' module ﺎﺑ ﺮﺑﺭﺎﮐ ﺖﻤﺳ ﻪﺑ ﺖﺳﺍﻮﺧﺭﺩ ﻥﺩﺎﺘﺳﺮﻓ ﻭ ﺎﺘﺴﯾﺍ ﺮﯿﺴﻣ ﮏﯾ ﺖﺧﺎﺳ" + _color.background.black + "\n",
    maxLoop: "🧊 Zee.Render: Maximum component processing iterations reached | ﺖﺳﺍ ﻩﺪﯿﺳﺭ ﻪﻔﻟﺆﻣ ﺵﺯﺍﺩﺮﭘ ﺭﺍﺮﮑﺗ ﺮﺜﮐﺍﺪﺣ ﻪﺑ",
    tryCatch: "\n" + _color.background.red + "🧊 Zee.Render: There was a problem processing the components, but it continues to work\nﺪﻫﺩ ﯽﻣ ﻪﻣﺍﺩﺍ ﺩﻮﺧ ﺭﺎﮐ ﻪﺑ ﻝﺎﺣ ﻦﯾﺍ ﺎﺑ ﯽﻟﻭ ،ﺖﺳﺍ ﻩﺪﻣﺁ ﺶﯿﭘ ﺎﻫ ﻪﻔﻟﺆﻣ ﺵﺯﺍﺩﺮﭘ ﺭﺩ ﯽﻠﮑﺸﻣ 🧊" + _color.background.black + "\n",
    invalidPage: "\n" + _color.background.red + "🧊 Zee.Render: No components are placed here | ﺖﺳﺍ ﻩﺪﺸﻧ ﻩﺩﺍﺩ ﺭﺍﺮﻗ ﺎﺠﻨﯾﺍ ﯼﺍ ﻪﻔﻟﻮﻣ ﭻﯿﻫ" + _color.background.yellow + _color.forground.blue + "\n🧷 Expample | ﻪﻧﻮﻤﻧ: Zee.Render('home', (data) => res.end(data), { title: 'nodejs', description: 'document...'});" + _color.background.black + _color.forground.white + "\n",
};

export default _error;
