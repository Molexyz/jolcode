import type { Event, SlashCommand, UserData } from '../@types';
import Client from '../structures/Client';
import { Routes } from 'discord-api-types/v9'
import { CronJob } from 'cron';
import * as Util from '../utils/functions';
import TopGG from '../utils/TopGGAPI'


export const name: Event["name"] = "ready";
export const once: Event["once"] = true;

export const execute: Event["execute"] = async (client: Client) => {
    client.user.setActivity({ name: "loading..."});
    
    const lastCommands = await client.database.redis.client.get("jolyne:commands");
    const lastPrivateCommands = await client.database.redis.client.get("jolyne:private_commands");
    const commandsData = client.commands.filter(v => !v.isPrivate).map((v) => v.data);
    const privateCommandsData = client.commands.filter(v => v.isPrivate).map((v) => v.data);

    if (JSON.stringify(commandsData) !== lastCommands) {
        client.log('Slash commands has changed. Loading...', 'cmd');
        if (process.env.TEST_MODE === "true") {
            await client._rest.put(Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID), {
                body: commandsData
            });    
        } else {
            await client._rest.put(Routes.applicationCommands(client.user.id), {
                body: commandsData
            });    
        }
        client.database.redis.client.set("jolyne:commands", JSON.stringify(commandsData));
        client.log('Slash commands are up to date & have been loaded.', 'cmd');    
    } else client.log('Slash commands are already up to date.', 'cmd');
    if (JSON.stringify(privateCommandsData) !== lastPrivateCommands) {
        client.log('Private slash commands has changed. Loading...', 'cmd');
        await client._rest.put(Routes.applicationGuildCommands(client.user.id, process.env.PRIVATE_SERVER_ID), {
            body: privateCommandsData
        });
        client.database.redis.client.set("jolyne:private_commands", JSON.stringify(privateCommandsData));
        client.log('Private slash commands are up to date & have been loaded.', 'cmd');
    } else client.log('Private slash commands are already up to date.', 'cmd');



    // Daily quests
    //if (client.guilds.cache.random().shardId === 0) {
        async function expireCooldownCache() {
            const keys = await client.database.redis.keys('tempCache_cooldown*');
            for (const key of keys) {
                const value: number = await client.database.redis.get(key) as any;
                if (typeof key !== 'number') continue;
                if (Date.now() + (60_000 * 10) < value) client.database.redis.del(key);
            }
        }
        TopGG(client);
        client.log('Daily quests cron job is starting...', 'cmd');
        let toSaveUSERS: UserData[] = [];
        const job = new CronJob('0 0 * * *', async function () {
            const cachedUsers = await client.database.redis.client.keys("*cachedUser*");
            let formattedUsers: UserData[] = [];

            for await (const id of cachedUsers) {
                const userData = await client.database.redis.client.get(id);
                formattedUsers.push(JSON.parse(userData));
            }
            for await (const user of formattedUsers) {
                /*
                if (await client.database.getCooldownCache(user.id)) {
                    toSaveUSERS.push(user);
                    continue;
                }*/
                await client.database.redis.del(`jjba:finishedQ:${user.id}`);
                user.daily.quests = Util.generateDailyQuests(user.level);
                client.database.saveUserData(user);

            }
            // client.database.redis.keys('*finishedQ*').then(r=>{ r.forEach(f=>client.database.redis.del(f))});
        }, null, true, 'Europe/Paris');
        setInterval(async () => {
            expireCooldownCache()
            /*
            for (const user of toSaveUSERS) {
                if (await client.database.getCooldownCache(user.id)) continue;
                client.database.redis.del(`jjba:finishedQ:${user.id}`);
                user.daily.quests = Util.generateDailyQuests(user.level);
                client.database.saveUserData(user);
            }*/
        }, 10000);
        
        job.start();
    //}
    client._ready = true;
    client.user.setActivity({ name: "The Way To Heaven", type: "WATCHING" });
    client.log(`Ready! Logged in as ${client.user.tag} (${client.user.id})`);
};