/**
 * WARNING:
 * The code you see in this file may look like crap, yet it is actually working fine.
 */
import type { SlashCommand, UserData, NPC, Stand, Ability, Turn } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, Message } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import type { Quest, Chapter } from '../../@types';
import * as Util from '../../utils/functions';
import * as Chapters from '../../database/rpg/Chapters';
import * as Quests from '../../database/rpg/Quests';
import * as NPCs from '../../database/rpg/NPCs';
import * as Stands from '../../database/rpg/Stands';
import * as Emojis from '../../emojis.json';
import { now } from 'moment-timezone';

export const name: SlashCommand["name"] = "fight";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const data: SlashCommand["data"] = {
    name: "fight",
    description: "[SUB-COMMANDS]",
    options: [{
        name: "npc",
        description: "Start a fight against an NPC from your quests",
        options: [],
        type: 1
    }, {
        name: "player",
        description: "Start a fight against a player",
        type: 1,
        options: [{
            name: "user",
            description: "The user whose profile you want to see",
            required: true,
            type: 6
        }, {
            choices: [{
                name: "Friendly",
                value: "Your hp & your opponent's hp will be set to max and you won't lose anything"
            }, {
                name: "Ranked",
                value: "The winner will receive 5% of the opponent's coins and some XPs depending on the level difference."
            }],
            type: 3,
            name: "mode",
            description: "Fight type",
            required: true
        }]
    }]
};




