import type { Stand } from "../../@types";
import * as Abilities from "./Abilities";
import * as Emojis from '../../emojis.json';

export const Star_Platinum: Stand = {
    name: "Star Platinum",
    rarity: "S",
    description: "Star Platinum is a very strong humanoid Stand. It was designed to look like a guardian spirit. It was used by [Jotaro Kujo](https://jojo.fandom.com/wiki/Jotaro_Kujo)",
    color: "#985ca3",
    image: "https://static.fandomspot.com/images/07/7837/25-starplatinum-stand-jojo-anime.jpg",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Kick_Barrage,
        Abilities.Star_Finger,
        Abilities.Time_Stop,

    ],
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
        speed: 0,
    },
    text: {
        awakening_text: "OrRrr.. OrrRrRRrRrR... RrrRQRrR....",
        awaken_text: "ORAAAAAAAAAAAAAAAA !!!!",
        timestop_text: "The WORLD!",
        timestop_end_text: "Toki wo Ugokidase.",
    },
    emoji: Emojis.sp,
    available: true
};

export const The_World: Stand = {
    name: "The World",
    rarity: "S",
    description: "The World, a humanoid Stand, is tall and has a very muscular build. It bears a striking resemblance to [Dio Brando](https://jojo.fandom.com/wiki/Dio_Brando) in terms of appearance.",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Kick_Barrage,
        Abilities.Road_Roller,
        Abilities.Time_Stop,
    ],
    color: "YELLOW",
    image: "https://naniwallpaper.com/files/wallpapers/za-warudo/2-za%20warudo-1080x1920.jpg",
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
        speed: 0,
    },
    text: {
        awakening_text: "WrRrR3.. WrRrrR WRYYRrR...",
        awaken_text: "WRRRRYYYYYYYY !!!!",
        timestop_text: "Toki wo TOMARE!",
        timestop_end_text: "Zero...",
    },
    emoji: Emojis.the_world,
    available: true
};

export const The_World__Over_Heaven: Stand = {
    name: "The World: Over Heaven",
    rarity: "SS",
    description: "The World is a humanoid Stand. It is a very tall humanoid with a very muscular build. It bears a striking resemblance to [Dio Brando](https://jojo.fandom.com/wiki/Dio_Brando) in terms of appearance.",
    abilities: [
        Abilities.Reality_Overwriting_Punch,
        Abilities.Road_Roller_DA,
        Abilities.Heaven_Ascended_Smite,
        Abilities.Time_Stop
    ],
    color: "YELLOW",
    image: "https://static.wikia.nocookie.net/jjba/images/4/47/Heaven_Ascension_Dio.png/revision/latest/scale-to-width-down/250?cb=20201125221026",
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
        speed: 0,
    },
    text: {
        awakening_text: "WrRrR3.. WrRrrR WRYYRrR...",
        awaken_text: "OVER HEAVENd !!!!",
        timestop_text: "Toki wo TAMARE!",
        timestop_end_text: "Toki wa Ugokidasu.",

    },
    emoji: Emojis.the_world,
    available: false
};

export const Hierophant_Green: Stand = {
    name: "Hierophant Green",
    rarity: "B",
    description: "Hierophant Green is an elastic and remote Stand, capable of being deployed far away from its user and performing actions. It is the Stand of [Noriaki Kakyoin](https://jojowiki.com/Noriaki_Kakyoin), featured in Stardust Crusaders.",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Emerald_Splash
    ],
    color: "#6AD398",
    image: "https://static.wikia.nocookie.net/jjba/images/c/c8/HierophantGreen.png/revision/latest/scale-to-width-down/350?cb=20140807094417",
    skill_points: {
        strength: 3,
        defense: 1,
        perception: 1,
        stamina: 0,
        speed: 0,
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "Done.",
    },
    emoji: Emojis.hierophant_green,
    available: true
};

export const Aerosmith: Stand = {
    name: "Aerosmith",
    rarity: "C",
    description: "Aerosmith is a plane. It is a long-ranged stand. In the JJBA series, Aerosmith's owner was [Narancia Ghirga](https://jojo.fandom.com/wiki/Narancia_Ghirga)",
    abilities: [
        Abilities.Vola_Barrage,
        Abilities.Little_Boy
    ],
    color: "#0981D1",
    image: "https://static.wikia.nocookie.net/jjba/images/6/66/Aerosmithcolor.png/revision/latest?cb=20180414181107&path-prefix=fr",
    skill_points: {
        strength: 1,
        defense: 1,
        perception: 3,
        stamina: 0,
        speed: 0,
    },
    text: {
        awakening_text: "[awakening in you... :airplane_small:]",
        awaken_text: "Done. Wait, what is 1+1 ??? I forgot what was it???",
    },
    emoji: Emojis.aerosmith,
    available: true
};

