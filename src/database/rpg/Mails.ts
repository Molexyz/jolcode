import type { Mail, Quest, Chapter, NPC } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Items from './Items';
import * as NPCs from './NPCs';
import * as Quests from './Quests';

const Defeat = (npc: NPC) : Quest => {
    return {
        id: 'defeat:' + npc.id,
        npc: {
            ...npc,
            max_health: npc.health,
            max_stamina: npc.stamina
        }
    }
}

export const P1C1_GP: Mail = {
    id: "p1c2:gp",
    author: NPCs.Harry_Lester,
    object: "My granson...",
    content: "I hope you are doing well! We haven't seen each other for 2 years now. I hope that since you entered high school you have not had any problems and that you are doing well. If you have any problems, don't hesitate to see me! (especially for problems in fighting, don't forget how strong I am). Oh and, look at your balance, I made you a surprise! Good luck with your studies!\n\nTake care!",
    date: Date.now(),
    footer: 'From your grandpa ❤️',
    prize: {
        money: 500
    },
    archived: false
}

export const SUPPORT_THXREM: Mail = {
    id: "support:thxrem",
    author: NPCs.Jolyne_Team,
    object: "PREMIUM",
    content: `Hello {{userName}},\n
Thank you for becoming a Patreon! Each and every donation keeps Jolyne alive and helps the developer stay motivated.
As a thank you, I gave you **7,500** <:xp:925111121600454706> and **25,000** <:jocoins:927974784187392061>. Want more? Take these 15 arrows, it's free.`,
    date: Date.now(),
    footer: 'Thanks!',
    prize: {
        items: [
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
        ]
    },
    archived: false
}

export const P1C2_KAKYOIN_BACK: Mail = {
    id: "p1c2:kakyoin_back",
    author: NPCs.Kakyoin,
    object: "Yo!",
    content: `Yooooooo **{{userName}}** !\n\nWe haven't seen each other for a long time... I'm sorry for what happened, I know you'll find it hard to believe but I was manipulated...\nI wonder how you got your stand... Well, to make it up to you, I'll buy you 10 pizzas. I know it's nothing but it's better than nothing ¯\\(ツ)_/¯
        
BTW today some **bandits** attacked my sister, but I can't do anything since i'm in the hospital. Please beat their asses for me !1!1!!1`,
    date: Date.now(),
    footer: 'DONT LOSE OR ELSE ILL KILL YOU!1!111!1',
    chapter_quests: [
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Strong_Bandit),
        Defeat(NPCs.Strong_Bandit),
        Defeat(NPCs.Strong_Bandit),
        Defeat(NPCs.Bandit_Boss)
    ],
    prize: {
        items: [
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
        ]
    },
    archived: false
}

export const P1C2_SPEEDWAGON_DIO_HAIR: Mail = {
    author: NPCs.SPEEDWAGON_FOUNDATION,
    id: "p1c2:speedwagon_diohair",
    object: "Analysis completed.",
    content: `Hello **{{userName}}** ,\n\Thank you for bringing us this hair. This hair is from a criminal named "Dio". You can see what this Dio looks like just below the email (attachments). If you ever see this Dio again (even if it is impossible), please contact us immediately.
(Picture of DIO)`,
    archived: false,
    image: "https://cdn.discordapp.com/attachments/930147452579889152/942118200043245619/Photo_de_Dio.png",
    emoji: "📧",
    date: Date.now(),
    footer: "Sincerely, THE SPEEDWAGON FOUNDATION"
}

const Go_To_Airport: Quest = {
    id: "action:gotoairport",
    i18n: "GO_TO_AIRPORT",
    emoji: "🚕",
    completed: false
}
export const GF_MDIO: Mail = {
    author: NPCs.Harry_Lester,
    id: "gf:mdio",
    object: "Dio..",
    content: `My grandson... So Dio was not dead...
Well, at least you're okay. We have to do something as soon as possible, humanity is in danger, we have to get rid of him. I am waiting for you at the airport of Morioh with your friend Kakyoin, don't tell me how I got him here, come quickly find us, I am accompanied by a very strong man...`,
    archived: false,
    emoji: "📧",
    date: Date.now(),
    footer: "DONT DIE!!!!",
    chapter_quests: [Go_To_Airport]
}

export const CHRISTMAS_2022: Mail = {
    author: NPCs.Santa_Claus,
    id: "christmas:2022",
    object: "🦌 Ho ho ho...",
    content: `As I was getting ready to come to Morioh and distribute gifts to all the inhabitants, someone stole all my Candy Canes and threw them everywhere. Please bring me back my Candy Canes and I'll give you some rewards in exchange! Without my Candy Canes, my reindeer will refuse to fly, so I won't be able to give you presents on Christmas Eve. I ask all of you, inhabitants of Morioh, to help me find all my Candy Canes and eventually beat my brother, Liam O'Platinum, who stole all my Candy Canes
Use the \`/event trade\` command to trade your Candy Canes with me.

*Event ends <t:1672527600:R>*`,
    archived: false,
    date: Date.now(),
    footer: "Merry Christmas!",
    prize: {
        items: [
            Items.Candy_Cane,
            Items.Candy_Cane
        ]
    },
    image: "https://cdn.discordapp.com/attachments/1026886547460591647/1055878867572760626/Napalm_Christmas_Time_ZA_WARUDO_c48342ea-e045-4a08-8070-96947caed9ed.png"
}

export const MERRY_CHRISTMAS_2022: Mail = {
    author: NPCs.Santa_Claus,
    id: "merry_christmas:2022",
    object: "🦌 Merry Christmas!",
    content: `Thank you for helping me find my Candy Canes! I got enough to make my reindeer fly again. Here are your rewards, I hope you like them!`,
    archived: false,
    date: 1671922800000,
    footer: "Merry Christmas!",
    prize: {
        items: [
            Items.Christmas_Gift
        ]
    },
}

export const STAMINA_HEALTH_NERF_INFO: Mail = {
    author: NPCs.Jolyne_Team,
    id: "jolyne:nerf_skill_points",
    object: "Stamina & Health nerf",
    content: `Hello,
In order to make the RPG more balanced, we decided to nerf stamina & health for everyone. Before, your stamina & health were depending 30% on your level 70% on your skill points (the % are not accurate, just an estimation).
Now, it mostly depends on the amount of skill points you've put.
Everytime you level up, you will get +2 health.
Your stamina will 100% depend on your skill points (stamina skill tree).

If you have any questions, feel free to ask them in the [support server](https://discord.gg/jolyne).`,
    archived: false,
    date: Date.now(),
    footer: "Jolyne Team",
    prize: {
        items: [
            Items.Skill_Points_Reset_Potion
        ]
    }
} 