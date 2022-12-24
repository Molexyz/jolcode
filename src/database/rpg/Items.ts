import type { Item, UserData, Stand } from "../../@types";
import { MessageAttachment, MessageEmbed, ColorResolvable } from 'discord.js';
import CommandInteractionContext from "../../structures/Interaction";
import * as Emojis from '../../emojis.json';
import * as Stands from './Stands';
import * as Util from '../../utils/functions'
import * as Items from './Items';

export const Pizza: Item = {
  id: "pizza",
  name: "Pizza",
  description: "A delicious pizza",
  rarity: 'C',
  type: "consumable",
  price: 750,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.complete_pizza,
  benefits: {
    health: 75,
  }
};

export const Spaghetti_Bowl: Item = {
  id: "spaghetti_bowl",
  name: "Spaghetti Bowl",
  description: "A bowl of spaghetti",
  rarity: 'C',
  type: "consumable",
  price: 2000,
  tradable: false,
  storable: false,
  usable: true,
  emoji: "🍝",
  benefits: {
    health: 200,
    stamina: 15,
  }
};

export const Salad_Bowl: Item = {
  id: "salad_bowl",
  name: "Salad Bowl",
  description: "A bowl of salad",
  rarity: 'C',
  type: "consumable",
  price: 575,
  tradable: false,
  storable: false,
  usable: true,
  emoji: "🥗",
  benefits: {
    health: 50,
    stamina: 25
  }
};

export const Slice_Of_Pizza: Item = {
  id: "slice_of_pizza",
  name: "Slice of Pizza",
  description: "A slice of pizza",
  rarity: 'C',
  type: "consumable",
  price: 150,
  tradable: true,
  storable: true,
  usable: true,
  emoji: "🍕",
  benefits: {
    health: 10,
  }
};

export const Mysterious_Arrow: Item = {
  id: "mysterious_arrow",
  name: "Mysterious Arrow",
  description: "A mysterious arrow",
  rarity: 'A',
  type: "arrow",
  price: 35000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.mysterious_arrow,
  benefits: {
    stand: 'random'
  },
  use: async (ctx: CommandInteractionContext, userData: UserData) => {
    const StandsArray: Stand[] = Object.keys(Stands).map(r => Stands[r as keyof typeof Stands]).filter(s => s.available);
    const percent: number = Util.getRandomInt(0, 100);
    if (userData.stand) {
      await ctx.sendT("items:MYSTERIOUS_ARROW.ALREADY_STAND", {
        components: []
      });
      await Util.wait(2000);
      await ctx.sendT("items:MYSTERIOUS_ARROW.ALREADY_STAND2");
      return false;
    }
    await ctx.client.database.setCooldownCache("action", userData.id, 1);
    await ctx.sendT("items:MYSTERIOUS_ARROW.MANIFESTING", {
      components: []
    });
    await Util.wait(2000);
    await ctx.sendT("items:MYSTERIOUS_ARROW.INVADING");
    await Util.wait(2000);

    let stand: Stand;
    let color: ColorResolvable;
    if (percent <= 4) {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "S"));
      color = "#2b82ab";
    } else if (percent <= 20) {
      color = "#3b8c4b";
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "A"));
    } else if (percent <= 40) {
      color = "#786d23"
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "B"));
    } else {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "C"));
      color = stand.color;
    }
    userData.stand = stand.name;
    await ctx.client.database.saveUserData(userData);
    await ctx.client.database.delCooldownCache("action", userData.id);

    const standCartBuffer = await Util.generateStandCart(stand);
    const file = new MessageAttachment(standCartBuffer, "stand.png");
    const embed: MessageEmbed = new MessageEmbed()
    .setTitle(stand.name)
    .setImage('attachment://stand.png')
    .setColor(color)
    .setDescription(`**Rarity:** ${stand.rarity}
**Abilities [${stand.abilities.length}]:** ${stand.abilities.map(v => v.name).join(", ")}
**Skill-Points:** +${Util.calculateArrayValues(Object.keys(stand.skill_points).map(v => stand.skill_points[v as keyof typeof stand.skill_points]))}:
${Object.keys(stand.skill_points).map(v => "  • +" + stand.skill_points[v as keyof typeof stand.skill_points] + " " + v).join("\n")}
`);


    ctx.makeMessage({
      content: `${stand.emoji} **${stand.name}:** ${stand.text.awaken_text}`,
      files: [file],
      embeds: [embed]
    });
    return true;

  }
};

