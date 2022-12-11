import type { SlashCommand, UserData, Item, NPC } from '../../@types';
import InteractionCommandContext from '../../structures/Interaction';
import * as Chapters from '../../database/rpg/Chapters';

export const name: SlashCommand["name"] = "finishchapter";
export const category: SlashCommand["category"] = "private";
export const cooldown: SlashCommand["cooldown"] = 0;
export const isPrivate: SlashCommand["isPrivate"] = true;

export const data: SlashCommand["data"] = {
    name: "finishchapter",
    description: "NO.",
    options: []
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {    
    const userData = await ctx.client.database.getUserData(ctx.interaction.user.id);
    userData.chapter_quests = [{ id: "cdaily:1", i18n: "CLAIM_DAILY", total: 1, completed: true}];    ctx.client.database.saveUserData(userData);
    ctx.interaction.reply({ content: `SUCCESS.`, ephemeral: true });


};
