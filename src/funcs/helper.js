// var showdown = require("../modules/showdown.js");

showdown.setFlavor("github");
const converter = new showdown.Converter();

const helper = {
    getRequest: async (url) => {
        const raw = await fetch(url);
        if (raw.status !== 200) return null;

        const data = await raw.json();
        return data;
    },

    navigateTo: (uri) => {
        window.location.href = `#${uri}`;
        window.scroll(0, 0);
    },

    mdToHtml: (markdown) => {
        const html = converter.makeHtml(markdown);
        return html;
    },

    checkCacheForUpdate: () => {
        const currentTime = window.localStorage.getItem("cache-time");

        if (currentTime && currentTime > -5) {
            window.localStorage.setItem("cache-time", currentTime - 1);
            return false;
        }

        window.localStorage.setItem("cache-time", 50);
        return true;
    },

    read_data: () => {
        const data = window.localStorage.getItem("global-data") || "{}";
        return JSON.parse(data);
    },

    write_data: (data) => {
        window.localStorage.setItem("global-data", JSON.stringify(data));
    },
};

export { helper };
