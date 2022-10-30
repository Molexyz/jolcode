import type { SlashCommand, UserData, Stand } from '../../@types';
import type { Shop } from '../../@types';

import { MessageAttachment, MessageSelectMenu, MessageActionRow, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable, Message } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';
import * as NPCs from '../../database/rpg/NPCs';


export const Spooky_Candy_Dealer: Shop = {
    name: 'Spooky Candy Dealer\'s Shop',
    items: [
        Items.Tonio_Special_Recipe,
        Items.Spaghetti_Bowl,
        Items.Salad_Bowl,
        Items.Ramen_Bowl,
        Items.Pizza
    ],
    emoji: '🎃',
    color: 'ORANGE'
}


export const name: SlashCommand["name"] = "event";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "event",
    description: "[SUB-COMMANDS]",
    options: [{
        type: 1,
        name: "info",
        description: "Display information about the halloween event",
        options: []
    }, {
        type: 1,
        name: "shop",
        description: "Display the haloween event shop",
        options: []
    }]
};



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData) => {

    if (ctx.interaction.options.getSubcommand() === "info") {
        ctx.makeMessage({
            embeds: [{
                title: "🎃 Happy Halloween 🎃",
                description: `${Emojis.spooky_candy} The goal of the event is to collect Spooky Candies.
${Emojis.spooky_candy}  With these candies you can buy things (use the \`/event shop\` command to see what you can buy).
${Emojis.spooky_candy}  The only ways to get spooky candies are by: beating Spooky NPCs, using the \`/loot\` command (search in a pumpkin), voting (\`/vote\`), by claiming your daily (\`daily claim\`), by finishing your daily quests (\`daily quests\`) and by trading (\`/trade\`).

🍀 Good luck!`,
                color: "ORANGE",
                thumbnail: {
                    url: "https://media.discordapp.net/attachments/1028000883092508803/1031942138717556856/Screenshot_20221007-1101012.png"
                }
            }]
        })

    } else {
        const items = [{
            name: "Random Stand Disc",
            emoji: Emojis.disk,
            price: 5,
            trigger: () => {
                const StandsArray: Stand[] = Object.keys(Stands).map(r => Stands[r as keyof typeof Stands]).filter(s => s.available);
                const percent: number = Util.getRandomInt(0, 100);

                let stand;
                
                if (percent <= 4) {
                    stand = Util.randomArray(StandsArray.filter(r => r.rarity === "S"));
                } else if (percent <= 20) {
                    stand = Util.randomArray(StandsArray.filter(r => r.rarity === "A"));
                } else if (percent <= 40) {
                    stand = Util.randomArray(StandsArray.filter(r => r.rarity === "B"));
                } else {
                    stand = Util.randomArray(StandsArray.filter(r => r.rarity === "C"));
                }
                userData.items.push(stand.name+":disk");
                ctx.client.database.saveUserData(userData);

                return `You got a ${stand.name} Stand Disc!`;
            }

        }, {
            name: "Mysterious Arrow",
            emoji: Emojis.mysterious_arrow,
            price: 5,
            trigger: () => {
                userData.items.push(Items.Mysterious_Arrow.id);
                ctx.client.database.saveUserData(userData);
                return `You successfully bought a ${Items.Mysterious_Arrow.id}!`;
            }
        }, {
            name: "Skill Point Reset Potion",
            emoji: Emojis["sp_potion"],
            price: 3,
            trigger: () => {
                userData.items.push(Items.Skill_Points_Reset_Potion.id);
                ctx.client.database.saveUserData(userData);
                return `You successfully bought a ${Items.Skill_Points_Reset_Potion.name}!`;
            }
        },{
            name: "Random S tier Stand",
            emoji: Emojis.disk,
            price: 50,
            trigger: () => {
                const StandsArray: Stand[] = Object.keys(Stands).map(r => Stands[r as keyof typeof Stands]).filter(s => s.available);
                const stand = Util.randomArray(StandsArray.filter(r => r.rarity === "S"));
                userData.items.push(stand.name+":disk");
                ctx.client.database.saveUserData(userData);

                return `You got a ${stand.name} Stand Disc!`;
            }
        }, {
            name: `${Stands["Halloween_Spooks"].name} Stand Disc`,
            emoji: Emojis.disk,
            price: 65,
            trigger: () => {
                userData.items.push(Stands["Halloween_Spooks"].name+":disk");
                ctx.client.database.saveUserData(userData);

                return `You got a ${Stands["Halloween_Spooks"].name} Stand Disc!`;
            }
        }];

        let msg: any;

        async function updMsg() {
            const embed = new MessageEmbed()
            .setTitle(`${Spooky_Candy_Dealer.emoji} ${Spooky_Candy_Dealer.name}`)
            .setColor(Spooky_Candy_Dealer.color as ColorResolvable)
            .setDescription(`You have ${userData.items.filter(r => r === "spooky_candy").length} Spooky Candies.`)
            .setFooter({ text: `You can buy items by clicking on the buttons below.`});

        const buttons = items.map(r => new MessageButton()
            .setCustomId(r.name)
            .setLabel(`${r.name} (${r.price} Spooky Candies)`)
            .setEmoji(r.emoji)
            .setStyle("PRIMARY")
        );

        const row = new MessageActionRow()
            .addComponents(buttons);

        msg = await ctx.makeMessage({
            embeds: [embed],
            components: [row]
        });

        }

        await updMsg();


        const filter = (i: MessageComponentInteraction) => i.user.id === ctx.interaction.user.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async (i: MessageComponentInteraction) => {
            if ((await ctx['componentAntiCheat'](i, userData)) === true) return;
            i.deferUpdate().catch(() => {});

            const item = items.find(r => r.name === i.customId);
            if (!item) return;

            if (userData.items.filter(r => r === "spooky_candy").length < item.price) {
                ctx.interaction.followUp({ content: `You don't have enough Spooky Candies to buy this item!`, ephemeral: true }).catch(() => {});
                return;
            }

            for (let i = 0; i < item.price; i++) {
                Util.removeItem(userData.items, "spooky_candy");
            }
            ctx.client.database.saveUserData(userData);

            ctx.interaction.followUp({ content: item.trigger(), ephemeral: false }).catch(() => {});
            updMsg()
        });
    }


        
};

