import type { SlashCommand, UserData, Item, NPC } from '../../@types';
import InteractionCommandContext from '../../structures/Interaction';
import * as Chapters from '../../database/rpg/Chapters';

export const name: SlashCommand["name"] = "bumpchapter";
export const category: SlashCommand["category"] = "private";
export const cooldown: SlashCommand["cooldown"] = 0;
export const isPrivate: SlashCommand["isPrivate"] = true;

export const data: SlashCommand["data"] = {
    name: "bumpchapter",
    description: "NO.",
    options: [
        {
            type: 3,
            name: 'chapter',
            description: 'id of the chapter',
            required: true
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    const content = ctx.interaction.options.getString('chapter', true);
    const chapter = Object.keys(Chapters).map(v => Chapters[v as keyof typeof Chapters]).find(v => v.id === Number(content));
    if (!chapter) return ctx.interaction.reply({ content: 'Chapter not found', ephemeral: true });
    
    const userData = await ctx.client.database.getUserData(ctx.interaction.user.id);
    userData.chapter_quests = chapter.quests;
    userData.chapter = chapter.id;
    ctx.client.database.saveUserData(userData);
    ctx.interaction.reply({ content: `Chapter ${chapter.id} has been set!`, ephemeral: true });


};
