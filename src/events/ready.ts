import type { Event, SlashCommand, UserData } from '../@types';
import Client from '../structures/Client';
import { Routes } from 'discord-api-types/v9'
import { CronJob } from 'cron';
import * as Util from '../utils/functions';
import io from 'socket.io';
import TopGG from '../utils/TopGGAPI'
import * as Items from '../database/rpg/Items';
import { Mysterious_Arrow } from '../database/rpg/Items';


export const name: Event["name"] = "ready";
export const once: Event["once"] = true;

export const execute: Event["execute"] = async (client: Client) => {
    client.user.setActivity({ name: "loading..."});

    // socket.io
    if (client.user.id === "942778655384408124") { // if is jolyne beta
        const members = await client.guilds.cache.get("923608916540145694").members.fetch();
        const beta_testers = members.filter(v => v.roles.cache.has("978041345245597818"));

        // check if beta testers are in guild 923608916540145694
        for (const beta_tester of beta_testers) {
            const guild = await client.guilds.cache.get("923608916540145694").members.fetch(beta_tester[0]);
            if (!guild) {
                beta_tester[1].roles.remove("978041345245597818");
            }
        }

        // fetch members in guild 965210362418982942, checks if they have role id 1028372494685577277 or 971384118560587776, if yes gives them role ID 978041345245597818 in guild id 923608916540145694
        const members2 = await client.guilds.cache.get("965210362418982942").members.fetch();
        const beta_testers2 = members2.filter(v => v.roles.cache.has("1028372494685577277") || v.roles.cache.has("971384118560587776"));
        // give beta testers2 role id 978041345245597818 in guild id 923608916540145694
        for (const beta_tester of beta_testers2) {
            const guild = await client.guilds.cache.get("923608916540145694").members.fetch(beta_tester[0]);
            if (guild) {
                guild.roles.add("978041345245597818");
            }
        }
    }
    
    const lastCommands = await client.database.redis.client.get("jolyne:commands");
    const lastPrivateCommands = await client.database.redis.client.get("jolyne:private_commands");
    const commandsData = client.commands.filter(v => !v.isPrivate).map((v) => v.data);
    const privateCommandsData = client.commands.filter(v => v.isPrivate).map((v) => v.data);


    async function fetchTestersBoostersAndPatreons() {
            // fetch testers & patreons
    const supportMembers = client.guilds.cache.get(process.env.SUPPORT_SERVER_ID)?.members.fetch();
    const testerMembers = client.guilds.cache.get(process.env.TESTER_SERVER_ID)?.members.fetch();

    if (testerMembers) {
        const testers = (await testerMembers).filter(v => v.roles.cache.has(process.env.TESTER_ROLE_ID));
        client.testers = testers.map(v => v.id);
    }


    if (supportMembers) {
        const patreons = (await supportMembers).filter((m) => m.roles.cache.has(process.env.PATREON_ROLE_ID));
        const patreonsArray: { id: string, level: number }[] = [];
        const boosters = (await supportMembers).filter((m) => m.roles.cache.has(process.env.BOOSTER_ROLE_ID));
        const boostersArray: string[] = boosters.map(v => v.id);
        patreons.forEach((m) => {
            if (m.roles.cache.has(process.env.PATREON_LEVEL_2_ROLE_ID)) patreonsArray.push({ id: m.id, level: 2 });
            else if (m.roles.cache.has(process.env.PATREON_LEVEL_3_ROLE_ID)) patreonsArray.push({ id: m.id, level: 3 });
            else if (m.roles.cache.has(process.env.PATREON_LEVEL_4_ROLE_ID)) patreonsArray.push({ id: m.id, level: 4 });
            else patreonsArray.push({ id: m.id, level: 1 });
        });
        await client.database.redis.set("jolyne:patreons", JSON.stringify(patreonsArray));
        client.patreons = patreonsArray;
        client.boosters = boostersArray;
        console.log(`[Patreons] Fetched ${patreons.size} patreons`, patreonsArray);
        console.log(`[Boosters] Fetched ${boosters.size} boosters`, boostersArray);
        // JSON.parse(await client.database.redis.get("jolyne:patreons"));
    }
    }

    function getPatronReward(level: number) {
        if (level === 1) return [ Items.Patron_Box ]
        else if (level === 2) return [ Items.Patron_Box, Items.Patron_Box ]
        else if (level === 3) return [ Items.Patron_Box, Items.Patron_Box, Items.Patron_Box, Items.Patron_Box, Items.Patron_Box ]
        else return [ Items.Patron_Box, Items.Patron_Box, Items.Patron_Box, Items.Patron_Box, Items.Patron_Box, Items.Patron_Box, Items.Patron_Box ]
    }

    fetchTestersBoostersAndPatreons();
    setInterval(fetchTestersBoostersAndPatreons, 1000 * 60 * 30);

    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        if (oldMember.guild.id !== "923608916540145694") return;

        let oldRoleIDs = [];
        oldMember.roles.cache.each(role => {
            oldRoleIDs.push(role.id);
        });

        let newRoleIDs = [];
        newMember.roles.cache.each(role => {
            newRoleIDs.push(role.id);
        });
        
        if (newRoleIDs.length !== oldRoleIDs.length) {
            const oldBoosters = client.boosters;
            const oldPatrons = client.patreons;
            await fetchTestersBoostersAndPatreons();

            // check who is a new booster
            const newBooster = client.boosters.filter(v => !oldBoosters.includes(v));
            const newPatron = client.patreons.filter(v => !oldPatrons.find(x => x.id === v.id));
            newPatron.push(...oldPatrons.filter(v => v.level !== client.patreons.find(x => x.id === v.id).level))
            for (const booster of newBooster) {
                const data = await client.database.getUserData(booster);
                if (!data) continue;

                for (let i = 0; i < 30; i++) data.items.push(Mysterious_Arrow.id);
                await client.database.saveUserData(data);

                client.users.fetch(booster).then(async (user) => {
                    user.send({
                        content: ":heart: Thank you for boosting my support server! You have been given 30 Mysterious Arrows and you'll get 30 Mysterious Arrows every months (if you're still boosting).",
                    }).catch(() => {});
                });
            }
            for (let patron of newPatron) {
                patron = client.patreons.find(v => v.id === patron.id);
                if (!patron) continue;
                const data = await client.database.getUserData(patron.id);
                if (!data) continue;

                for (let i = 0; i < 30; i++) data.items.push(Mysterious_Arrow.id);
                for (const item of getPatronReward(patron.level)) data.items.push(item.id);
                await client.database.saveUserData(data);

                client.users.fetch(patron.id).then(async (user) => {
                    user.send({
                        content: `:heart: Thank you for supporting me on Patreon! You have been given 30 Mysterious Arrows and ${getPatronReward(patron.level).map(v => v.name).join(", ")} and you'll get 30 Mysterious Arrows and ${getPatronReward(patron.level).map(v => v.name).join(", ")} every months (if you're still supporting me).`,
                    }).catch(() => {});
                });

            }

        }
    });

    const job2 = new CronJob('0 0 0 1 * *', async () => {
        const boosters = client.boosters;
        const patreons = client.patreons;

        for (const booster of boosters) {
            const data = await client.database.getUserData(booster);
            if (!data) continue;

            for (let i = 0; i < 30; i++) data.items.push(Mysterious_Arrow.id);
            await client.database.saveUserData(data);

            client.users.fetch(booster).then(async (user) => {
                user.send({
                    content: ":heart: [MONTHLY REWARDS] Thank you for boosting my support server! You have been given 30 Mysterious Arrows and you'll get 30 Mysterious Arrows every months (if you're still boosting).",
                }).catch(() => {});
            });
        }
        for (const patron of patreons) {
            const data = await client.database.getUserData(patron.id);
            if (!data) continue;

            for (let i = 0; i < 30; i++) data.items.push(Mysterious_Arrow.id);
            for (const item of getPatronReward(patron.level)) data.items.push(item.id);
            await client.database.saveUserData(data);

            client.users.fetch(patron.id).then(async (user) => {
                user.send({
                    content: `:heart: [MONTHLY REWARDS] Thank you for supporting me on Patreon!!!! You have been given 30 Mysterious Arrows and ${getPatronReward(patron.level).map(v => v.name).join(", ")} and you'll get 30 Mysterious Arrows and ${getPatronReward(patron.level).map(v => v.name).join(", ")} every months (if you're still supporting me).`,
                }).catch(() => {});
            });

        }
    }, null, true, 'Europe/Paris');
    job2.start();

    if (JSON.stringify(commandsData) !== lastCommands) {
        client.log('Slash commands has changed. Loading...', 'cmd');

        //if (process.env.TEST_MODE === "true") {
            /*
            client._commands = await client._rest.put(Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID), {
                body: commandsData
            }).then(console.log)    */
        //} else {

            client._commands = await client._rest.put(Routes.applicationCommands(client.user.id), {
                body: commandsData
            })
        //}
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
                await client.database.redis.del(`jjba:finishedQ:${user.id}`);


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

    /*

        // temporairly
        const hasSpeed = await client.database.redis.client.get("jolyne:has_speed");
        if (hasSpeed) {
            await client.database.redis.client.set("jolyne:has_speed", "true");
            const users = await client.database.redis.client.keys("cachedUser:*");
            for (const user of users) {
                const userData: UserData = JSON.parse(await client.database.redis.client.get(user));
                if (userData.skill_points.speed === 0) {
                    console.log(`User ${userData.id} got speed, continuing...`);
                    continue;
                } 
    
                userData.skill_points.speed = 0;
                await client.database.saveUserData(userData);
                console.log(`[REDIS] Updated ${user} speed skill points to 0`);
            }
        }*/    
    
};