export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData, customNPC?: NPC, updateUser?: boolean) => {
    if (ctx.client._ready === false) return ctx.makeMessage({
        content: 'The bot is going to restart soon.',
        components: [],
        embeds: []
    });
    if (updateUser) userData = await ctx.client.database.getUserData(userData.id);
    const lastChapterEnnemyQuest: Quest = userData.chapter_quests.filter(v => v.npc && v.npc.health !== 0).sort((a, b) => a.npc.max_health - b.npc.max_health)[0];
    const lastDailyEnnemyQuest: Quest = userData.daily.quests.filter(v => v.npc && v.npc.health !== 0)[0];

    if (userData.health <= 0) return ctx.makeMessage({
        content: "You are dead. Try again once you've regenerated your health.",
        components: [],
        embeds: []
    });

    const selectMenuID = Util.generateID();

    const user = ctx.interaction.options.getUser("user");
    if (user && user.id === userData.id) return ctx.makeMessage({
        content: Emojis['jolyne']
    });

    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => { });
        if (user) return i.user.id === user.id || i.user.id === userData.id;
        return i.user.id === userData.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
    if (customNPC) return startBattle(customNPC, 'custom')
    let opponentData = await ctx.client.database.getUserData(user ? user.id : userData.id);

    if (!user) {
        if (lastChapterEnnemyQuest && lastDailyEnnemyQuest) {
            const selectMenu = new MessageSelectMenu()
            .setCustomId(selectMenuID)
            .setPlaceholder('Select an opponent.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([{
                    label: lastChapterEnnemyQuest.npc.name,
                    value: 'chapter_quests',
                    description: ctx.translate("battle:FROM_CQ"),
                    emoji: lastChapterEnnemyQuest.npc.emoji
                }, {
                    label: lastDailyEnnemyQuest.npc.name,
                    description: ctx.translate("battle:FROM_DQ"),
                    value: "daily.quests",
                    emoji: lastDailyEnnemyQuest.npc.emoji
                }]);
            ctx.sendT("battle:MULTIPLE_QUESTION", {
                components: [Util.actionRow([selectMenu])]
            });

            const callback = async (i: MessageComponentInteraction) => {
                if (!i.isSelectMenu()) return;
                if (i.user.id !== ctx.author.id) return;
                if (i.message.interaction.id !== ctx.interaction.id) return;
                if ((await ctx['componentAntiCheat'](i, userData)) === true) return collector.stop("CHAT CHEAT CHEAT")

                let NPC = i.values[0] === "chapter_quests" ? lastChapterEnnemyQuest.npc : lastDailyEnnemyQuest.npc;
                startBattle(NPC, i.values[0] as 'chapter_quests' | 'daily.quests');
            }
    
            return collector.on('collect', callback);
            
    
        } else {
            if (!lastChapterEnnemyQuest && !lastDailyEnnemyQuest) return await ctx.sendT("battle:NOBODY_BATTLE");
            if (lastChapterEnnemyQuest) return startBattle(lastChapterEnnemyQuest.npc, "chapter_quests");
            if (lastDailyEnnemyQuest) return startBattle(lastDailyEnnemyQuest.npc, "daily.quests");
        }
        
    } else {
        const acceptID = Util.generateID();
        const declineID = Util.generateID();

        const acceptBTN = new MessageButton()
            .setCustomId(acceptID)
            .setLabel('Accept')
            .setStyle('SUCCESS');
        const declineBTN = new MessageButton()
            .setCustomId(declineID)
            .setLabel('Decline')
            .setStyle('DANGER');

        // Difference check
        if (ctx.interaction.options.getString("mode").includes("5%")) {
            let opponentATKDMG = Util.calcATKDMG(opponentData);
            let userDataATKDMG = Util.calcATKDMG(userData);
            let DmgDIFF = opponentATKDMG - userDataATKDMG;
            let diff = opponentData.level - userData.level;
            if (diff < 0) diff = -(diff);
    
            if (DmgDIFF < 0) {
                DmgDIFF = -1 * DmgDIFF;
            }
    
            if (DmgDIFF > 20 && diff >= 6 || diff >= 10) {
                return await ctx.sendT("battle:DIFFERENCE_TOO_BIG");
            }
        }
        // ...
        const mode = ctx.interaction.options.getString("mode").includes("5%") ? "ranked" : "friendly";
        await ctx.sendT("battle:USER_QUESTION", {
            type: mode,
            components: [Util.actionRow([ acceptBTN, declineBTN ])],
        });
        
        const callback = async (i: MessageComponentInteraction) => {
            if (i.user.id !== user.id) return;
            if ((await ctx['componentAntiCheat'](i, userData)) === true) return;
            if ((await ctx['componentAntiCheat'](i, opponentData)) === true) return;

            collector.removeListener("collect", callback);
            switch (i.customId) {
                case acceptID:
                    startBattle(opponentData, mode); 
                    break; 
                case declineID:
                    ctx.sendT("battle:USER_DECLINED");
                    break;          
            }
        }

        return collector.on('collect', callback);
    }
    async function startBattle(opponent: UserData | NPC, type: "chapter_quests" | "daily.quests" | "side_quests" | "ranked" | "friendly" | "custom") {
        console.log(`${userData.tag} started a battle against ${opponent.id}`);
        let timeoutCollector: NodeJS.Timeout;
        if (type === "friendly") {
            opponent.health = opponent.max_health;
            userData.health = userData.max_health;
        } else if (type === "ranked") {
            ctx.client.database.setCooldownCache("battle", userData.id, `https://discord.com/channels/${ctx.interaction.guild.id}/${ctx.interaction.channel.id}/${ctx.interaction.id}`);
            ctx.client.database.setCooldownCache("battle", opponent.id, `https://discord.com/channels/${ctx.interaction.guild.id}/${ctx.interaction.channel.id}/${ctx.interaction.id}`);
        } else {
            ctx.client.database.setCooldownCache("battle", userData.id, `https://discord.com/channels/${ctx.interaction.guild.id}/${ctx.interaction.channel.id}/${ctx.interaction.id}`);
        }
        if (Util.isNPC(opponent) && type !== "custom") {
            const rawNPC = Object.keys(NPCs).map(v => NPCs[v as keyof typeof NPCs]).find(n => n.id === opponent.id) || opponent;
            opponent = {...rawNPC};
        }
        const attackID = Util.generateID();
        const defendID = Util.generateID();
        const forfeitID = Util.generateID();
        const standID = Util.generateID();
        const nextID = Util.generateID();
        const homeID = Util.generateID();
        let ended = false;
        let editedNPC = false;

        const cooldowns: Array<{
            id: string,
            move: string,
            cooldown: number
        }> = [];

        const functions: Array<Function> = []; // Game functions
        const gameOptions: any = {
            trns: 0,
            stopCooldown: [],
            pushnow: () => pushTurn(),
            whosTurn: () => whosTurn(),
            opponentNPC: Util.isNPC(opponent) ? opponent.id : null,
            NPCAttack: (skip?: boolean) => NPCAttack(skip),
            loadBaseEmbed: () => loadBaseEmbed(),
            defend: () => defend(),
            triggerAbility: (a: any, b: any, c: any, d: any) => triggerAbility(a,b,c,d),
            attack: (a: any, b:any, c:any) => attack(a,b,c),
            cooldowns: cooldowns
        };
        /** EXAMPLE
        promises.push((async () => {
            if (gameOptions.timestop_cd !== 0) {
                gameOptions.trns++;
                gameOptions.timestop_cd--;
            }
        })());
        */
        
        const shields: Array<{
            id: string,
            left: number,
            max: number
        }> = [{
            id: userData.id,
            left: Math.round(userData.max_health / 5),
            max: Math.round(userData.max_health / 5)
        }, {
            id: opponent.id,
            left: Math.round(opponent.max_health / 5),
            max: Math.round(opponent.max_health / 5)
        }];
        const UserStand: Stand | null = userData.stand ? Util.getStand(userData.stand) : null;
        const OpponentStand: Stand | null = opponent.stand ? Util.getStand(opponent.stand) : null;
        if (UserStand) for (const ability of UserStand.abilities) {
            cooldowns.push({
                id: userData.id,
                move: ability.name,
                cooldown: ability.cooldown
            });
        }
        if (OpponentStand) for (const ability of OpponentStand.abilities) {
            cooldowns.push({
                id: opponent.id,
                move: ability.name,
                cooldown: ability.cooldown
            });
        }


        const attackBTN = new MessageButton()
            .setCustomId(attackID)
            .setLabel("Attack")
            .setEmoji("⚔️")
            .setStyle("PRIMARY");
        const forfeitBTN = new MessageButton()
        .setCustomId(forfeitID)
        .setLabel("Forfeit")
        .setEmoji("🗡")
        .setDisabled(type === 'ranked' ? true : false)
        .setStyle("SECONDARY");
        const NPCBTN = new MessageButton()
            .setCustomId('[@ny]')
            .setLabel('[Waiting for your turn...]')
            .setDisabled(true)
            .setStyle('DANGER');
        const nxtbtn = new MessageButton()
            .setCustomId(nextID)
            .setLabel('Next Battle')
            .setEmoji("943187898495303720")
            .setStyle("PRIMARY");
        const homeBTN = new MessageButton()
            .setCustomId(homeID)
            .setEmoji("943188053390929940") // No label
            .setStyle("SECONDARY");

        const standBTN = function standBTN(povData: NPC | UserData): MessageButton {
            const stand = Util.getStand(povData.stand ?? "");
            return new MessageButton()
                .setCustomId(standID)
                .setLabel(`${stand.name}'s abilities`)
                .setEmoji(stand.emoji)
                .setStyle("SECONDARY");
        }
        const defendBTN = function defendBTN(povData: NPC | UserData): MessageButton {
            return new MessageButton()
            .setCustomId(defendID)
            .setLabel("Defend")
            .setEmoji("🛡")
            .setDisabled(cooldowns.find(r => r.id === povData.id && r.move === "defend") ? (cooldowns.find(r => r.id === povData.id && r.move === "defend").cooldown === 0 ? false : true) : false )
            .setStyle("PRIMARY");
        }

        const turns: Turn[] = [];
        gameOptions.trns = 0//Util.getRandomInt(0, 10);
        turns.push({
            lastMove: "",
            logs: [],
            lastDamage: 0
        })
        loadBaseEmbed();
        collector.on("collect", async (i: MessageComponentInteraction) => {
            if (i.customId === nextID) {
                // ANTI-CHEAT, ANTI-DUPES, ANTI-BUG, ANTI-GLITCH
                const AntiCheatResult = await ctx.componentAntiCheat(i, userData);
                if (AntiCheatResult === true) {
                    return collector.stop();
                }
                ctx.client.commands.get("fight").execute(ctx, userData, null, true);
                /*
                const lastChapterEnnemyQuest: Quest = userData.chapter_quests.filter(v => v.npc && v.npc.health !== 0)[0];
                const lastDailyEnnemyQuest: Quest = userData.daily.quests.filter(v => v.npc && v.npc.health !== 0)[0];
                if (lastChapterEnnemyQuest) startBattle(lastChapterEnnemyQuest.npc, "chapter_quests");
                if (lastDailyEnnemyQuest) startBattle(lastDailyEnnemyQuest.npc, "daily.quests");*/
                return collector.stop();
            }
            const povData = whosTurn() as UserData;
            timeoutClt();
            if (i.user.id !== whosTurn().id) return; // If it's not the turn of the player

            const before = beforeTurn();
            let dodged: boolean = false;
            const dodges = Util.calcDodgeChances(before);
            const dodgesNumerator = 90 + (!Util.isNPC(before) ? before.spb?.perception : before.skill_points.perception);
            const dodgesPercent = Util.getRandomInt(0, Math.round(dodgesNumerator));
            if (dodgesPercent < dodges || Util.calcDodgeChances(povData) === 696969) dodged = true;
            if (gameOptions.invincible) dodged = false;


            const currentTurn = turns[turns.length - 1];
            let output: any; // chng to string après


            switch (i.customId) {
                case attackID:
                    const input = attack({ damages: Util.getATKDMG(povData), username: i.user?.username }, dodged, currentTurn);
                    output = input;
                    break;
                case forfeitID:
                    collector.stop('forfeit');
                    ended = true;
                    if (!user) {
                        ctx.client.database.delCooldownCache("battle", ctx.interaction.user.id);
                        ctx.client.database.saveUserData(userData);    
                    }
                    ctx.interaction.followUp({
                        content: `${Emojis.happyjolyne} **${i.user.tag}** was too afraid LMAO SMH`
                    })
                    break;
                case defendID:
                    output = defend();
                    break;
                case standID:
                    sendStandPage(Util.getStand(povData.stand), povData);
                    return;
                case homeID:
                    loadBaseEmbed();
                    return;
                default:
                    if (i.customId.startsWith("abil++")) {
                        const ability = i.customId.split("++")[1];
                        const abilityName = ability.split("_")[1];

                        const standData = Util.getStand(ability.split("_")[0]);
                        const abilityData = standData.abilities.find(v => v.name === abilityName);


                        const input = triggerAbility(abilityData, povData, dodged, currentTurn);
                        output = input;
                        break;
                    } else return;
            }

            if (output) currentTurn.logs.push(output);
            pushTurn();
            functions.forEach(f => f());
            gameOptions.trns++;
            await loadBaseEmbed();
            //if (whosTurn().health <= 0) return end();
            //if (beforeTurn().health <= 0) return end();
        });

        function getUserQuests(): Quest[] {
            switch (type) {
                case "chapter_quests":
                    return userData.chapter_quests;
                case "daily.quests":
                    return userData.daily.quests;
                case "side_quests":
                    return userData.side_quests;
            }
        }

        function pushTurn() {
            if (gameOptions.donotpush) return;
            if (turns[turns.length - 1].logs.filter(r => r).length >= 2 && turns[turns.length - 1].lastMove !== "TS") {
                turns.push({
                    lastMove: turns[turns.length - 1].lastMove,
                    logs: [],
                    lastDamage: turns[turns.length - 1].lastDamage
                });
                cooldowns.forEach(c => {
                    if (gameOptions.stopCooldown.find((r: string) => r === c.id)) return
                    if (c.cooldown !== 0) c.cooldown--;
                });
            }
        }

        function attack(input: { damages: number, username: string }, dodged: boolean, turn: Turn) {
            if (dodged) {
                turn.lastMove = "attack";
                return `🌬️ **${input?.username}** attacked but ${beforeTurnUsername()} dodged.`;
            } else if (turn.lastMove === "defend") {
                turn.lastMove = "attack";
                const then = attackShield(beforeTurn().id, input.damages);
                if (then.left === 0) {
                    regenerateShieldToUser(beforeTurn().id);
                    removeHealthToLastGuy(input.damages * 1.75);
                    return `**${input?.username}** attacked and broke ${beforeTurnUsername()}'s guard for ${input.damages * 1.75} damages (:heart: ${beforeTurn().health}/${beforeTurn().max_health}) left).`;
                } else {
                    turn.lastMove = "attack";
                    return `**${input?.username}** attacked but ${beforeTurnUsername()} blocked. (:shield: ${then.left}/${then.max} left).`;
                }
            } else {
                turn.lastMove = "attack";
                removeHealthToLastGuy(input.damages);
                return `**${input?.username}** attacked and did ${input.damages} damages (:heart: ${beforeTurn().health}/${beforeTurn().max_health} left).`;
            }
        }

        async function NPCAttack(skip?: boolean) {
            if (ended) return;
            if (opponent.health <= 0) return end();
            if (!skip) await Util.wait(1200);
            const NPC = whosTurn();
            if (!Util.isNPC(NPC)) return; //typeguard
            let possibleMoves: Array<string | Ability> = ["attack"];
            if (cooldowns.find(r => r.id === opponent.id && r.move === "defend")) {
                if (cooldowns.find(r => r.id === opponent.id && r.move === "defend").cooldown === 0) possibleMoves.push("defend");
            } else possibleMoves.push("defend");
            if (gameOptions.invincible) possibleMoves = ["attack"];

            

            
            if (opponent.stand) {
                for (const ability of OpponentStand.abilities) {
                    if (cooldowns.find(r => r.id === NPC.id && r.move === ability.name)?.cooldown <= 0) {
                        possibleMoves.push(ability);
                        possibleMoves.push(ability);
                    }
                }
            }
            const choosedMove = Util.randomArray(possibleMoves);

            const before = beforeTurn();
            let dodged: boolean = false;
            const dodges = Util.calcDodgeChances(before);
            const dodgesNumerator = 90 + (!Util.isNPC(before) ? before.spb?.perception : before.skill_points.perception);
            const dodgesPercent = Util.getRandomInt(0, Math.round(dodgesNumerator));
            if (dodgesPercent < dodges) dodged = true;
            if (gameOptions.invincible) dodged = false;

            switch (choosedMove) {
                case "attack":
                    const input = attack({ damages: Util.calcATKDMG(NPC), username: NPC.name }, dodged, turns[turns.length - 1]);
                    turns[turns.length - 1].logs.push(input);
                    break;
                case "defend":
                    defend();
                    break;
                default:
                    const ability = choosedMove as Ability;
                    const input2 = triggerAbility(ability, NPC, dodged, turns[turns.length - 1]);
                    turns[turns.length - 1].logs.push(input2);
                    break;
            }
            if (skip) return;
            gameOptions.trns++;
            pushTurn();
            await loadBaseEmbed();
        }
        function triggerAbility(ability: Ability, user: UserData | NPC, dodged: boolean, turn: Turn) {
            user.stamina -= ability.stamina;
            cooldowns.forEach(c => {
                if (c.id === user.id && c.move === ability.name) {
                    c.cooldown = ability.cooldown;
                }
            });
            if (ability.heal) {
                const oldHealth = user.health;
                if (typeof ability.heal === 'string') {
                    const percent = Number(ability.heal.split("%")[0]);
                    const heal = Math.round(user.max_health * percent / 100);
                    user.health += heal;
                } else {
                    user.health += ability.heal;
                }
                if (user.health > user.max_health) user.health = user.max_health;
                return `**${whosTurnUsername()}** used **${ability.name}** and healed ${user.health - oldHealth} health (POV: :heart: ${user.health}/${user.max_health}).`;
            }
            if (ability.trigger) {
                if (ability.damages === 0) { // Then it's a special one
                    return ability.trigger(ctx, functions, gameOptions, user, beforeTurn(), gameOptions.trns, turns);
                } else ability.trigger(ctx, functions, gameOptions, user, beforeTurn(), gameOptions.trns, turns);
            }
            const damage = Util.calcAbilityDMG(ability, user);
            const userStand = Util.getStand(user.stand);
            if (dodged && ability.dodgeable) {
                turn.lastMove = "attack";
                return `🌬️ **${whosTurnUsername()}** used **${userStand.name} : ${ability.name}** but ${beforeTurnUsername()} dodged.`;
            } else if (turn.lastMove === "defend") {
                turn.lastMove = "attack";
                if (ability.blockable) {
                    const then = attackShield(beforeTurn().id, damage);
                    if (then.left === 0) {
                        regenerateShieldToUser(beforeTurn().id);
                        removeHealthToLastGuy(damage * 1.75);
                        return `**${whosTurnUsername()}** used **${userStand.name} : ${ability.name}** and broke ${beforeTurnUsername()}'s guard for ${damage * 1.75} damages (:heart: ${beforeTurn().health}/${beforeTurn().max_health}) left).`;
                    } else {
                        return `**${whosTurnUsername()}** used **${userStand.name} : ${ability.name}** but ${beforeTurnUsername()} blocked. (:shield: ${then.left}/${then.max} left).`;
                    }
                } else {
                    // they broke their guard
                    turn.lastMove = "attack";
                    removeHealthToLastGuy(damage * 1.75);
                    regenerateShieldToUser(beforeTurn().id);
                    return `**${whosTurnUsername()}** used **${userStand.name} : ${ability.name}** and broke ${beforeTurnUsername()}'s guard for ${damage * 1.75} damages (:heart: ${beforeTurn().health}/${beforeTurn().max_health}) left).`;
                }
            } else {
                removeHealthToLastGuy(damage);
                turn.lastMove = "attack";
                return `**${whosTurnUsername()}** used **${userStand.name} : ${ability.name}** and did ${damage} damages (:heart: ${beforeTurn().health}/${beforeTurn().max_health} left).`;
            }
            
        }
        function defend() {
            turns[turns.length - 1].lastMove = "defend";
            turns[turns.length - 1].logs.push(`> :shield: ${whosTurnUsername()} is now defending.`);
        }
        function timeoutClt() {
            clearTimeout(timeoutCollector);
            timeoutCollector = setTimeout(() => {
                if (ended) return;
                const currentUser = whosTurn() as UserData;
                const currentUserUsername = ctx.client.users.cache.get(currentUser.id)?.username ?? "?";
                const toRemove = !user ? currentUser.health : Math.round(currentUser.max_health/6);
                if (!turns[turns.length-1]) pushTurn();
                if (!turns[turns.length-1].logs) turns[turns.length-1].logs = [];
                turns[turns.length-1].logs.push(`${Emojis.timerIcon} \`TIMEOUT:\` **${currentUserUsername}** did not play in time: -${toRemove} hp.`);
                if (turns[turns.length-1].logs.length > 5) pushTurn();
                gameOptions.trns++;
                removeHealthToLastGuy(toRemove);
                loadBaseEmbed();
            }, (type === 'friendly' || type === 'ranked') ? 15000 : 60000 * 5);

        }
        async function loadBaseEmbed(): Promise<boolean> {
            timeoutClt();
            const povData = whosTurn();
            const components: MessageButton[] = [];
            const footer: { text: string } = Util.isNPC(povData) ? { text: "" } : { text: `⚡ You have ${povData.stamina} stamina left.` };
            const winner = opponent.health === 0 ? userData : opponent;
            const winnerUsername = Util.isNPC(winner) ? winner.name : ctx.client.users.cache.get(winner.id)?.username ?? "?";

            const content: string = !ended ? (Util.isNPC(povData) ? "[Waiting for your turn...]" : `It's ${ctx.client.users.cache.get(povData.id)?.username ?? "?"}'s turn.`) : `${winnerUsername} won!`;
        

            // BTNS
            if (Util.isNPC(povData) && !ended) {
                components.push(NPCBTN);
            } else if (!ended) {
                components.push(attackBTN, defendBTN(povData));
                if (povData.stand) components.push(standBTN(povData));
                components.push(forfeitBTN);
            }
            if (ended && Util.isNPC(opponent)) {
                if (winner.id !== opponent.id && type !== 'custom') {
                    getUserQuests().forEach(n => {
                        if (n.id === `defeat:${opponent.id}` && n.npc.health !== 0 && !editedNPC) {
                            n.npc.health = 0;
                            n.completed = true;
                            editedNPC = true;
                        }
                    });
                    if (userData.chapter_quests.filter(v => v.npc && v.npc.health !== 0).length !== 0 || userData.daily.quests.filter(v => v.npc && v.npc.health !== 0).length !== 0) {
                        components.push(nxtbtn);
                    }
                } else {
                    collector.stop();
                }
            }
            let fields = [];
            for (let i = 0; i < turns.filter(r => r.logs.length !== 0).length; i++) {
                const turn = turns[i];
                fields.push({
                    name: `__Turn ${i + 1}__`,
                    value: turn.logs.join("\n")
                })
            }
            if (fields.length > 24) fields = fields.slice(fields.length-24, fields.length);
            try {

                await ctx.makeMessage({
                    content: content,
                    components: components.length === 0 ? [] : [Util.actionRow(components)],
                    embeds: [{
                        title: ended ? "Battle Ended ⚔️" : "Battle in progress ⚔️",
                        description: `\`>>>\` ${ctx.interaction.user?.username} (${userData.stand ? UserStand.name : "Stand-less"}) ${Emojis.vs} ${Util.isNPC(opponent) ? opponent.name : ctx.client.users.cache.get(opponent.id)?.username ?? "?"} (${opponent.stand ? OpponentStand.name : "Stand-less"})\n\n`
                        + `:heart: \`${ctx.interaction.user?.username}\` ${userData.health}/${userData.max_health}\n:heart: \`${Util.isNPC(opponent) ? opponent.name : ctx.client.users.cache.get(opponent.id)?.username ?? "?"}\` ${opponent.health}/${opponent.max_health}\n----------------------------------\n`
                        + `:shield: \`${ctx.interaction.user?.username}\` ${getShieldStats(userData.id).left}/${getShieldStats(userData.id).left}\n:shield: \`${Util.isNPC(opponent) ? opponent.name : ctx.client.users.cache.get(opponent.id)?.username ?? "?"}\` ${getShieldStats(opponent.id).left}/${getShieldStats(opponent.id).max}\n\n`,
                        footer: footer,
                        color: ended ? "RED" : "YELLOW",
                        thumbnail: {
                            url: !Util.isNPC(povData) ? ctx.client.users.cache.get(povData.id).displayAvatarURL({dynamic: true}) : (povData.avatarURL ?? "")
                        },
                        fields: fields
                    }]
                });
    
            } catch(e) {

                ctx.followUp({
                    content: 'An error occured while loading the sandbox. Please try again. Contact us if the problem persists (https://jolyne.wtf/discord).',
                });
                collector.stop();
                ended = true;
                ctx.client.database.delCooldownCache("battle", ctx.interaction.user.id);
                if (user) ctx.client.database.delCooldownCache("battle", user.id);
            }


            if (opponent.id === povData.id && Util.isNPC(opponent) && !ended) await NPCAttack(); 
            if (Util.isNPC(opponent) && ended && type !== 'custom') { // WARN
                if (winner.id === opponent.id) opponent.health = opponent.max_health;     
                else opponent.health = 0;      
            }
            if (components[0]?.customId === nextID) return false;
            else return true;

            
        }

        function whosTurn(): NPC | UserData {
            return gameOptions.trns % 2 === 0 ? userData as UserData : opponent as NPC;
        }
        function beforeTurn() {
            return gameOptions.trns % 2 !== 0 ? userData as UserData : opponent as NPC;
        }
        function beforeTurnUsername() {
            const bft = beforeTurn();
            if (Util.isNPC(bft)) return bft.name;
            else return ctx.client.users.cache.get(bft.id)?.username ?? "?";
        }
        function whosTurnUsername() {
            const wt = whosTurn();
            if (Util.isNPC(wt)) return wt.name;
            else return ctx.client.users.cache.get(wt.id)?.username ?? "?";
        }
        function getShieldStats(id: string): { left: number, max: number } {
            return shields.filter(s => s.id === id)[0];
        }
        function attackShield(id: string, damage: number) {
            const shield = getShieldStats(id);
            shield.left -= damage;
            if (shield.left < 0) shield.left = 0;
            return shield;
        }
        function regenerateShieldToUser(id: string) {
            if (cooldowns.find(r => r.id === id && r.move === "defend")) {
                cooldowns.forEach(c => {
                    if (c.id === id && c.move === "defend") {
                        c.cooldown = 1
                    }
                });
            } else {
                cooldowns.push({
                    id: id,
                    move: "defend",
                    cooldown: 2
                });
            }

            const shield = getShieldStats(id);
            shield.left = shield.max;
        }
        function removeHealthToLastGuy(damage: number) {
            turns[turns.length - 1].lastDamage = damage;
            const lastGuy = beforeTurn();
            lastGuy.health -= Math.round(damage);
            if (lastGuy.health <= 0) {
                lastGuy.health = 0;
                end()
            }
        }
        async function end() {
            console.log(`${userData.tag} ended battle against ${opponent.id}`)
            if (opponent.id !== userData.id && !Util.isNPC(opponent)) {
                let oldOpp = opponent;
                opponent = await ctx.client.database.getUserData(opponent.id);
                opponent.stamina = oldOpp.stamina;
                opponent.health = oldOpp.health;
            }
            let oldUser = userData;
            userData = await ctx.client.database.getUserData(userData.id);
            userData.stamina = oldUser.stamina;
            userData.health = oldUser.health;
            ended = true;
            const end = await loadBaseEmbed();
            if (end || user) {
                collector.stop("Battle ended.");
            }
            ctx.client.database.delCooldownCache("battle", userData.id);
            ctx.client.database.delCooldownCache("battle", opponent.id);

            // check who's the winner & the loser and adapt them if npc or not
            let winner =  opponent.health !== 0 ? opponent : userData;
            let loser = opponent.health === 0 ? opponent : userData;
            const winnerUsername = Util.isNPC(winner) ? winner.name : ctx.client.users.cache.get(winner.id)?.username ?? "?";
            const loserUsername = Util.isNPC(loser) ? loser.name : ctx.client.users.cache.get(loser.id)?.username ?? "?";

            // Remove cds
            ctx.client.database.delCooldownCache("battle", userData.id);
            if (user) ctx.client.database.delCooldownCache("battle", opponentData.id);    

            // Anti-bug
            const winnerHealth = winner.health;
            const loserHealth = loser.health;
            const winnerStamina = winner.stamina;
            const loserStamina = loser.stamina;
            if (!Util.isNPC(winner)) {
                winner = await ctx.client.database.getUserData(winner.id);
                winner.health = winnerHealth;
                winner.stamina = winnerStamina;
            }
            if (!Util.isNPC(loser)) {
                loser = await ctx.client.database.getUserData(loser.id);
                loser.health = loserHealth;
                loser.stamina = loserStamina;
            }

            // NPC
            if (Util.isNPC(loser) && Util.isNPC(opponent)) {
                if (type !== "custom") {
                    /*
                    let editedNPC = false;
                    getUserQuests().forEach(n => {
                        if (n.id === `defeat:${opponent.id}` && n.npc.health !== 0 && !editedNPC) {
                            console.log('YEAH I DID IT')
                            n.npc.health = 0;
                            n.completed = true;
                            editedNPC = true;
                        }
                    });*/
                }
                const rewardsArr: string[] = [];
                Object.keys(opponent.fight_rewards).map((r) => {
                    if (!Util.isNPC(opponent)) return;
                    const reward = opponent.fight_rewards[r as keyof typeof opponent.fight_rewards];
                    if (typeof reward === "number") {
                        const emoji = r === "xp" ? Emojis.xp : Emojis.jocoins;
                        // @ts-expect-error 
                        userData[r as keyof typeof userData] += reward;
                        rewardsArr.push(`${emoji} +${Util.localeNumber(reward)} ${r.replace("money", "coins")}`);
                    } else if (reward instanceof Array && !Util.isQuestArray(reward)) {
                        for (const rewardItem of reward) {
                            userData.items.push(rewardItem.id);
                        }
                        const uniqueItems = [...new Set(reward.map(r => r))];
                        for (const item of uniqueItems) {
                            const itemCount = reward.filter(r => r.id === item.id).length;
                            rewardsArr.push(`+${itemCount} ${item.name} ${item.emoji}`);
                        }
                    } else if (Util.isQuestArray(reward)) {
                        for (const quest of reward) {
                            rewardsArr.push(`:scroll: \`${quest['id']}\``);
                            userData.chapter_quests.push(quest);
                        }
                    }    
                });
                ctx.client.database.saveUserData(userData);
                ctx.followUp({
                    content: `:crossed_swords: **${winnerUsername}** has defeated **${loserUsername}**! They got ${rewardsArr.length > 0 ? rewardsArr.join(", ") : "nothing"}.`,
                });                         
          
            } else if (!Util.isNPC(loser) && Util.isNPC(opponent)) {
                ctx.followUp({
                    content: `:skull: **${winnerUsername}** has defeated **${loserUsername}**...`,
                });
                if (type !== "custom") {
                    getUserQuests().forEach(n => {
                        if (n.id === `defeat:${opponent.id}` && n.npc.health !== 0 && !editedNPC) {
                            n.npc.health = opponent.max_health;
                            n.completed = true;
                            editedNPC = true;
                        }
                    });

                }
                ctx.client.database.saveUserData(userData);                        
            } else if (!Util.isNPC(loser) && !Util.isNPC(winner)) {
                if (type === "friendly") {
                    ctx.followUp({
                        content: `:crossed_swords: **${winnerUsername}** has defeated **${loserUsername}**! They got nothing since it was a friendly fight.`,
                    });
                } else {
                    // TODO: Finish this
                    function giveBonuses(winner: UserData, loser: UserData) {
                        let xp = Math.round(Number(loser.level) - Number(winner.level)) * 1250;
                        let toAdd = Number((loser.money * 5 / 100).toFixed(0));
                        if (isNaN(toAdd) || toAdd < 0) toAdd = 0;
                        loser.money = Math.round(loser.money - toAdd);
                        winner.money = Math.round(Number(winner.money) + toAdd);
                        if (xp < 0) xp = 0;
                        xp += Math.round((loser.level / 6) * 1000);
                        winner.xp = Math.round(Number(winner.xp) + xp);

                        loser.stats.rankedBattle.losses++;
                        winner.stats.rankedBattle.wins++;
                        return [Math.round(xp), Math.round(toAdd)];
                    }
                    const total = giveBonuses(winner, loser);

                    ctx.client.database.saveUserData(winner);
                    ctx.client.database.saveUserData(loser);

                    ctx.followUp({
                        content: `:crossed_swords: **${winnerUsername}** has defeated **${loserUsername}**! They got ${total[0] > 0 ? `${Emojis.xp} +${Util.localeNumber(total[0])} XP` : ""} and ${total[1] > 0 ? `${Emojis.jocoins} +${Util.localeNumber(total[1])} coins from their pocket` : ""}.`
                    });
                }
            }
        }

        function sendStandPage(stand: Stand, userData: UserData): Promise<Message<boolean>> {
            const fields: Array<{
                name: string;
                value: string;
                inline?: boolean;
            }> = [];
            const buttons: MessageButton[] = [homeBTN];
        
            for (const ability of stand.abilities) {
                const damage: number = Util.calcAbilityDMG(ability, userData);
                const onCooldown = cooldowns.find(r => r.id === userData.id && r.move === ability.name)?.cooldown > 0;
                const outOfStamina = userData.stamina < ability.stamina;
                const cdLeft = cooldowns.find(r => r.id === userData.id && r.move === ability.name)?.cooldown ?? 0;
                buttons.push(new MessageButton()
                    .setCustomId(`abil++${stand.name}_${ability.name}`)
                    .setLabel(ability.name)
                    .setStyle(onCooldown ? "SECONDARY": (outOfStamina ? "DANGER" : "PRIMARY"))
                    .setDisabled((onCooldown || outOfStamina) ? true : false)
                    )
                fields.push({
                    name: `${ability.ultimate ? "⭐" : ""}${ability.name}`,
                    inline: ability.ultimate ? false : true,
                    value: `**\`Damages:\`** ${damage}
**\`Stamina Cost:\`** ${ability.stamina}
**\`Cooldown?:\`** ${(cdLeft === 0 ? "READY": `${cdLeft} turn(s)`)}
                            
*${ability.description}*
${ability.ultimate ? "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬" : "▬▬▬▬▬▬▬▬▬"}`
                });
            }
            const embed = new MessageEmbed()
            .setAuthor({ name: stand.name, iconURL: stand.image })
            .addFields(fields)
            .setDescription(stand.description + "\n" + `
**BONUSES:** +${Object.keys(stand.skill_points).map(v => stand.skill_points[v as keyof typeof stand.skill_points]).reduce((a, b) => a + b, 0)} Skill-Points:
${Object.keys(stand.skill_points).map(r =>  `  • +${stand.skill_points[r as keyof typeof stand.skill_points]} ${r}`).join("\n")}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        `)
            .setFooter({ text: `Rarity: ${stand.rarity} | RED BUTTON = OUT OF STAMINA | GREY BUTTON = ON COOLDOWN` })
            .setColor(stand.color)
            .setThumbnail(stand.image);
            return ctx.makeMessage({
                embeds: [embed],
                components: [Util.actionRow(buttons)]
            });
        }

    }
};
