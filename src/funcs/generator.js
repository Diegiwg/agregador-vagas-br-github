let service, helper;

let job_counter = 1;

const generator = {
    init: (service_instance, helper_instance) => {
        service = service_instance;
        helper = helper_instance;
    },

    jobNode: (data) => {
        const node = document.createElement("div");
        node.className = "job-list-item";
        node.onclick = () => {
            helper.write_data(data);
            helper.navigateTo("job-info");
        };

        const title = document.createElement("h2");
        title.textContent = `${job_counter} - ${data.title.trim()}`;
        job_counter++;

        const creator = document.createElement("a");
        creator.textContent = data.user.login;
        creator.href = data.user.html_url;

        const update_date = document.createElement("span");
        update_date.textContent = data.updated_at.split("T")[0];

        node.appendChild(title);
        node.appendChild(creator);
        node.appendChild(update_date);

        return node;
    },

    jobInfoNode: (data) => {
        if (!data) return helper.navigateTo("");
        const node = document.createElement("div");

        const back = document.createElement("button");
        back.textContent = "Voltar";
        back.onclick = () => {
            helper.write_data(null);
            helper.navigateTo("");
        };

        const job_desc = document.createElement("p");
        job_desc.innerHTML = helper.mdToHtml(data.body);

        node.appendChild(back);
        node.appendChild(job_desc);
        return node;
    },

    homePage: async () => {
        job_counter = 1;

        const data = helper.read_data();
        const node = document.createElement("div");
        node.id = "job-list";
        app.replaceChildren(...[node]);

        data.forEach(async (source) => {
            const data = await service.loadJobsFromSource(source.path, 0);
            data.forEach((job) => {
                const jobNode = generator.jobNode(job);
                node.appendChild(jobNode);
            });
        });
    },

    jobInfoPage: () => {
        const data = helper.read_data();
        const node = generator.jobInfoNode(data);
        app.replaceChildren(...[node]);
    },
};
export { generator };
