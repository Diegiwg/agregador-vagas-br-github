const app = document.getElementById("app");

async function helper_getRequest(url) {
    const raw = await fetch(url);
    if (raw.status !== 200) return null;

    const data = await raw.json();
    return data;
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

function generator_jobNode(data) {
    const node = document.createElement("div");

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

//

const sources = await service_loadJobSources();
const jobs = await service_loadJobsFromSource(sources[0].path, 0);

jobs.forEach((job) => {
    const node = generator_jobNode(job);
    app.appendChild(node);
});
