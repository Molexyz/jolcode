import type { UserData, Quest } from '../../@types';
import { MessageButton, MessageComponentInteraction } from 'discord.js';
import * as Quests from './Quests';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json'
import InteractionCommandContext from '../../structures/Interaction';

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export const remove_thing_kakyoin = async (ctx: InteractionCommandContext, userData: UserData) => {
    const baseText = ctx.translate("action:REMOVE_THING_KAKYOIN.BASE");
    const failedText = ctx.translate("action:REMOVE_THING_KAKYOIN.FAILED");
    const successText = ctx.translate("action:REMOVE_THING_KAKYOIN.SUCCESS");

    ctx.client.database.setCooldownCache("cooldown", userData.id);

    await ctx.makeMessage({
        content: baseText,
        components: []
    });
    await wait(3000);

    if (Util.getRandomInt(1, 3) === 2) {
        await ctx.makeMessage({
            content: baseText + " " + failedText,
            components: []
        });
        for (let i = 0; i < userData.chapter_quests.length; i++) {
            if (userData.chapter_quests[i].id === "action:remove_thing_kakyoin") {
                userData.chapter_quests[i] = Quests.bring_kakyoin_hospital;
                break;
            };
        };

    } else {
        await ctx.makeMessage({
            content: baseText + " " + successText,
            components: []
        });
        for (let i = 0; i < userData.chapter_quests.length; i++) {
            if (userData.chapter_quests[i].id === "action:remove_thing_kakyoin") {
                userData.chapter_quests[i].completed = true;
                break;
            }
        }
    }
    ctx.client.database.delCooldownCache("cooldown", userData.id);
    ctx.client.database.saveUserData(userData);    
};

export const bring_kakyoin_hospital = async (ctx: InteractionCommandContext, userData: UserData) => {
    if (userData.money < 5000) {
        return ctx.sendT("action:BRING_KAKYOIN_HOSPITAL.MONEY", {
            components: []
        });
    }
    userData.money -= 5000;
    // vaidate quest
    for (let i = 0; i < userData.chapter_quests.length; i++) {
        if (userData.chapter_quests[i].id === "action:bring_kakyoin_hospital") {
            userData.chapter_quests[i].completed = true;
            break;
        }
    }
    userData.chapter_quests.push(Quests.KAKYOIN_BACK);
    ctx.client.database.saveUserData(userData);
    ctx.sendT("action:BRING_KAKYOIN_HOSPITAL.SUCCESS", {
        components: []
    });
}

export const analyse_hair = async(ctx: InteractionCommandContext, userData: UserData) => {
    // validate quest
    for (let i = 0; i < userData.chapter_quests.length; i++) {
        if (userData.chapter_quests[i].id === "action:analyse_hair") {
            userData.chapter_quests[i].completed = true;
            break;
        }
    }
    userData.chapter_quests.push(Quests.SPEEDWAGON_ANSWER);
    ctx.client.database.saveUserData(userData);
    ctx.sendT("action:ANALYSE_HAIR.SUCCESS", {
        components: []
    });
}

export const tygad = async(ctx: InteractionCommandContext, userData: UserData) => {
    // validate quest
    for (let i = 0; i < userData.chapter_quests.length; i++) {
        if (userData.chapter_quests[i].id === "action:tygad") {
            userData.chapter_quests[i].completed = true;
            break;
        }
    }
    userData.chapter_quests.push(Quests.TYGAD_ANSWER);
    ctx.client.database.saveUserData(userData);
    ctx.sendT("action:TYGAD.SUCCESS", {
        components: []
    });
}

export const gotoairport = async(ctx: InteractionCommandContext, userData: UserData) => {
    const slowPrice = 5000;
    const fastPrice = 15000;
    const slowPriceID = Util.generateID();
    const fastPriceID = Util.generateID();
    const slowPriceTime = Date.now() + ((60000 * 60) * 2);
    const fastPriceTime = Date.now() + ((60000 * 60) / 2);
    const slowPriceBTN = new MessageButton()
        .setCustomId(slowPriceID)
        .setLabel(Util.localeNumber(slowPrice))
        .setEmoji(Emojis.jocoins)
        .setStyle("PRIMARY");
    const fastPriceBTN = new MessageButton()
        .setCustomId(fastPriceID)
        .setLabel(Util.localeNumber(fastPrice))
        .setEmoji(Emojis.jocoins)
        .setStyle("SECONDARY");
    await ctx.sendT("action:GO_TO_AIRPORT.BASE", {
        components: [Util.actionRow([slowPriceBTN, fastPriceBTN])],
        slowPrice: Util.localeNumber(slowPrice)
    });
    const filter = async (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {});
        return (i.customId === slowPriceID || i.customId === fastPriceID) && i.user.id === userData.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
    collector.on("collect", async (i: MessageComponentInteraction) => {
        const AntiCheatResult = await ctx.componentAntiCheat(i, userData);
        if (AntiCheatResult === true) {
            return collector.stop();
        }
        const price = i.customId === slowPriceID ? slowPrice : fastPrice;
        if (userData.money < price) {
            await ctx.sendT("action:GO_TO_AIRPORT.MONEY", {
                components: []
            });
            return;
        }
        // validate quest
        for (let i = 0; i < userData.chapter_quests.length; i++) {
            if (userData.chapter_quests[i].id === "action:gotoairport") {
                userData.chapter_quests[i].completed = true;
                break;
            }
        }
        userData.money -= price;
        const toPushQuest = Quests.Get_At_The_Morioh_Airport;
        if (price == slowPrice) {
            ctx.sendT("action:GO_TO_AIRPORT.SLOW", {
                components: []
            });
            toPushQuest.timeout = slowPriceTime;
        } else {
            ctx.sendT("action:GO_TO_AIRPORT.FAST", {
                components: []
            });
            toPushQuest.timeout = fastPriceTime;
        }
        userData.chapter_quests.push(toPushQuest);
        ctx.client.database.saveUserData(userData);

    });
    
}