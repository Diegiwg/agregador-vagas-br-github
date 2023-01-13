const app = document.getElementById("app");

async function helper_getRequest(url) {
    const raw = await fetch(url);
    if (raw.status !== 200) return null;

    const data = await raw.json();
    return data;
}

function helper_navigateTo(uri) {
    window.location.href = `#${uri}`;
}

function helper_mdToHtml(markdown) {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(markdown);
    return html;
}

function helper_checkCacheForUpdate() {
    const currentTime = window.localStorage.getItem("cache-time");

    if (currentTime && currentTime > -5) {
        window.localStorage.setItem("cache-time", currentTime - 1);
        return false;
    }

    window.localStorage.setItem("cache-time", 50);
    return true;
}

async function service_loadJobSources() {
    const data = await helper_getRequest("./src/source.json");
    return data;
}

async function service_loadJobsFromSource(source_path, pagination) {
    const data = await helper_getRequest(
        `https://api.github.com/repos/${source_path}/issues?page=${pagination}`
    );

    return data;
}

function generator_jobInfoNode(data) {
    if (!data) return helper_navigateTo("");
    const node = document.createElement("div");

    const back = document.createElement("button");
    back.textContent = "Voltar";
    back.onclick = () => {
        globalData = null;
        helper_navigateTo("");
    };

    const job_desc = document.createElement("p");
    job_desc.innerHTML = helper_mdToHtml(data.body);

    node.appendChild(back);
    node.appendChild(job_desc);
    return node;
}

function generator_jobNode(data) {
    const node = document.createElement("div");
    node.className = "job-list-item";
    node.onclick = () => {
        globalData = data;
        helper_navigateTo("job-info");
    };

    const title = document.createElement("h2");
    title.textContent = data.title.trim();

    const creator = document.createElement("a");
    creator.textContent = data.user.login;
    creator.href = data.user.html_url;

    const update_date = document.createElement("span");
    update_date.textContent = data.updated_at.split("T")[0];

    node.appendChild(title);
    node.appendChild(creator);
    node.appendChild(update_date);

    return node;
}

async function generator_homePage(data) {
    const node = document.createElement("div");
    node.id = "job-list";
    app.replaceChildren(...[node]);

    data.forEach(async (source) => {
        const data = await service_loadJobsFromSource(source.path, 0);
        data.forEach((job) => {
            const jobNode = generator_jobNode(job);
            node.appendChild(jobNode);
        });
    });
}

function generator_jobInfoPage(data) {
    const node = generator_jobInfoNode(data);
    app.replaceChildren(...[node]);
}

function generator_fakePage(data) {
    const node = document.createElement("div");
    node.innerHTML = helper_mdToHtml(data);
    app.replaceChildren(...[node]);
}

const sources = await service_loadJobSources();

let currentPage = function () {};
let nextPage = function () {};
let currentPath = null;
let globalData = undefined;
setInterval(() => {
    const path = document.URL.split("#")[1];
    if (currentPage === nextPage && currentPath === path) return;

    switch (path) {
        case "":
            globalData = sources;
            nextPage = generator_homePage;
            break;

        case "job-info":
            nextPage = generator_jobInfoPage;
            break;

        default:
            globalData = "404";
            nextPage = generator_fakePage;
            break;
    }

    currentPath = path;
    currentPage = nextPage;
    currentPage(globalData);
}, 100);