export const Cola: Item = {
  id: "cola",
  name: "Cola",
  description: "A fresh can of cola",
  rarity: 'C',
  type: "consumable",
  price: 355,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.cola,
  benefits: {
    stamina: 15
  }
};

export const Candy: Item = {
  id: "candy",
  name: "Candy",
  description: "A sweet candy",
  rarity: 'C',
  type: "consumable",
  price: 50,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🍬',
  benefits: {
    stamina: 5
  }
};

export const Sandwich: Item = {
  id: "sandwich",
  name: "Sandwich",
  description: "A delicious sandwich",
  rarity: 'C',
  type: "consumable",
  price: 100,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🥪',
  benefits: {
    stamina: 10,
    health: 10
  }
}

export const Yellow_Hair: Item = {
  id: "yellow_hair",
  name: "Yellow Hair",
  description: "Some mysterious hairs",
  type: "body_part",
  price: 0,
  tradable: false,
  storable: true,
  usable: false,
  emoji: Emojis.dio,
}

export const Coconut: Item = {
  id: "coconut",
  name: "Coconut",
  description: "A coconut",
  rarity: 'C',
  type: "consumable",
  price: 300,
  tradable: true,
  storable: false,
  usable: true,
  emoji: "🥥",
  benefits: {
    health: 70,
    stamina: 70
  },
}

export const Ancient_Scroll: Item = {
  id: "ancient_scroll",
  name: "Ancient Scroll",
  description: "An ancient scroll that can be used for crafting",
  rarity: 'B',
  type: "scroll",
  price: 5000,
  tradable: true,
  storable: true,
  usable: false,
  emoji: '📜'
}

export const Diamond: Item = {
  id: "diamond",
  name: "Diamond",
  description: "A shiny diamond",
  rarity: 'B',
  type: "other",
  price: 30000,
  tradable: true,
  storable: true,
  usable: false,
  emoji: '💎'
}

export const Burger: Item = {
  id: "burger",
  name: "Burger",
  description: "A yummy burger",
  rarity: 'C',
  type: "consumable",
  price: 100,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🍔',
  benefits: {
    health: 70,
    stamina: 5
  }
}