export const The_Hand: Stand = {
    name: "The Hand",
    rarity: "A",
    description: "The hand is a humanoid-type stand who can erase things from existence, it was originally owned by [Okuyasu Nijimura](https://jojo.fandom.com/wiki/Okuyasu_Nijimura)",
    abilities: [
        Abilities.Light_Speed_Barrage,
        Abilities.Deadly_Erasure,
    ],
    color: "#1d57e5",
    image: "https://static.wikia.nocookie.net/jjba/images/4/46/The_Hand_Anime.png/revision/latest?cb=20161217225524&path-prefix=fr",
    skill_points: {
        strength: 10,
        defense: 0,
        perception: 0,
        stamina: 0,
        speed: 0,
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "Done. YOOOO BRO did you know that i could erase everything ???? And did you know that bungee gum has the properties of both rubber and gum????",
    },
    emoji: Emojis.the_hand,
    available: true
};

export const Hermit_Purple: Stand = {
    name: "Hermit Purple",
    rarity: "C",
    description: "Hermit Purple is the Stand of [Joseph Joestar](https://jojo.fandom.com/wiki/Joseph_Joestar), featured in Stardust Crusaders, and occasionally in Diamond is Unbreakable. The Hermit Hermit Purple manifests itself as multiple, purple, thorn-covered vines that spawn from its handler's hand.",
    abilities: [
        Abilities.Vine_Slap,
        Abilities.OhMyGod
    ],
    color: "PURPLE",
    image: "https://static.wikia.nocookie.net/heros/images/9/94/Joseph_Joestar_senior_Infobox.jpg/revision/latest?cb=20201223201734&path-prefix=fr",
    skill_points: {
        strength: 0,
        defense: 3,
        perception: 2,
        stamina: 0,
        speed: 0,
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "lol what who tf are you??? You ain't a Joestar doe",
    },
    emoji: Emojis.hermit_purple,
    available: true
};

export const Silver_Chariot: Stand = {
    name: "Silver Chariot",
    rarity: "C",
    description: "Silver Chariot appears as a thin, robotic humanoid clad in silver, medieval armor, armed with a basket-hilted foil. It is the Stand of [Jean Pierre Polnareff](https://jojo.fandom.com/wiki/Jean_Pierre_Polnareff), primarily featured in Stardust Crusaders ||and appearing briefly in Vento Aureo.||",
    abilities: [
        Abilities.Fencing_Barrage,
        Abilities.Finisher
    ],
    color: "#808080",
    image: "https://static.wikia.nocookie.net/jjba/images/7/7c/SilverChariot.png/revision/latest?cb=20180609123743",
    skill_points: {
        strength: 3,
        defense: 1,
        perception: 1,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "yo, where's my requiem arrow?!?! PLZ REQUIEM ME FAST!!1!1!11!"
    },
    emoji: Emojis.Silverchariot,
    available: true
};

export const Magicians_Red: Stand = {
    name: "Magicians Red",
    rarity: "A",
    description: "Magicians Red is a humanoid figure with a bird-like head. It has a muscular upper body and its feathered legs are sometimes covered in burning flames. It is the Stand of Muhammad Avdol, featured in Stardust Crusaders",
    abilities: [
        Abilities.Crossfire_Hurricane,
        Abilities.Red_Bind,
        Abilities.Bakugo
    ],
    color: "RED",
    image: "https://i.pinimg.com/736x/8a/cb/27/8acb27c4640370a8919e5fdc30d1d581.jpg",
    skill_points: {
        strength: 10,
        defense: 0,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "*angry bird noises*"
    },
    emoji: Emojis.Magiciansred,
    available: true
};

export const Ebony_Devil: Stand = { // This is a private stand, not available in the RPG
    name: 'Ebony Devil',
    rarity: 'C',
    description: '',
    abilities: [
        Abilities.Hatred_powered_Object_Possession
    ],
    color: '#000000',
    image: '',
    skill_points: {
        strength: 0,
        defense: 0,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: Hierophant_Green.text,
    emoji: '\uD83D\uDC7F',
    available: false
}

export const Whitesnake: Stand = {
    name: "Whitesnake",
    rarity: "S",
    description: "Whitesnake is a humanoid Stand of a height and build similar to [Pucci](https://jojo.fandom.com/wiki/Enrico_Pucci)'s. It is sparsely clothed in black, with a mask covering its face to the bottom of where its nose would be, in a piece that rises above its head by half its height in a row of peaks, like a crown.",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Hallucinogen,
        Abilities.Gun,
        Abilities.Stand_Disc
    ],
    color: 'WHITE',
    image: 'https://static.wikia.nocookie.net/jjba/images/e/ea/WhitesnakeAnime1.png/revision/latest?cb=20211202052847&path-prefix=pt-br',
    skill_points: {
        strength: 3,
        defense: 7,
        perception: 10,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "c-moon... made in heaven... RRrRRRrRRR!!!"
    },
    emoji: Emojis.whitesnake,
    available: true
};

