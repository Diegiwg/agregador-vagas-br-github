let helper = null;

const service = {
    init: (helper_instance) => {
        helper = helper_instance;
    },

    loadJobSources: async () => {
        const data = await helper.getRequest("./src/source.json");
        return data;
    },

    loadJobsFromSource: async (source_path, pagination) => {
        const data = await helper.getRequest(
            `https://api.github.com/repos/${source_path}/issues?page=${pagination}`
        );

        return data;
    },
};

export { service };
