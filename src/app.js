import { helper } from "./funcs/helper.js";
import { service } from "./funcs/service.js";
import { generator } from "./funcs/generator.js";

service.init(helper);
generator.init(service, helper);

const sources = await service.loadJobSources();

let currentPage = function () {};
let nextPage = function () {};
let currentPath = null;
setInterval(() => {
    const path = document.URL.split("#")[1];
    if (currentPage === nextPage && currentPath === path) return;

    switch (path) {
        case "job-info":
            nextPage = generator.jobInfoPage;
            break;

        default:
            helper.write_data(sources);
            nextPage = generator.homePage;
            break;
    }

    currentPath = path;
    currentPage = nextPage;
    currentPage();
}, 100);
