import type { SlashCommand, UserData, Item, Mail, Quest } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';
import * as NPCs from '../../database/rpg/NPCs';
import * as Mails from '../../database/rpg/Mails';

export const name: SlashCommand["name"] = "e-mails";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "e-mails",
    description: "[SUB-COMMANDS]",
    options: [{
        type: 1,
        name: "view",
        description: "Display your e-mails",
        options: []
    }, {
        type: 1,
        name: "archived",
        description: "Display your archived e-mails",
        options: []
    }]
};

export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    let currentMail: Mail["id"];

    const goBackID = Util.generateID();
    const mailsSelectionID = Util.generateID();
    const deleteID = Util.generateID();
    const deleteBTN = new MessageButton()
        .setCustomId(deleteID)
        .setLabel('Delete')
        .setEmoji("🗑️")
        .setStyle('DANGER')
    const goBackBTN = new MessageButton()
        .setCustomId(goBackID)
        .setEmoji("◀️")
        .setStyle("SECONDARY");
    const mailsSelection = new MessageSelectMenu()
        .setCustomId(mailsSelectionID)
        .setPlaceholder("Select an e-mail")
        .setMinValues(1)
        .setMaxValues(1);
    const actionID = Util.generateID();
    const showOnlyArchived = ctx.interaction.options.getSubcommand() === "archived";
    const emoji = showOnlyArchived ? "📤" : "📥";
    const actionBTN = new MessageButton()
        .setCustomId(actionID)
        .setEmoji(emoji)
        .setLabel(showOnlyArchived ? "Unarchive" : "Archive")
        .setStyle(showOnlyArchived ? "PRIMARY" : "SECONDARY")
    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {});
        return (i.customId === mailsSelectionID || i.customId === goBackID || i.customId === actionID) && i.user.id === userData.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
    ctx.timeoutCollector(collector, 60000, true);
    menuEmbed();
    collector.on("collect", (i: MessageComponentInteraction) => {
        if (i.customId === mailsSelectionID && i.isSelectMenu()) {
            const mail = userData.mails.find(m => m.id === i.values[0]);
            if (!mail) return collector.stop();
            showMail(mail);
        } else if (i.customId === goBackID) {
            menuEmbed();
        } else if (currentMail) {
            const mail = userData.mails.find(m => m.id === currentMail);
            if (!mail) return collector.stop();
            if (i.customId === deleteID) {
                if (mail.id === Mails.CHRISTMAS_2022.id || mail.id === Mails.MERRY_CHRISTMAS_2022.id) {
                    ctx.interaction.followUp({
                        content: "🎄 | You can" + "n't do that.",
                    });
                } else {
                    userData.mails = userData.mails.filter(m => m.id !== currentMail);
                    ctx.interaction.followUp({
                        content: `🗑️ | The email from **${mail.author.name}** (${mail.author.email}) has been deleted.`,
                    });    
                }
            } else if (i.customId === actionID) {
                if (mail.id === Mails.CHRISTMAS_2022.id || mail.id === Mails.MERRY_CHRISTMAS_2022.id) {
                    ctx.interaction.followUp({
                        content: "🎄 | You can" + "n't do that.",
                    });
                } else {
                    for (let i = 0; i < userData.mails.length; i++) {
                        if (userData.mails[i].id === currentMail) {
                            userData.mails[i].archived = !userData.mails[i].archived;
                        }
                    }
                    ctx.interaction.followUp({
                        content: `${!mail.archived ? "📤" : "📥"} | The email from **${mail.author.name}** (${mail.author.email}) has been ${mail.archived ? "archived" : "unarchived"}.`,
                    });    
                }
            }
            ctx.client.database.saveUserData(userData);
            menuEmbed();
        }
    })
    function menuEmbed() {
        currentMail = undefined;
        if (userData.mails.filter(m => m.archived === showOnlyArchived).length === 0) {
            collector.stop();
            return ctx.makeMessage({
                content: `📤 | You don't have any ${showOnlyArchived ? "archived" : "unarchived"} e-mails.`,
                components: [],
                embeds: []
            });
        }
        mailsSelection.options = [];
        const mails = [...new Set(userData.mails.filter(mail => mail.archived === showOnlyArchived))];
        const fields: { name: string, value: string, inline?: boolean }[] = [];

        for (const mail of mails) {
            const realMail = {...Object.values(Mails).find(m => m.id === mail.id) };


            if (realMail.author) {
                mail.author = Object.values(NPCs).find(e => e.name === realMail.author.name) ?? realMail.author;
            }
            fields.push({
                name: (mail.emoji ?? mail.author.emoji) + " | " + mail.object,
                value: `<:reply:936903236395360256> From: \`${mail.author.name} (${mail.author.email ?? "Anonymous"})\`\n<:replyEnd:936903465941217301> Date: \`${Util.formatDate(mail.date)}\` (<t:${(mail.date / 1000).toFixed(0)}:R>)`
            });
            mailsSelection.addOptions([
                {
                    label: mail.object,
                    description: `From: ${mail.author.email}`,
                    value: mail.id,
                    emoji: mail.emoji ?? mail.author.emoji
                }
            ])
        }
        ctx.makeMessage({
            embeds: [{
                author: { iconURL: ctx.interaction.user.displayAvatarURL({ dynamic: true }), name: `Inbox` },
                color: "#70926c",
                fields: fields,
                description: `${emoji} You have ${mails.length} ${showOnlyArchived ? "archived" : "unarchived"} e-mails.`
            }],
            components: [Util.actionRow([ mailsSelection ])]
        });

    }
    function showMail(mail: Mail) {
        const realMail = {...Object.values(Mails).find(m => m.id === mail.id) };
        ;
        currentMail = mail.id;
        const fields: { name: string, value: string, inline?: boolean }[] = [];
        let saveData: boolean = false;

        Util.forEveryQuests(userData, (q: Quest) => q.id.startsWith('rdem'), (quest: Quest) => {
            let tord = quest.id.split("+")[1];
            if (mail.id === tord) {
                quest.completed = true;
                saveData = true;
            }
        });

        if (mail.prize) {
            saveData = true;
            const prize: string[] = [];
            const emoji = {
                money: Emojis.jocoins,
                xp: Emojis.xp
            }
            Object.keys(realMail.prize).forEach((key) => {
                if (typeof realMail.prize[key as keyof typeof realMail.prize] === "number") {
                    // @ts-expect-error
                    userData[key as keyof typeof userData] += realMail.prize[key as keyof typeof mail.prize];
                    prize.push(`${Util.localeNumber((realMail.prize[key as keyof typeof realMail.prize]) as number)} ${emoji[key as keyof typeof emoji]} `);
                } else if (key === "items") { // prize is item
                    for (const item of realMail.prize.items) {
                        userData.items.push(item.id);
                        prize.push(`${item.name} ${item.emoji}`);
                    }
                }
            });
            const uniquePrize = [...new Set(prize)];
            fields.push({
                name: ":gift: Prize",
                value: uniquePrize.map(p => `${p} ${(!p.includes(Emojis.xp) || !p.includes(Emojis.jocoins)) ? `(x${prize.filter(p => p === p).length})` : ""}`).join("\n")
            });
            mail.prize = undefined;
        }

        if (mail.chapter_quests) {
            fields.push({
                name: ":scroll: Chapter quests",
                value: `${realMail.chapter_quests.map(quest => {
                    let bar = ctx.translate(`quest:${quest.i18n}.DESCRIPTION`, {
                        cc: Util.localeNumber(Number(quest.id.split(":")[1])),
                        s: Util.s(Number(quest.id.split(":")[1]))
                    }) + " " + (quest.emoji ? quest.emoji : "");
                    if (quest.id.startsWith("defeat")) {
                        bar = `Defeat ${quest.npc.name}`
                    }
                    return bar;
                }).join("\n")}`
            });
            for (const quest of realMail.chapter_quests) {
                userData.chapter_quests.push(quest)
            }
            mail.chapter_quests = null;
        }
        if (saveData) {
            for (let i = 0; i < userData.mails.length; i++) {
                if (userData.mails[i].id === mail.id) {
                    userData.mails[i] = mail;
                    break;
                }
            }
            ctx.client.database.saveUserData(userData);
        }
        ctx.makeMessage({
            components: [
                Util.actionRow([ deleteBTN, actionBTN ]),
                Util.actionRow([ mailsSelection ]),
                Util.actionRow([ goBackBTN ])
            ],
            embeds: [{
                title: realMail.object,
                fields: fields,
                image: { url: realMail.image },
                color: "#70926c",
                description: `<:reply:936903236395360256> From: \`${realMail.author.name} (${realMail.author.email})\`\n<:replyEnd:936903465941217301> Date: \`${Util.formatDate(mail.date)}\`\n\n${realMail.content.replace(/{{userName}}/gi, ctx.interaction.user.username)}`,
                footer: {
                    text: realMail.footer
                }
            }]
        });
    }
};
