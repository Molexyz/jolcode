import type { SlashCommand, UserData, Item, NPC } from '../../@types';
import InteractionCommandContext from '../../structures/Interaction';

export const name: SlashCommand["name"] = "rcds";
export const category: SlashCommand["category"] = "private";
export const cooldown: SlashCommand["cooldown"] = 0;
export const isPrivate: SlashCommand["isPrivate"] = true;

export const data: SlashCommand["data"] = {
    name: "rcds",
    description: "NO.",
    options: [
        {
            name:"user",
            description:"WHO?",
            required: true,
            type:6
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    const user = ctx.interaction.options.getUser('user', true);
    const client = ctx.client;

    const where = await client.database.getCooldownCache(user.id);
    const result = await client.database.redis.del(where);

    if (result) ctx.interaction.reply({
        content: `Done, cooldown was from \`${where}\``
    });
    else ctx.interaction.reply({
        content: 'User not on cooldown'
    });


};