export const Box: Item = {
  id: "box",
  name: "Box",
  description: "A mysterious box",
  rarity: 'B',
  type: "box",
  price: 5000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '📦',
  use: async (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => {
    const response: boolean = await UseBox(ctx, userData, 'Box', skip, left);
    return response;
  }
}

export const Money_Box: Item = {
  id: "money_box",
  name: "Money Box",
  description: "A money box",
  rarity: 'A',
  type: "box",
  price: 20000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.moneyBox,
  use: async (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => {
    const response: boolean = await UseBox(ctx, userData, 'Money Box', skip, left);
    return response;
  }
}

const UseBox = async (ctx: CommandInteractionContext, userData: UserData, box: string, skip?: boolean, left?: number): Promise<boolean> => {
  ctx.client.database.setCooldownCache("action", userData.id, 1);
  const win: Array<any> = [];
  let win_content: string = "";
  let superator = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
  const common_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "C" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box' && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'disc');
  const mid_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "B" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box' && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'disc');
  const rare_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "A" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box');
  const epic_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "S" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box' && Items[v as keyof typeof Items].type !== 'disc');
  let emoji: { emoji?: string, shaking?: string } = {};
  if (box.toLowerCase().startsWith("money")) {
    superator = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"
    win.push(`coins:${Util.getRandomInt(20000, 50000)}`);
    emoji = {
      shaking: "<a:money_box_shaking:962388845540823100>",
      emoji: Emojis.moneyBox
    }
  } else if (box === 'Christmas Gift') {
    superator = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    emoji = {
      shaking: "<a:xmasgift_shake:1055916746613211216>",
      emoji: "<:xmasgift:1055916688568229938>"
    }
    const disc_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].type === 'disc' && Items[v as keyof typeof Items].rarity !== "T" && Util.getStand(Items[v as keyof typeof Items].name.replace(" Disc", "")).available);
    for (let i = 0; i < Util.getRandomInt(2, 5); i++) win.push(Util.randomArray(disc_items));
    win.push("sup"); // superator
    for (let i = 0; i < Util.getRandomInt(5, 15); i++) win.push(Util.randomArray(Object.keys(Items).filter(v => Items[v as keyof typeof Items].name === "Candy Cane")));
    for (let i = 0; i < Util.getRandomInt(5, 15); i++) win.push(Util.randomArray(Object.keys(Items).filter(v => Items[v as keyof typeof Items].id === "mysterious_arrow")));

  } else if (box === "Patron Box") {
    superator = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    emoji = {
      shaking: Emojis.patronbox_shake,
      emoji: Emojis.patronbox
    }
    const s_tier_stand_discs = Object.keys(Items).filter(v => Items[v as keyof typeof Items].type === 'disc' && Items[v as keyof typeof Items].rarity === "S" && Util.getStand(Items[v as keyof typeof Items].name.replace(" Disc", "")).available);
    for (let i = 0; i < 30; i++) win.push("mysterious_arrow");
    for (let i = 0; i < 1; i++) win.push(Util.randomArray(s_tier_stand_discs));
    win.push("sup");
    win.push("coins:100000");
    win.push(`xp:${Util.getMaxXp(userData.level) - userData.xp + (Util.getMaxXp(userData.level) * 4)}`);
  } else {
    emoji = {
      shaking: Emojis.box_shaking,
      emoji: `📦`
    }
    win.push(`coins:${Util.getRandomInt(500, 3000)}`)
    win.push(`xp:${Util.getRandomInt(50, 400)}`);
    win.push("sup");
    for (let i = 0; i < 10; i++) {
      if (Util.randomArray([true, false])) {
          win.push(Util.randomArray(common_items))
      }
    }
  if (Util.getRandomInt(0, 100) >= 50) {
      win.push(Util.randomArray(mid_items))
      for (let i = 0; i < 3; i++) {
          if (Util.randomArray([true, false])) {
              win.push(Util.randomArray(mid_items))
          }
      }
    }
    if (Util.getRandomInt(0, 10) === 1) {
      win.push(Util.randomArray(rare_items))
      for (let i = 0; i < 2; i++) {
          if (Util.randomArray([true, false])) {
              win.push(Util.randomArray(rare_items))
          }
      }
    }

  }
  const unitems = [...new Set(win)];
  for (const i of unitems) {
    if (i === "sup") win_content+=superator+"\n";
    else if (Util.getItem(i)) { 
      const item = Util.getItem(i);
      if (item && !win_content.includes(item.name)) {
        win_content += `+ **${win.filter(r => r === i).length}** ${item.emoji} ${item.name}\n`;
        for (let x = 0; x < win.filter(r => r === i).length; x++) {
          userData.items.push(item.id);
        }
      }

    } else {
      let emoji = i.startsWith("xp") ? Emojis.xp : Emojis.jocoins;
      win_content += `+ **${Util.localeNumber(Number(i.split(":")[1]))}** ${emoji} ${i.split(":")[0].toUpperCase().replace("COINS", "coins")}\n`;

      if (i.startsWith("coins")) {
        const coins = parseInt(i.split(":")[1]);
        userData.money += coins;
      } else if (i.startsWith("xp")) {
        const xp = parseInt(i.split(":")[1]);
        userData.xp += xp;
      }
    }
  }
  if (win_content.length === 0) win_content = "Nothing";
  await ctx.makeMessage({ content: `${emoji.shaking} Your ${box.split("_").map(v => Util.capitalize(v)).join(" ")} is shaking...`, components: [] });
  await Util.wait(3000);
  let content = `▬▬▬▬▬「${emoji.emoji} **${box.split("_").map(v => v.toUpperCase()).join(" ")}**」▬▬▬▬▬▬\n`;
  await ctx.makeMessage({ content: content });
  if (skip) await Util.wait(1000);
  for (const cn of win_content.split("\n")) {
      if (!skip) await Util.wait(900);
      if (cn.length === 0) content += superator
      else content+=cn+"\n";
      if (!skip) await ctx.makeMessage({ content: content })
  }
  if (skip) await ctx.makeMessage({ content: content });
  await ctx.client.database.saveUserData(userData);

  if (skip) {
    if (left <= 1) ctx.client.database.delCooldownCache("action", userData.id);
  } else ctx.client.database.delCooldownCache("action", userData.id);
  return true;
}

export const Athletic_Shoe: Item = {
  id: "athletic_shoe",
  name: "Athletic Shoe",
  description: "A shoe that can be used for running (and maybe crafting?)",
  type: "cloth",
  tradable: true,
  storable: true,
  usable: false,
  emoji: '👟',
  cloth_bonuses: {
    stamina: 10
  }
}

