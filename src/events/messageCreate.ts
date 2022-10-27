import type { Event } from '../@types';
import JolyneClient from '../structures/Client';
import { Message } from 'discord.js';
import * as Util from '../utils/functions';
import * as Items from '../database/rpg/Items';
const ownerIds = process.env.OWNER_IDS.split(',');
const adminIds = process.env.ADMIN_IDS.split(',');

declare module 'discord.js' {
    interface Message {
        client: JolyneClient;
    }
}

export const name: Event["name"] = "messageCreate";
export const execute: Event["execute"] = async (message: Message) => {
    const { client } = message;
    const args = message.content.slice((process.env.CLIENT_PREFIX ?? "j!!").length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (ownerIds.includes(message.author.id)) {
        if (commandName === "eval") {
            const content = args.join(" ");
            const userData = await client.database.getUserData(message.author.id);
            const result = new Promise((resolve) => resolve(eval(content)));
    
            return result.then((output: any) => {
                if (typeof output !== `string`) {
                    output = require(`util`).inspect(output, {
                        depth: 0
                    });
                }
                if (output.includes(client.token)) {
                    output = output.replace(new RegExp(client.token, "gi"), `T0K3N`);
                }
                try {
                    // eslint-disable-no-useless-escape
                    message.channel.send(`\`\`\`\js\n${output}\n\`\`\``);
                } catch (e) {
                    console.error(e);
                }
            }).catch((err) => {
                console.error(err);
                err = err.toString();
                if (err.includes(client.token)) {
                    err = err.replace(new RegExp(client.token, "gi"), `T0K3N`);
                }
                try {
                    message.channel.send(`\`\`\`\js\n${err}\n\`\`\``);
                } catch (e) {
                    console.error(e);
                }
    
            }); 
        }
    }
    if (ownerIds.includes(message.author.id) || ownerIds.includes(message.author.id)) {
        if (commandName === 'give') {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const userData = await client.database.getUserData(user.id);
            if (!userData) return message.reply('User does not exist!');
            let b: any = args.join(' ').split('--')[0].split('')
            b = b.slice(0, b.length - 1).join('');
            const item = Util.getItem(b.slice(args[0].length + 1)) || Object.values(Items).find((v) => v.id.toLowerCase().includes(b.slice(args[0].length + 1).toLowerCase()) || v.name.toLowerCase() === b.slice(args[0].length + 1).toLowerCase() || v.id.toLowerCase() === b.slice(args[0].length + 1).toLowerCase() || v.name.toLowerCase().includes(b.slice(args[0].length + 1).toLowerCase() ));
            if (!item) return message.reply('Item does not exist!');
            const amout = args.join('  ').includes('--') ? parseInt(args.join(' ').split('--')[1]) : 1;

            for (let i = 0; i < amout; i++) {
                userData.items.push(item.id);
            }
            client.database.saveUserData(userData);
            message.reply(`${item.emoji} \`x${amout} ${item.name}\` has been added to ${user.tag}'s inventory!`);
        }
        if (commandName === 'remove') {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            if (!user) return;
            const userData = await client.database.getUserData(user.id);
            if (!userData) return message.reply('User does not exist!');
            let b: any = args.join(' ').split('--')[0].split('')
            b = b.slice(0, b.length - 1).join('');
            const item = Util.getItem(b.slice(args[0].length + 1)) || Object.values(Items).find((v) => v.id.toLowerCase().includes(b.slice(args[0].length + 1).toLowerCase()) || v.name.toLowerCase() === b.slice(args[0].length + 1).toLowerCase() || v.id.toLowerCase() === b.slice(args[0].length + 1).toLowerCase() || v.name.toLowerCase().includes(b.slice(args[0].length + 1).toLowerCase() ));
            if (!item) return message.reply('Item does not exist!');
            const amout = args.join('  ').includes('--') ? parseInt(args.join(' ').split('--')[1]) : 1;
            if (userData.items.map(q => Util.getItem(q)).filter(r => r.id === item.id).length < amout) return message.reply({
                content: `Bro, **${user.username}** doesn't have ${amout} ${item.emoji} ${item.name}, but only ${userData.items.map(q => Util.getItem(q)).filter(r => r.id === item.id).length} !!!!!!!!`
            })

            for (let i = 0; i < amout; i++) {
                Util.removeItem(userData.items, item.id);
            }
            client.database.saveUserData(userData);
            message.reply(`${item.emoji} \`x${amout} ${item.name}\` has been __removed__ to ${user.tag}'s inventory! RIP BOZO`);

        }
        if (commandName === 'rcds' || commandName === 'removecds') {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            if (!user) return;
            const where = await client.database.getCooldownCache(user.id);
            const result = await client.database.redis.del(where);

            if (result) message.reply({
                content: `Done, cooldown was from \`${where}\``
            })
            else message.reply({
                content: 'User not on cooldown'
            })
        }
    }
    
    
};