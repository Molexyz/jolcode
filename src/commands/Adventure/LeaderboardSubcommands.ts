import type { SlashCommand, UserData, Item } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';

export const name: SlashCommand["name"] = "leaderboard";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "leaderboard",
    description: "[SUB-COMMANDS]",
    options: [
        {
            name: "coins",
            description: "Display the most richest players",
            type: 1
        }, {
            name: "level",
            description: "Display the most powerful players",
            type: 1
        }, {
            name: "ranked",
            description: "Display the top ranked users",
            type: 1
        }, {
            name: "items",
            description: "Display the less collected items (the rarest)",
            type: 1
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const firstID = Util.generateID();
    const backID = Util.generateID();
    const userPosID = Util.generateID();
    const nextID = Util.generateID();
    const lastID = Util.generateID();

    const firstBTN = new MessageButton()
        .setEmoji('⏪')
        .setStyle('SECONDARY')
        .setCustomId(firstID);
    const backBTN = new MessageButton()
        .setEmoji('◀')
        .setStyle('SECONDARY')
        .setCustomId(backID);
    const userPosBTN = new MessageButton()
        .setEmoji('📍')
        .setStyle('SECONDARY')
        .setCustomId(userPosID);
    const nextBTN = new MessageButton()
        .setEmoji('▶')
        .setStyle('SECONDARY')
        .setCustomId(nextID);
    const lastBTN = new MessageButton()
        .setEmoji('⏩')
        .setStyle('SECONDARY')
        .setCustomId(lastID);

    let rows: any[] = (await ctx.client.database.redis.client.keys("cachedUser*").then(async keys => await Promise.all(keys.map(async key => JSON.parse(await ctx.client.database.redis.client.get(key)))))); // OLD CODE (causing too much latency) await ctx.client.database.postgres.client.query(`SELECT * FROM users WHERE adventureat IS NOT NULL AND level IS NOT NULL AND xp IS NOT NULL ORDER BY level DESC, xp DESC`).then(r => r.rows);
    let title: string;
    let strfilter: Function;
    let page: number = 1;

    switch (ctx.interaction.options.getSubcommand()) {
        case "coins":
            title = `${Emojis.jocoins} Coins leaderboard`;
            strfilter = (user: UserData) => Emojis.replyEnd + " " + `${Util.localeNumber(user.money)} ${Emojis.jocoins}`;
            rows = rows.sort((a, b) => b.money - a.money);
            break;
        case "items":
            let itemsList: { [key: string]: number } = {};
            let itemsTotal: number = 0;
            for (const user of rows) {
                for (const item of user.items) {
                    const xItem = Util.getItem(item);
                    if (xItem) {
                        itemsTotal++;
                        if (!itemsList[xItem.name]) itemsList[xItem.name] = 0;
                        itemsList[xItem.name]++;
                    }
                }
            }
            const rarestItems: Item[] = Object.keys(itemsList).sort((a, b) => itemsList[a] - itemsList[b]).map(item => Util.getItem(item)).filter(item => item) as Item[];
            title = `${rarestItems[0].emoji} Items leaderboard`;
            strfilter = (item: Item) => Emojis.replyEnd + " " + `${item.emoji} ${Util.localeNumber(itemsList[item.name])} ${item.name} (${(itemsList[item.name] / itemsTotal * 100).toFixed(3)}%)`;
            rows = rarestItems;
            break;
        case "level":
            title = `${Emojis.a_} Level Leaderboard`;
            strfilter = (user: UserData) => Emojis.replyEnd + " " + `${Emojis.a_} LVL **${user.level}** with **${Util.localeNumber(user.xp)}** ${Emojis.xp}`;
            rows = rows.sort((a: UserData, b: UserData) => (b.level * 1000000000000000) + b.xp - (a.level * 1000000000000000) + a.xp);
            break;
        case "ranked":
            title = `⚔️ Ranked Leaderboard`;
            function getRatio(user: UserData) {
                let ratio: string | number = (user.stats.rankedBattle?.wins ?? 0) / (user.stats.rankedBattle?.losses ?? 0);
                if (isNaN(ratio)) ratio = -1;
                if (ratio === Infinity && (user.stats.rankedBattle?.wins ?? 0) < 3) ratio = -1
                return ratio;            
            }
            strfilter = (user: UserData) => `> :regional_indicator_w:ins: ${Util.localeNumber(user.stats?.rankedBattle?.wins ?? 0)}\n> :regional_indicator_l:osses: ${Util.localeNumber(user.stats?.rankedBattle?.losses ?? 0)}\n:regional_indicator_w:/:regional_indicator_l: Ratio: ${getRatio(user).toFixed(2)}`;
            rows = rows.filter(r => getRatio(r) !== -1).sort((a: UserData, b: UserData) => (getRatio(b) * 100) - (getRatio(a) * 100));
            break;
    };

    const userPosition = rows.findIndex(u => u.id === ctx.author.id) + 1;

    function goToPage(p: number) {
        const users = rows.slice((p - 1) * 10, p * 10);
        const fields: { name: string, value: string, inline?: boolean }[] = [];
        for (let i = 0; i < users.length; i ++) {
            const user = users[i];
            if (user.tag) {
                fields.push({
                    name: `${(p * 10) + i - 9} - ${user.tag}`,
                    value: strfilter(user)
                });    
            } else {
                // it's an item
                fields.push({
                    name: `${(p * 10) + i - 9} - ${user.name}`,
                    value: strfilter(user)
                });
            }
        }
        ctx.makeMessage({
            embeds: [{
                title: title,
                fields: fields,
                description: ctx.interaction.options.getSubcommand() !== "items" ? `${Emojis.replyEnd} 📍 Your position: \`${userPosition}\`/\`${rows.length}\`` : undefined,
                color: 'BLURPLE',
                footer: {
                    text: `Page ${p}/${Math.ceil(rows.length / 10)}`
                }
            }],
            components: [
                Util.actionRow([ firstBTN, backBTN, userPosBTN, nextBTN, lastBTN ])
            ]
        });
    }
    goToPage(page);

    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => { }); // eslint-disable-line no-empty-function
        return (i.customId === firstID || i.customId === backID || i.customId === nextID || i.customId === lastID || i.customId === userPosID) && i.user.id === userData.id;
    }
    function addPage(p: number){
        page += p;
        if (page > Math.ceil(rows.length / 10)) page = 1;
        if (page < 1) page = Math.ceil(rows.length / 10);
        
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
    ctx.timeoutCollector(collector);

    collector.on('collect', async (i: MessageComponentInteraction) => {
        ctx.timeoutCollector(collector);
        switch (i.customId) {
            case firstID:
                page = 1;
                break;
            case backID:
                addPage(-1);
                break;
            case nextID:
                addPage(1);
                break;
            case lastID:
                page = Math.ceil(rows.length / 10);
                break;
            case userPosID:
                page = Math.floor(userPosition / 10) + 1;
                break;
        }
        goToPage(page);
    });

};