export const Chocolate_Bar: Item = {
  id: "chocolate_bar",
  name: "Chocolate Bar",
  description: "A chocolate bar",
  type: "consumable",
  price: 115,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🍫',
  benefits: {
    stamina: 10
  }
}

export const Dead_Rat: Item = {
  id: "dead_rat",
  name: "Dead Rat",
  description: "A dead rat",
  type: "consumable",
  price: 5,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🐀',
  benefits: {
    health: -500,
    stamina: -500
  }
}

export const Jotaro_Hat: Item = {
  id: "jotaro_hat",
  name: "Jotaro's Hat",
  description: "Jotaro's lost hat",
  type: "cloth",
  price: 5000000,
  tradable: true,
  storable: true,
  usable: false,
  emoji: Emojis.jotaroHat,
  cloth_bonuses: {
    health: 500,
    stamina: 500
  }
}

export const Ramen_Bowl: Item = {
  id: "ramen_bowl",
  name: "Ramen Bowl",
  description: "A bowl of ramen",
  type: "consumable",
  price: 1500,
  tradable: false,
  storable: false,
  usable: true,
  emoji: '🍜',
  benefits: {
    health: 170,
    stamina: 25
  }
}

export const Requiem_Arrow: Item = {
  id: "requiem_arrow",
  name: "Requiem Arrow",
  description: "Requiem wo... ONE WORLD!",
  type: "other",
  price: 99999999,
  tradable: true,
  storable: false,
  usable: false,
  emoji: Emojis.requiem_arrow
}

export const Skill_Points_Reset_Potion: Item = {
  id: 'skill_points_reset_potion',
  name: 'Skill Points reset potion',
  description: 'resets your skill-points',
  type: 'other',
  price: 100000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.sp_potion,
  use: async (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => {
    userData.skill_points = {
      defense: 0,
      strength: 0,
      perception: 0,
      stamina: 0,
      speed: 0
    }
    ctx.makeMessage({
      content: 'Your skill-points have been reset.'
    })
    return true;
  }

}

export const Broken_Arrow: Item = {
  id: 'broken_arrow',
  name: 'Broken Arrow',
  description: 'A broken arrow that can be used to craft some mysterious arrows (OR REQUIEM ARROWS?!)',
  type: 'arrow',
  price: 5000,
  tradable: true,
  storable: true,
  rarity: 'B',
  usable: false,
  emoji: Emojis.mysterious_arrow,
}

export const Tonio_Special_Recipe: Item = {
  id: 'tonio_special_recipe',
  name: 'Tonio\'s Special Recipe',
  description: 'A special recipe...',
  type: 'consumable',
  price: 13500,
  tradable: false,
  storable: false,
  rarity: 'B',
  usable: true,
  benefits: {
    health: 700,
    stamina: 250
  },
  emoji: '🥣'
}

export const Spooky_Candy: Item = {
  id: 'spooky_candy',
  name: 'Spooky Candy',
  description: 'A spooky candy... was available during the Halloween 2022 event.',
  type: 'consumable',
  price: 50000,
  tradable: true,
  storable: true,
  rarity: 'S',
  usable: true,
  benefits: {
    stamina: 9 * 10**100,
    health: 9 * 10**100
  },
  emoji: Emojis.spooky_candy
}

export const Candy_Cane: Item = {
  id: 'candy_cane',
  name: 'Candy Cane',
  description: 'A candy cane... was available during the Christmas 2022 event.',
  type: 'consumable',
  price: 50000,
  tradable: true,
  storable: true,
  rarity: 'S',
  usable: true,
  benefits: {
    stamina: 9 * 10**100,
    health: 9 * 10**100
  },
  emoji: "<:candy_cane:1055876219251466330>"
}

export const Christmas_Gift: Item = {
  id: "christmas_gift",
  name: "Christmas Gift",
  description: "A christmas gift",
  rarity: 'T',
  type: "box",
  price: 5000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '<:xmasgift:1055916688568229938>',
  use: async (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => {
    const response: boolean = await UseBox(ctx, userData, 'Christmas Gift', skip, left);
    return response;
  }
}

export const Patron_Box: Item = {
  id: "patron_box",
  name: "Patron Box",
  description: "A box for patrons",
  rarity: 'S',
  type: "box",
  price: 5000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.patronbox,
  use: async (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => {
    const response: boolean = await UseBox(ctx, userData, 'Patron Box', skip, left);
    return response;
  }
}


