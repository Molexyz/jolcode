import type { SlashCommand, UserData, Item, Quest } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, SelectMenuInteraction, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Quests from '../../database/rpg/Quests';
import * as NPCs from '../../database/rpg/NPCs';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';

export const name: SlashCommand["name"] = "event";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "event",
    description: "[SUB-COMMANDS]",
    options: [{
        type: 1,
        name: "info",
        description: "Claim your daily bonuses",
        options: []
    }, {
        type: 1,
        name: "trade",
        description: "Display your daily quests",
        options: []
    }]
};

const emojis: { [key: number]: string } = {
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
    10: "🔟"
}



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    if (Date.now() > 1672527600000) return ctx.makeMessage({
        content: Util.makeNPCString(NPCs.Santa_Claus) + " the event is over, boo-yah."
    });


    if (ctx.interaction.options.getSubcommand() === "info") {
        ctx.makeMessage({
            content: Util.makeNPCString(NPCs.Santa_Claus) + " if you want to know more about the event, check your `/e-mails`."
        });
    } else {
        const trades = [{
            give: [ Items.Candy_Cane, Items.Candy_Cane ],
            receive: Items.Mysterious_Arrow
        }, {
            give: [ Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane ],
            receive: Items.Skill_Points_Reset_Potion
        }, {
            give: [ Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane,
                Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane ],
            receive: Items["Star_Platinum_Disc" as keyof typeof Items]
        }, {
            give: [],
            receive: Items.Christmas_Gift
        }, {
            give: [ Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane,
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items["Star_Platinum_Disc" as keyof typeof Items] ],
            receive: Items["Buff_O'Platinum_Disc" as keyof typeof Items]
        }, {
            give: [ Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane,
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane,
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane,
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, 
                    Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane, Items.Candy_Cane,
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow,
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow,
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow,
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow,
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, Items.Mysterious_Arrow, 
                    Items["Buff_O'Platinum_Disc" as keyof typeof Items], Items["Buff_O'Platinum_Disc" as keyof typeof Items], Items["Buff_O'Platinum_Disc" as keyof typeof Items]
                ],
            receive: Items.Requiem_Arrow
        }];
        for (let i = 0; i < 30; i++) trades[3].give.push(Items.Candy_Cane);
        for (let i = 0; i < 10; i++) trades[3].give.push(Items.Mysterious_Arrow);

        for (let i = 0; i < 350; i++) trades[5].give.push(Items.Candy_Cane);
        for (let i = 0; i < 250; i++) trades[5].give.push(Items.Mysterious_Arrow);

        userData.items = userData.items.map(v => Util.getItem(v)?.id  || v);

        function makeMessage() {
            let content = "▬▬▬▬▬▬▬▬▬▬▬**「TRADES」**▬▬▬▬▬▬▬▬▬▬▬▬\n";
            let options: { label: string, value: string, emoji?: string }[] = [];

            for (let i = 0; i < trades.length; i++) {
                const trade = trades[i];
                options.push({
                    label: trade.receive.name,
                    value: String(i),
                    emoji: emojis[i + 1]
                });
                const uniquegive = [...new Set(trade.give)];
                content += `「${emojis[i + 1]}」You give ${uniquegive.map(v => `${v.emoji} \`x${trade.give.filter(r => r.id === v.id).length} ${v.name}\``).join(", ")}\n        ${Emojis.arrowRight} You get  ${trade.receive.emoji} \`x1 ${trade.receive.name}\`\n`;
            }
            content+="\n" + Util.makeNPCString(NPCs.Santa_Claus) + ` you currently have ${Items.Candy_Cane.emoji} **${userData.items.filter(r => r === Items.Candy_Cane.id).length}** Candy Cane(s).\n\n▬▬▬▬▬▬▬▬▬▬**「SELECT MENU」**▬▬▬▬▬▬▬▬▬▬▬`;

            
            const SelectMenu = new MessageSelectMenu()
                .setCustomId(ctx.interaction.id)
                .setPlaceholder('Select your trade.')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(options);
            ctx.makeMessage({
                content: `${content}`,
                components: [Util.actionRow([SelectMenu])]
            });
        }
        makeMessage();

        const filter = async (i: MessageComponentInteraction) => {
            i.deferUpdate().catch(() => {});
            return i.customId === ctx.interaction.id && i.user.id === ctx.interaction.user.id;
        };
        const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
        ctx.timeoutCollector(collector);

        collector.on("collect", async (i: SelectMenuInteraction) => {
            // Anti-cheat
            if (await ctx.client.database.getCooldownCache(userData.id)) return collector.stop("User probably tried to glitch the system.");
            userData = await ctx.client.database.getUserData(userData.id);
            userData.items = userData.items.map(v => Util.getItem(v)?.id  || v);



            const trade = trades[parseInt(i.values[0])];
            const uniquegive = [...new Set(trade.give)];
            const give = uniquegive.map(v => ({ id: v.id, amount: trade.give.filter(r => r.id === v.id).length }));
            const receive = [{ id: trade.receive.id, amount: 1 }];
            
            let status = true;
            for (let i = 0; i < uniquegive.length; i++) {
                const item = uniquegive[i];
                if (userData.items.filter(r => r === item.id).length < trade.give.filter(r => r.id === item.id).length) {
                    status = false;
                    break;
                }
            }

            if (status) {
                for (const item of give) for (let i = 0; i < item.amount; i++) Util.removeItem(userData.items, item.id);
                for (const item of receive) for (let i = 0; i < item.amount; i++) userData.items.push(item.id);
                
                await ctx.interaction.followUp({
                    content: Util.makeNPCString(NPCs.Santa_Claus) + ` you have successfully traded ${uniquegive.map(v => `${v.emoji} \`x${trade.give.filter(r => r.id === v.id).length} ${v.name}\``).join(", ")} for ${trade.receive.emoji} \`x1 ${trade.receive.name}\`!`,
                    components: []
                });
                await ctx.client.database.saveUserData(userData);
            } else {
                await ctx.interaction.followUp({
                    content: Util.makeNPCString(NPCs.Santa_Claus) + ` you don't have enough items to trade for ${trade.receive.emoji} \`x1 ${trade.receive.name}\`!`,
                    ephemeral: true
                });
            }
            
            makeMessage();
        });
    

    
        
    }
};
