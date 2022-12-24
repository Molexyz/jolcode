import type { SlashCommand, UserData, Item, NPC } from '../../@types';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';

export const name: SlashCommand["name"] = "bumpstand";
export const category: SlashCommand["category"] = "private";
export const cooldown: SlashCommand["cooldown"] = 0;
export const isPrivate: SlashCommand["isPrivate"] = true;

export const data: SlashCommand["data"] = {
    name: "bumpstand",
    description: "NO.",
    options: [
        {
            type: 3,
            name: 'stand',
            description: 'WHO?',
            required: true
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    const content = ctx.interaction.options.getString('stand', true);
    const stand = Object.keys(Stands).map(v => Stands[v as keyof typeof Stands]).find(v => v.name.toLowerCase().includes(content.toLowerCase()));
    if (!stand) return ctx.interaction.reply({ content: 'Stand not found' });

    const userData = await ctx.client.database.getUserData(ctx.interaction.user.id);
    userData.stand = stand.name;
    ctx.client.database.saveUserData(userData);
    ctx.interaction.reply({ content: `Stand ${stand.name} has been set!` });

};
