import _ from 'lodash';

const logger = require('../../../../util/logger')({ name: `plugin:es:initialize-model` });

module.exports = async ({ client, path }) => {

    const Mods = require(path);
    const models = {};
    await _.each(Mods, async (model) => {

        const instance = new model({ client });
        const { name, mappings, settings, index, registerConfiguration } = instance;

        logger.debug(name);

        if (registerConfiguration) {
            const exists = await client.indices.exists({ index });
            if (!exists.body) {
                await client.indices.create({ index });
            }

            await client.indices.putMapping({
                index,
                //type: index,
                body: { ...mappings }
            });

            await client.indices.putSettings({
                index,
                body: { ...settings }
            });
        }

        models[name] = instance;
    });
    return models;

};
