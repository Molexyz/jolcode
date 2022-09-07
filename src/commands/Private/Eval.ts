import type { SlashCommand, UserData, Item, NPC } from '../../@types';
import InteractionCommandContext from '../../structures/Interaction';

export const name: SlashCommand["name"] = "eval";
export const category: SlashCommand["category"] = "private";
export const cooldown: SlashCommand["cooldown"] = 0;
export const isPrivate: SlashCommand["isPrivate"] = true;

export const data: SlashCommand["data"] = {
    name: "eval",
    description: "NO.",
    options: [
        {
            type: 3,
            name: 'query',
            description: '01011000011001011',
            required: true
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    const content = ctx.interaction.options.getString('query', true);
    const client = ctx.client;
    const userData = await client.database.getUserData(ctx.author.id);
    const result = new Promise((resolve) => resolve(eval(content)));

    return result.then((output: any) => {
        if (typeof output !== `string`) {
            output = require(`util`).inspect(output, {
                depth: 0
            });
        }
        if (output.includes(client.token)) {
            output = output.replace(new RegExp(client.token, "gi"), `T0K3N`);
        }
        try {
            // eslint-disable-no-useless-escape
            ctx.interaction.reply({ content: `\`\`\`\js\n${output}\n\`\`\`` });
        } catch (e) {
            console.error(e);
        }
    }).catch((err) => {
        console.error(err);
        err = err.toString();
        if (err.includes(client.token)) {
            err = err.replace(new RegExp(client.token, "gi"), `T0K3N`);
        }
        try {
            ctx.interaction.reply({ content: `\`\`\`\js\n${err}\n\`\`\`` });
        } catch (e) {
            console.error(e);
        }

    }); 

};