export const Gold_Experience: Stand = {
    name: "Gold Experience",
    rarity: "S",
    description: "Gold Experience is a humanoid Stand of slender build and average height, like [Giorno](https://jojo.fandom.com/wiki/Giorno_Giovanna). The top of its head is similar to that of a typical helmet of a soldier with a ladybug-like design, with curved markings similar to the letter J coming down from the eyes on both sides.",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Self_Heal,
        Abilities.Life_Shot,
        Abilities.Life_Giver
    ],
    color: 'GOLD',
    image: 'https://static.wikia.nocookie.net/jjba/images/1/14/Gold_Experience_color.png/revision/latest/scale-to-width-down/285?cb=20161020091009',
    skill_points: {
        strength: 5,
        defense: 15,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "*golden wind ost* 🐞 🐞 🐞"
    },
    emoji: Emojis.gold_experience,
    available: true
};

export const Purple_Haze: Stand = {
    name: "Purple Haze",
    rarity: "A",
    description: "Purple Haze is a humanoid stand of height and and builds similar to Fugo's. Its face and body are patterned by horizontal lozenges of alternating shade, and armor pieces are present on its shoulders, elbows, and knees. It has spikes along its back.",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities['Capsule_Shot'],
        Abilities['Rage'],
        Abilities['Poison_Gas']
    ],
    color: 'PURPLE',
    image: 'https://cdn.discordapp.com/attachments/576020336902930434/986670882695041034/400px-Purple_Haze_Infobox_Manga.png',
    skill_points: {
        strength: 10,
        defense: 0,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "POIIIIIIIISON GAS!"
    },
    emoji: Emojis['purple_haze'],
    available: true
};

export const Tower_Of_Gray: Stand = {
    name: "Tower of Gray",
    rarity: "C",
    description: "Stand of Gray Fly",
    abilities: [
        Abilities['Secondary_Jaw']
    ],
    color: '#808080',
    image: '',
    skill_points: {
        strength: 0,
        defense: 0,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "*tower of gray*"
    },
    emoji: '\uD83D\uDEA8',
    available: false
}
/*
export const Pika_Pika_No_Mi: Stand = {
    name: 'Pika Pika No Mi',
    rarity: 'SS',
    description: 'Pika Pika No Mi (light fruit) is a devil fruit, currently owned by Kizaru (from the One Piece series).',
    color: 'YELLOW',
    abilities: [
        Abilities.Light_Lunge,
        Abilities['Light_Kick'],
        Abilities['Mirror_Kick'],
        Abilities['Jewels_Of_Light']
    ],
    image: 'https://cdn.discordapp.com/emojis/959495096485691412.png',
    skill_points: Star_Platinum.skill_points,
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "*LIGHTOOOO*"
    },
    emoji: '<:Pika:959495096485691412>',
    available: false
}
*/

export const Killer_Queen: Stand = {
    name: "Killer Queen",
    rarity: "S",
    description: "Killer Queen is a visibly muscular humanoid Stand about as tall as Kira himself, light in color overall. In both the manga and anime, it is portrayed as light pink, while in the All Star Battle video game, it is portrayed as white.",
    abilities: [
        Abilities.Coin_Barrage,
        Abilities.Coin_Bomb,
        Abilities.Escape_Plan,
        Abilities.Sheer_Heart_Attack
    ],
    color: 'PURPLE',
    image: 'https://static.wikia.nocookie.net/jjba/images/3/39/Killer_queen_c345.png/revision/latest?cb=20160325163154',
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 2,
        stamina: 3,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "BITES THE DUST..."
    },
    emoji: Emojis.killer_queen,
    available: true
};
// LATER

export const Yellow_Temperance: Stand = {
    name: "Yellow Temperance",
    rarity: "C",
    description: "nn",
    abilities: [
        Abilities.Assimilation
    ],
    color: 'YELLOW',
    image: '',
    skill_points: {
        strength: 0,
        defense: 0,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "nn"
    },
    emoji: "Emojis.yellow_temperance",
    available: false
};

