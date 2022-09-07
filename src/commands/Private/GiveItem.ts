import type { SlashCommand, UserData, Item, NPC } from '../../@types';
import InteractionCommandContext from '../../structures/Interaction';
import * as Items from '../../database/rpg/Items';
import * as Util from '../../utils/functions';


export const name: SlashCommand["name"] = "give";
export const category: SlashCommand["category"] = "private";
export const cooldown: SlashCommand["cooldown"] = 0;
export const isPrivate: SlashCommand["isPrivate"] = true;

export const data: SlashCommand["data"] = {
    name: "give",
    description: "NO.",
    options: [
        {
            name:"user",
            description:"WHO?",
            required: true,
            type:6
        },
        {
            name:"item",
            description:"WHAT?",
            required: true,
            type:3
        },
        {
            name:"amount",
            description:"HOW MUCH?",
            required: true,
            type:4
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    const user = ctx.interaction.options.getUser('user', true);
    const iitem = ctx.interaction.options.getString('item', true);
    const amount = ctx.interaction.options.getInteger('amount', true);
    const item = Util.getItem(iitem) || Object.values(Items).find((v) => v.id.toLowerCase().includes(iitem.toLowerCase()));
    const userData = await ctx.client.database.getUserData(user.id);

    if (!item) return ctx.interaction.reply({
        content: 'Item not found'
    });

    if (!userData) return ctx.interaction.reply({
        content: 'User not found'
    });

    for (let i = 0; i < amount; i++) {
        userData.items.push(item.id);
    }
    ctx.client.database.saveUserData(userData);
    ctx.interaction.reply({
        content: `${item.emoji} \`x${amount} ${item.name}\` has been added to ${user.tag}'s inventory!`
    });


};