export const Crazy_Diamond: Stand = {
    name: "Crazy Diamond",
    rarity: "S",
    description: "Crazy Diamond is humanoid, with a powerful build and tall stature (about two heads above [Josuke](https://jojo.fandom.com/wiki/Josuke_Higashikata).",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Wall,
        Abilities.Bearing_Shot,
        Abilities.YO_Angelo
    ],
    color: 'BLUE',
    image: 'https://static.wikia.nocookie.net/jjba/images/7/7a/Crazy_Diamond_Anime.Infobox.png/revision/latest?cb=20180622215654&path-prefix=fr',
    skill_points: {
        strength: 10,
        defense: 10,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: ":musical_note: CRAZY NOISY BIZARRE TOWN!!!! :musical_note: "
    },
    emoji: Emojis.crazy_diamond,
    available: true
};

export const Scary_Monsters: Stand = {
    name: "Scary Monsters",
    rarity: "A",
    description: "Scary Monsters is is the Stand of Dr. Ferdinand, featured in Steel Ball Run. It's a blue dinosaur ROARRRR ROARRRR",
    abilities: [],
    color: 'BLUE',
    image: 'https://static.wikia.nocookie.net/jjba/images/6/62/Scary_Monsters.png/revision/latest?cb=20191119194159',
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "ROARRRR ROARRRR"
    },
    emoji: Emojis.scary_monsters,
    available: false
};

export const Halloween_Spooks: Stand = {
    name: "Halloween Spooks",
    rarity: "T",
    description: "Halloween Spooks is a limited stand, available during the Halloween event (2022).",
    abilities: [
        Abilities["Rage"],
        Abilities["Scythe_Slash"],
        Abilities["Injection"],
        Abilities["Mysterious_Gas"],
    ],
    color: 'ORANGE',
    image: 'https://media.discordapp.net/attachments/1028000883092508803/1031942138717556856/Screenshot_20221007-1101012.png?width=412&height=676',
    skill_points: {
        strength: 0,
        defense: 0,
        perception: 0,
        stamina: 0,
        speed: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "HaaaHaaaHaaaa HALLOWEEEEN"
    },
    emoji: '🎃',
    available: false
};

export const Emperor: Stand = {
    name: "Emperor",
    rarity: "S",
    description: "Emperor is a gun. It is an S-tier stand because its only ability is extremely powerful and has a 2 turns cooldown.",
    abilities: [
        Abilities.Homing_Bullets
    ],
    color: 'GREY',
    image: 'https://static.wikia.nocookie.net/jjba/images/c/c5/Emperor.png/revision/latest?cb=20140807090322',
    skill_points: {
        speed: 10,
        defense: 0,
        perception: 0,
        stamina: 0,
        strength: 5
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "ok"
    },
    emoji: Emojis.emperor,
    available: true
};

export const Hanged_Man: Stand = {
    name: "Hanged Man",
    rarity: "B",
    description: "Hanged Man is a Stand that attacks via reflections",
    abilities: [
        Abilities["Light_Manifestation"],
        Abilities.Wrist_Knives
    ],
    color: 'WHITE',
    image: "http://myanimeshelf.com//upload/dynamic/2015-08/07/jjba-stardust-crusaders-hanged-man-72.png",
    skill_points: {
        speed: 0,
        defense: 0,
        perception: 0,
        stamina: 0,
        strength: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "ok"
    },
    emoji: "<:hangedman:1051526743925739593>",
    available: true
};

export const Buff_OPlatinum: Stand = {
    ...Star_Platinum,
    name: "Buff O'Platinum",
    image: "https://media.discordapp.net/attachments/1026886547460591647/1055873607726796820/Napalm_Christmas_Time_Star_Platinum_678444c9-593c-49d6-bfc9-b20ca76d8dce.png",
    rarity: "T",
    emoji: "<:buffoplatinum:1055875166812524554>",
    description: "Buff O'Platinum is a a variant of Star Platinum. Was obtainable during the Christmas event (2022)."
};

export const StickyFingers: Stand = {
    name: "Sticky Fingers",
    rarity: "A",
    description: "Sticky Fingers is the Stand of Bruno Bucciarati, featured in the fifth part of the JoJo's Bizarre Adventure series, Vento Aureo. Sticky Fingers is a short-range humanoid Stand that can create zippers on any surface.\n\n:warning: Developer's note: THIS STAND WILL GET REWORKED IN V3.0.0 OF JOLYNE",
    abilities: [
        Abilities["Stand_Barrage"],
        Abilities["ZipperHeal"],
        Abilities["ExtendedPunch"],
        Abilities["Arrivederci"]
    ],
    color: 'BLUE',
    image: "https://static.jojowiki.com/images/thumb/7/78/latest/20221006032155/Sticky_Fingers_Infobox_Anime.png/400px-Sticky_Fingers_Infobox_Anime.png",
    skill_points: {
        strength: 5,
        defense: 5,
        stamina: 5,
        speed: 0,
        perception: 0
    },
    text: Hanged_Man.text,
    emoji: Emojis.sticky_fingers,
    available: false
};