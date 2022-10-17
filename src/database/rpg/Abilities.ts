import type { Ability, UserData, NPC, Turn } from '../../@types';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import CommandInteractionContext from '../../structures/Interaction';

export const Stand_Barrage: Ability = {
    name: 'Barrage',
    description: 'Performs an astoundingly fast flurry of punches that deals small damage per hit',
    cooldown: 5,
    damages: 10,
    blockable: false,
    dodgeable: true,
    stamina: 10
};

export const Kick_Barrage: Ability = {
    name: 'Kick Barrage',
    description: 'Performs an astoundingly fast flurry of punches that deals small damage per hit',
    cooldown: 3,
    damages: 5,
    blockable: true,
    dodgeable: true,
    stamina: 5
};

export const Star_Finger: Ability = {
    name: 'Star Finger',
    description: 'Extends Star Platinum\'s finger and stabs the target in the eyes',
    cooldown: 7,
    damages: 25,
    blockable: false,
    dodgeable: true,
    stamina: 50
};

export const Time_Stop: Ability = {
    name: 'Time Stop',
    description: 'Stops time for a short period of time (4 turns)',
    cooldown: 10,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 100,
    ultimate: true,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        turns[turns.length - 1].lastMove = "attack";
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerStand = caller.stand ? Util.getStand(caller.stand) : null;
        const victimStand = victim.stand ? Util.getStand(victim.stand) : null;
        const canCounter = victimStand ? (victimStand.abilities.find(ability => ability.name === 'Time Stop') ? true : false) : false;

        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: canCounter ? 3 : 4,
            completed: false
        };

        if (callerStand.name === "The World: Over Heaven") gameOptions[tsID].cd = 7;

        turns[turns.length - 1].logs.push(`!!! **${callerUsername}:** ${callerStand.name}: ${callerStand.text.timestop_text}`);
        if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === "defend")) {
            gameOptions.cooldowns.forEach((c: any) => {
                if (c.id === caller.id && c.move === "defend") {
                    c.cooldown = gameOptions[tsID].cd-2
                }
            });
        } else {
            gameOptions.cooldowns.push({
                id: caller.id,
                move: "defend",
                cooldown: gameOptions[tsID].cd-2
            });
        }
        const func = (async () => {
            if (gameOptions[tsID].completed) return;
            gameOptions.donotpush = true;
            gameOptions.invincible = true;
            gameOptions.trns--;
            if (gameOptions[tsID].cd !== 0) {
                gameOptions[tsID].cd--;
                if (gameOptions[tsID].cd === 0) {
                    gameOptions[tsID].completed = true;
                    gameOptions.donotpush = false;
                    gameOptions.invincible = false;
                    gameOptions.trns--;
                    canCounter ? turns[turns.length - 1].logs.push(`::: ${victimUsername}'s ${victimStand.name} countered the time stop`) :                     turns[turns.length - 1].logs.push(`??? **${callerUsername}:** ${callerStand.text.timestop_end_text}`);
                    gameOptions.pushnow();
                }
            }
        });
        if (gameOptions.opponentNPC === caller.id) {
            gameOptions.donotpush = true;
            gameOptions.invincible = true;
            for (let i = 0; i < gameOptions[tsID].cd-1; i++) {
                //gameOptions.NPCAttack("f", caller, i === 0 ? true : false);
                let possibleMoves: Array<string | Ability> = ["attack"];
                if (callerStand) {
                    for (const ability of callerStand.abilities) {
                        if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === ability.name)?.cooldown <= 0) {
                            possibleMoves.push(ability);
                        }
                    }
                }
                const choosedMove = Util.randomArray(possibleMoves);
                const before = victim;
                let dodged: boolean = false;
                const dodges = Util.calcDodgeChances(before);
                const dodgesNumerator = 90 + (!Util.isNPC(before) ? before.spb?.perception : before.skill_points.perception);
                const dodgesPercent = Util.getRandomInt(0, Math.round(dodgesNumerator));
                if (dodgesPercent < dodges) dodged = true;
                if (gameOptions.invincible) dodged = false;
                switch (choosedMove) {
                    case "attack":
                        const input = gameOptions.attack({ damages: Util.calcATKDMG(caller), username: (caller as NPC).name }, dodged, turns[turns.length - 1]);
                        turns[turns.length - 1].logs.push(input);
                        break;
                    case "defend":
                        gameOptions.defend();
                        break;
                    default:
                        const ability = choosedMove as Ability;
                        const input2 = gameOptions.triggerAbility(ability, caller, dodged, turns[turns.length - 1]);
                        turns[turns.length - 1].logs.push(input2);
                        break;
                }

            }
            gameOptions.donotpush = false;
            gameOptions.invincible = false;
            canCounter ? turns[turns.length - 1].logs.push(`::: ${victimUsername}'s ${victimStand.name} countered the time stop`) :                     turns[turns.length - 1].logs.push(`??? **${callerUsername}:** ${callerStand.text.timestop_end_text}`);
            gameOptions.loadBaseEmbed();


        } else promises.push(func);

    }
};

export const Road_Roller: Ability = {
    name: 'Road Roller',
    description: 'jumps high into the sky, bringing a steamroller down with them, slamming it down where they were previously standing',
    cooldown: Star_Finger['cooldown'],
    damages: Star_Finger['damages'],
    blockable: Star_Finger['blockable'],
    dodgeable: Star_Finger['dodgeable'],
    stamina: Star_Finger['stamina']
};

export const Emerald_Splash: Ability = {
    name: 'Emerald Splash',
    description: 'fires off a large amount of energy which takes the form of emeralds.',
    cooldown: 5,
    damages: 25,
    blockable: false,
    dodgeable: true,
    stamina: 20
};

export const Vola_Barrage: Ability = {
    name: 'Vola Barrage',
    description: 'Sends a wave of bullets in the direction the user is facing.',
    cooldown: 4,
    damages: 15,
    blockable: false,
    dodgeable: true,
    stamina: 30
};

export const Little_Boy: Ability = {
    name: 'Little Boy',
    description: 'drop 3 bombs behind its opponent that will explode instantly',
    cooldown: 10,
    damages: 30,
    blockable: false,
    dodgeable: false,
    stamina: 50
}

export const Light_Speed_Barrage: Ability = {
    name: 'Light-Speed Barrage',
    description: 'erases matter to jump on the enemies and assault them with rapid punches.',
    cooldown: 4,
    damages: 25,
    blockable: false,
    dodgeable: false,
    stamina: 40
}

export const Deadly_Erasure: Ability = {
    name: 'Deadly Erasure',
    description: 'uses their right hand to erase space and jump one you and use the effect of surprise to erase you and make you discover where thing he erase go..',
    cooldown: 10,
    damages: 30,
    blockable: false,
    dodgeable: false,
    stamina: 100
}

export const Crossfire_Hurricane: Ability = {
    name: 'Crossfire Hurricane',
    description: 'launches 1 cross in the shape of an ankh at the oppenent.',
    cooldown: 5,
    damages: 10,
    blockable: true,
    dodgeable: true,
    stamina: 20,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const damage = Math.round(Util.calcAbilityDMG(Crossfire_Hurricane, caller) / 10);


        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 3,
        };
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            if (gameOptions.invincible) return;
            gameOptions[tsID].cd--;
            turns[turns.length - 1].logs.push(`:fire:${victimUsername} took some burn damages (-${damage} :heart:)`);
            victim.health -= damage;
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`:fire:${victimUsername} died by burning`);
            }
        });

        if (Util.getStand(victim.stand).name !== Util.getStand('Magicians Red').name) promises.push(func);
    }

}

export const Red_Bind: Ability = {
    name: 'Red Bind',
    description: 'takes two swings at the opponent with fiery chains.',
    cooldown: 7,
    damages: 15,
    blockable: true,
    dodgeable: true,
    stamina: 22,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const damage = Math.round(Util.calcAbilityDMG(Red_Bind, caller) / 10);

        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 3,
        };
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            if (gameOptions.invincible) return;
            gameOptions[tsID].cd--;
            turns[turns.length - 1].logs.push(`:fire:${victimUsername} took some burn damages (-${damage} :heart:)`);
            victim.health -= damage;
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`:fire:${victimUsername} died by burning`);
            }
        });

        if (Util.getStand(victim.stand).name !== Util.getStand('Magicians Red').name) promises.push(func);
    }
    
}

export const Bakugo: Ability = {
    name: 'Bakugo',
    description: "grabs the opponent before engulfing the opponent's head in flames.",
    cooldown: 15,
    damages: 45,
    blockable: false,
    dodgeable: false,
    stamina: 50,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const damage = Math.round(Util.calcAbilityDMG(Bakugo, caller) / 10);


        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 3,
        };
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            if (gameOptions.invincible) return;
            gameOptions[tsID].cd--;
            turns[turns.length - 1].logs.push(`:fire:${victimUsername} took some burn damages (-${damage} :heart:)`);
            victim.health -= damage;
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`:fire:${victimUsername} died by burning`);
            }
        });

        if (Util.getStand(victim.stand).name !== Util.getStand('Magicians Red').name) promises.push(func);
    }
}

export const OhMyGod: Ability = {
    name: 'Oh my God',
    description: "Boosts your damage for 5 turns (+10 strength).",
    cooldown: 4,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 20,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const tsID = Util.generateID();
        function addSkillPointsToCaller(amout: number) {
            if (Util.isNPC(caller)) {
                caller.skill_points["strength"] += amout;
            } else caller.spb["strength"] += amout;
        }
        addSkillPointsToCaller(10);
        gameOptions[tsID] = {
            cd: 10,
        };
        turns[turns.length - 1].logs.push(`OH MY GOD! ${callerUsername} boosted their strength by 10 for some turns`);

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            if (gameOptions[tsID].cd === 0) {
                addSkillPointsToCaller(-10);
                turns[turns.length - 1].logs.push(`OH MY GOD! ${callerUsername}'s strength boost has expired`);
            }
        });

        promises.push(func);
    }
}


export const Vine_Slap: Ability = {
    name: 'Vine Slap',
    description: "extends Hermit Purple's vines to whip twice in the opponent's dierction",
    cooldown: 6,
    damages: 20,
    blockable: true,
    dodgeable: true,
    stamina: 25
}

export const The_Joestar_Technique: Ability = {
    name: 'The Joestar Technique',
    description: '..... runs away using the secret Joestar Technique. yes this is too op',
    cooldown: 0,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 0
}

export const Fencing_Barrage: Ability = {
    name: 'Fencing Barrage',
    description: 'A defensive 360-degree slash that does multiple hits.',
    cooldown: 5,
    damages: 15,
    blockable: false,
    dodgeable: true,
    stamina: 20
}

export const Finisher: Ability = {
    name: 'Finisher',
    description: 'attacks or finish the opponent by aiming at one of his vital parts [CRITICAL]',
    cooldown: 11,
    damages: 30,
    blockable: false,
    dodgeable: false,
    stamina: 35
}

export const Hatred_powered_Object_Possession: Ability = {
    name: 'Hatred-powered Object Possession',
    description: "Ebony Devil is powered by Devo's own grudge, which automatically triggers upon sustaining damage from his intended victim.",
    cooldown: 3,
    damages: 20,
    blockable: false,
    dodgeable: true,
    stamina: 20
}

export const Stand_Disc: Ability = {
    name: 'Stand Disc',
    description: 'Takes out your opponen\'s disc. They will be unable to use their stand\'s abilites for a few turns.',
    cooldown: 9,
    damages: 0,
    blockable: false,
    dodgeable: true,
    stamina: 20,
    ultimate: true,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const victimStand = victim.stand;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 7,
        };

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            if (gameOptions[tsID].cd === 0) {
                turns[turns.length - 1].logs.push(`${victimUsername}'s stand is no longer disabled`);
                victim.stand = victimStand;
            }
        });

        if (victimStand) {
            turns[turns.length - 1].logs.push(`${Emojis.disk} \`${victimUsername}\`'s stand (**${victimStand}**) is disabled for some turns.`);
            victim.stand = null;
            promises.push(func);
        } else {
            turns[turns.length - 1].logs.push(`${victimUsername} doesn't have a stand.. you fool lol you just wasted your stamina. HOW CAN YOU BE SO DUMB MAN LMAO SMH CANT BE ME`);
        }
    }
}

export const Hallucinogen: Ability = {
    name: 'Hallucinogen',
    description: 'Creates a hallucinogen that decreases your opponent\'s perception to 90% (and boosts your perception to 90%) for a few turns.',
    cooldown: 7,
    damages: 0,
    blockable: false,
    dodgeable: true,
    stamina: 20,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const victimStand = victim.stand;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 7,
        };
        let oldPerception: number = Util.isNPC(victim) ? victim.skill_points["perception"] : victim.spb["perception"];
        let oldCallererception: number = Util.isNPC(caller) ? caller.skill_points["perception"] : caller.spb["perception"];
        Util.isNPC(caller) ? caller.skill_points["perception"] += Math.floor(oldCallererception * 0.90) : caller.spb["perception"] += Math.floor(oldCallererception * 0.90);
        Util.isNPC(victim) ? victim.skill_points["perception"] -= Math.floor(oldPerception * 0.90) : victim.spb["perception"] = Math.floor(oldPerception * 0.90);
        turns[turns.length - 1].logs.push(`💭 WOW! **${victimUsername}** can't see anything.`);

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            if (gameOptions[tsID].cd === 0) {
                turns[turns.length - 1].logs.push(`💭 The hallucinogen effect has expired`);
                Util.isNPC(caller) ? caller.skill_points["perception"] -= Math.floor(oldCallererception * 0.90) : caller.spb["perception"] -= Math.floor(oldCallererception * 0.90);
                Util.isNPC(victim) ? victim.skill_points["perception"] += Math.floor(oldPerception * 0.90) : victim.spb["perception"] -= Math.floor(oldPerception * 0.90);
            }
        });
        promises.push(func);

    }
}

export const Gun: Ability = {
    name: 'Gun',
    description: 'A gun that shoots a bullet at the opponent. The bullet will deal damages and stun the opponent for 2 turns.',
    cooldown: 13,
    damages: 30,
    blockable: false,
    dodgeable: true,
    stamina: 20,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 3,
        };
        turns[turns.length - 1].logs.push(`:gun::speech_left: **${victimUsername}** is stunned. :gun::speech_left:`);

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            gameOptions.trns--;
            gameOptions.invincible = true;
            if (gameOptions[tsID].cd === 0) {
                gameOptions.invincible = false;
                gameOptions.trns--;
                turns[turns.length - 1].logs.push(`:gun::x: **${victimUsername}** is no longer stunned. :gun::x:`);
            }
        });
        if (gameOptions.opponentNPC === caller.id) {
            for (let i = 0; i < gameOptions[tsID].cd; i++) {
                gameOptions.NPCAttack(true);
            }
            turns[turns.length - 1].logs.push(`:gun::x: **${victimUsername}** is no longer stunned. :gun::x:`);
        } else promises.push(func);
    }
}

export const Self_Heal: Ability = {
    name: 'Self Heal',
    description: 'Use some items around you to heal yourself. Heals you for 10% of your max health.',
    heal: '10%',
    cooldown: 5,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 20,
}

export const Life_Shot: Ability = {
    name: 'Life Shot',
    description: 'Deals some damages initially, but cause your opponent to leave his body for 3 turns.',
    cooldown: 10,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 100,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        turns[turns.length - 1].lastMove = "attack";
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerStand = caller.stand ? Util.getStand(caller.stand) : null;
        const victimStand = victim.stand ? Util.getStand(victim.stand) : null;

        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 4,
            completed: false
        };

        turns[turns.length - 1].logs.push(`!!! **${victimUsername}** 🐞 🐞 🐞....\nWHERE'S ${victimUsername} ??\n\n....`);
        if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === "defend")) {
            gameOptions.cooldowns.forEach((c: any) => {
                if (c.id === caller.id && c.move === "defend") {
                    c.cooldown = gameOptions[tsID].cd-2
                }
            });
        } else {
            gameOptions.cooldowns.push({
                id: caller.id,
                move: "defend",
                cooldown: gameOptions[tsID].cd-2
            });
        }
        const func = (async () => {
            if (gameOptions[tsID].completed) return;
            gameOptions.donotpush = true;
            gameOptions.invincible = true;
            gameOptions.trns--;
            if (gameOptions[tsID].cd !== 0) {
                gameOptions[tsID].cd--;
                if (gameOptions[tsID].cd === 0) {
                    gameOptions[tsID].completed = true;
                    gameOptions.donotpush = false;
                    gameOptions.invincible = false;
                    gameOptions.trns--;
                    turns[turns.length - 1].logs.push(`??? **${callerUsername}** 🐞 🐞 🐞\n${victimUsername} is back to life. 🐞 🐞 🐞\n\n...`);
                    gameOptions.pushnow();
                }
            }
        });
        if (gameOptions.opponentNPC === caller.id) {
            gameOptions.donotpush = true;
            gameOptions.invincible = true;
            for (let i = 0; i < gameOptions[tsID].cd-1; i++) {
                //gameOptions.NPCAttack("f", caller, i === 0 ? true : false);
                let possibleMoves: Array<string | Ability> = ["attack"];
                if (callerStand) {
                    for (const ability of callerStand.abilities) {
                        if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === ability.name)?.cooldown <= 0) {
                            possibleMoves.push(ability);
                        }
                    }
                }
                const choosedMove = Util.randomArray(possibleMoves);
                const before = victim;
                let dodged: boolean = false;
                const dodges = Util.calcDodgeChances(before);
                const dodgesNumerator = 90 + (!Util.isNPC(before) ? before.spb?.perception : before.skill_points.perception);
                const dodgesPercent = Util.getRandomInt(0, Math.round(dodgesNumerator));
                if (dodgesPercent < dodges || dodges === 696969) dodged = true;
                if (gameOptions.invincible) dodged = false;
                switch (choosedMove) {
                    case "attack":
                        const input = gameOptions.attack({ damages: Util.calcATKDMG(caller), username: (caller as NPC).name }, dodged, turns[turns.length - 1]);
                        turns[turns.length - 1].logs.push(input);
                        break;
                    case "defend":
                        gameOptions.defend();
                        break;
                    default:
                        const ability = choosedMove as Ability;
                        const input2 = gameOptions.triggerAbility(ability, caller, dodged, turns[turns.length - 1]);
                        turns[turns.length - 1].logs.push(input2);
                        break;
                }

            }
            gameOptions.donotpush = false;
            gameOptions.invincible = false;
            turns[turns.length - 1].logs.push(`??? **${callerUsername}** :x::x::x:\n${victimUsername} is back to life. :x::x::x:`);
            gameOptions.loadBaseEmbed();


        } else promises.push(func);

    }
};

export const Life_Giver: Ability = {
    name: 'Life Giver',
    description: 'Deals a punch near your enemy giving life. 50% chance it will grab your opponents with vines for 4 turns. 40% chance for thorns, grabbing them for 2 turns, and dealing your atk damages each turn. 10% chance to poison your enemy dealing 10 damage for some turns.',
    cooldown: 15,
    damages: 10,
    blockable: false,
    dodgeable: true,
    stamina: 100,
    ultimate: true,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const percent = Util.getRandomInt(0, 100);
        if (percent <= 50) {
            turns[turns.length - 1].lastMove = "attack";
            const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
            const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
            const callerStand = caller.stand ? Util.getStand(caller.stand) : null;
            const victimStand = victim.stand ? Util.getStand(victim.stand) : null;
    
            const tsID = Util.generateID();
            gameOptions[tsID] = {
                cd: 4,
                completed: false
            };
    
            turns[turns.length - 1].logs.push(`\`>>>\` **${victimUsername}** is stuck in vines.\n\n🌱🌱🌱🌱🌱🌱`);
            if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === "defend")) {
                gameOptions.cooldowns.forEach((c: any) => {
                    if (c.id === caller.id && c.move === "defend") {
                        c.cooldown = gameOptions[tsID].cd-2
                    }
                });
            } else {
                gameOptions.cooldowns.push({
                    id: caller.id,
                    move: "defend",
                    cooldown: gameOptions[tsID].cd-2
                });
            }
            const func = (async () => {
                if (gameOptions[tsID].completed) return;
                gameOptions.donotpush = true;
                gameOptions.invincible = true;
                gameOptions.trns--;
                if (gameOptions[tsID].cd !== 0) {
                    gameOptions[tsID].cd--;
                    if (gameOptions[tsID].cd === 0) {
                        gameOptions[tsID].completed = true;
                        gameOptions.donotpush = false;
                        gameOptions.invincible = false;
                        gameOptions.trns--;
                        turns[turns.length - 1].logs.push(`\`>>>\` VINES ARE GONE! 🌱🌱🌱🌱🌱`);
                        gameOptions.pushnow();
                    }
                }
            });
            if (gameOptions.opponentNPC === caller.id) {
                gameOptions.donotpush = true;
                gameOptions.invincible = true;
                for (let i = 0; i < gameOptions[tsID].cd-1; i++) {
                    //gameOptions.NPCAttack("f", caller, i === 0 ? true : false);
                    let possibleMoves: Array<string | Ability> = ["attack"];
                    if (callerStand) {
                        for (const ability of callerStand.abilities) {
                            if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === ability.name)?.cooldown <= 0) {
                                possibleMoves.push(ability);
                            }
                        }
                    }
                    const choosedMove = Util.randomArray(possibleMoves);
                    const before = victim;
                    let dodged: boolean = false;
                    const dodges = Util.calcDodgeChances(before);
                    const dodgesNumerator = 90 + (!Util.isNPC(before) ? before.spb?.perception : before.skill_points.perception);
                    const dodgesPercent = Util.getRandomInt(0, Math.round(dodgesNumerator));
                    if (dodgesPercent < dodges) dodged = true;
                    if (gameOptions.invincible) dodged = false;
                    switch (choosedMove) {
                        case "attack":
                            const input = gameOptions.attack({ damages: Util.calcATKDMG(caller), username: (caller as NPC).name }, dodged, turns[turns.length - 1]);
                            turns[turns.length - 1].logs.push(input);
                            break;
                        case "defend":
                            gameOptions.defend();
                            break;
                        default:
                            const ability = choosedMove as Ability;
                            const input2 = gameOptions.triggerAbility(ability, caller, dodged, turns[turns.length - 1]);
                            turns[turns.length - 1].logs.push(input2);
                            break;
                    }
    
                }
                gameOptions.donotpush = false;
                gameOptions.invincible = false;
                turns[turns.length - 1].logs.push(`\`>>>\` VINES ARE GONE! 🌱🌱🌱🌱🌱`);
                gameOptions.loadBaseEmbed();
    
    
            } else promises.push(func);
    } else if (percent <= 80) {
            turns[turns.length - 1].lastMove = "attack";
            const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
            const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
            const callerStand = caller.stand ? Util.getStand(caller.stand) : null;
            const victimStand = victim.stand ? Util.getStand(victim.stand) : null;
    
            const tsID = Util.generateID();
            gameOptions[tsID] = {
                cd: 4,
                completed: false
            };
    
            turns[turns.length - 1].logs.push(`\`>>>\` **${victimUsername}** is stuck in horns. Every turn, horns will deal 10 dmg.\n\n🌿🌿🌿🌿`);
            if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === "defend")) {
                gameOptions.cooldowns.forEach((c: any) => {
                    if (c.id === caller.id && c.move === "defend") {
                        c.cooldown = gameOptions[tsID].cd-2
                    }
                });
            } else {
                gameOptions.cooldowns.push({
                    id: caller.id,
                    move: "defend",
                    cooldown: gameOptions[tsID].cd-2
                });
            }
            const func = (async () => {
                if (gameOptions[tsID].completed) return;
                gameOptions.donotpush = true;
                gameOptions.invincible = true;
                turns[turns.length - 1].logs.push(`::: 🌿 HORNS SLAPPED **${victimUsername}** ! (-10 :heart:)`);
                victim.health -= 10;
                gameOptions.trns--;
                if (gameOptions[tsID].cd !== 0) {
                    gameOptions[tsID].cd--;
                    if (gameOptions[tsID].cd === 0) {
                        gameOptions[tsID].completed = true;
                        gameOptions.donotpush = false;
                        gameOptions.invincible = false;
                        gameOptions.trns--;
                        turns[turns.length - 1].logs.push(`\`>>>\` HORNS ARE GONE! 🌿🌿🌿🌿`);
                        gameOptions.pushnow();
                    }
                }
            });
            if (gameOptions.opponentNPC === caller.id) {
                gameOptions.donotpush = true;
                gameOptions.invincible = true;
                for (let i = 0; i < gameOptions[tsID].cd-1; i++) {
                    //gameOptions.NPCAttack("f", caller, i === 0 ? true : false);
                    let possibleMoves: Array<string | Ability> = ["attack"];
                    if (callerStand) {
                        for (const ability of callerStand.abilities) {
                            if (gameOptions.cooldowns.find((r: any) => r.id === caller.id && r.move === ability.name)?.cooldown <= 0) {
                                possibleMoves.push(ability);
                            }
                        }
                    }
                    const choosedMove = Util.randomArray(possibleMoves);
                    const before = victim;
                    let dodged: boolean = false;
                    const dodges = Util.calcDodgeChances(before);
                    const dodgesNumerator = 90 + (!Util.isNPC(before) ? before.spb?.perception : before.skill_points.perception);
                    const dodgesPercent = Util.getRandomInt(0, Math.round(dodgesNumerator));
                    if (dodgesPercent < dodges) dodged = true;
                    if (gameOptions.invincible) dodged = false;
                    switch (choosedMove) {
                        case "attack":
                            const input = gameOptions.attack({ damages: Util.calcATKDMG(caller), username: (caller as NPC).name }, dodged, turns[turns.length - 1]);
                            turns[turns.length - 1].logs.push(input);
                            break;
                        case "defend":
                            gameOptions.defend();
                            break;
                        default:
                            const ability = choosedMove as Ability;
                            const input2 = gameOptions.triggerAbility(ability, caller, dodged, turns[turns.length - 1]);
                            turns[turns.length - 1].logs.push(input2);
                            break;
                    }
    
                }
                gameOptions.donotpush = false;
                gameOptions.invincible = false;
                turns[turns.length - 1].logs.push(`\`>>>\` HORNS ARE GONE! 🌿🌿🌿🌿`);
                gameOptions.loadBaseEmbed();
            } else promises.push(func);
    } else {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const damage = Math.round(Util.calcAbilityDMG(Bakugo, caller) / 10);
        turns[turns.length - 1].logs.push(`\`>>>\` **${victimUsername}** got punched ✊🩸.\n:warning: This punch contains poison !\n\n....`);
        const dmg = Util.calcATKDMG(caller);



        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 7,
        };
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            if (gameOptions.invincible) return;
            gameOptions[tsID].cd--;
            turns[turns.length - 1].logs.push(`✊🩸 **${victimUsername}** POISON EFFECTS (-${dmg} :heart:)`);
            victim.health -= dmg;
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`${victimUsername} DIED CUZ OF POISONS! LOL WHAT A SHAAAAAME!\n\nL ✊🩸✊🩸✊🩸✊🩸✊🩸✊🩸`);
            }
        });

        promises.push(func);


    }  
}
};

export const Rage: Ability = {
    name: "Rage",
    description: "The more damage taken, the more damage you deal. [PASSIVE]",
    cooldown: 5,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 150,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 9,
        };
        turns[turns.length - 1].logs.push(`\`[RAGE]\` [**${callerUsername}:**] The more damage taken, the more damage you deal`);

        let oldHealth = caller.health;
        let oldStrength = caller.skill_points.strength;
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            if (gameOptions[tsID].cd === 0) {
                turns[turns.length - 1].logs.push(`\`[RAGE]\` ended.`);
                Util.isNPC(caller) ? caller['skill_points']['strength'] = oldStrength : caller.spb.strength = oldStrength;
                return;
            }

            if (caller.health < oldHealth) {
                addSkillPointsToCaller(10);
                turns[turns.length - 1].logs.push(`\`[RAGE]\` **${callerUsername}** gained 5 strength.`);
            }
            oldHealth = caller.health;

        });

        promises.push(func);

        function addSkillPointsToCaller(amout: number) {
            if (Util.isNPC(caller)) {
                caller.skill_points["strength"] += amout;
            } else caller.spb["strength"] += amout;
        }

    }
}
    

export const Poison_Gas: Ability = {
    name: 'Poison Gas',
    description: "deals your atk damage every turn to your opponent for some turns. 10% of your atk damage is also dealt to you every turn.",
    cooldown: 8,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 50,
    ultimate: true,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const damage = Util.calcATKDMG(caller);
        turns[turns.length - 1].logs.push(`**${callerUsername}** used **Poison Gas** on **${victimUsername}** ${Util.getStand(victim.stand).name === Util.getStand('Purple Haze').name ? 'but it has no effect cuz their opponent has also purple haze OMG!!!!' : ''}.`);

        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 10,
        };
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            if (gameOptions.invincible) return;
            gameOptions[tsID].cd--;
            turns[turns.length - 1].logs.push(`:skull:${victimUsername} took some poison damages (-${damage} :heart:)\n:skull:${callerUsername} took some poison damages (-${Math.round(damage / 10)} :heart:)`);
            victim.health -= damage;
            caller.health -= Math.round(damage / 10);
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`:skull:${victimUsername} died cuz of the poison gas!`);
            }
        });

        if (Util.getStand(victim.stand).name !== Util.getStand('Purple Haze').name) promises.push(func);
    }
}

export const Capsule_Shot: Ability = {
    name: 'Capsule Shot',
    description: "shoot the capsules from your fist at your enemy, poisoning them for 6 turns.",
    cooldown: 6,
    damages: 15,
    blockable: false,
    dodgeable: false,
    stamina: 50,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const damage = Math.round(Util.calcAbilityDMG(Capsule_Shot, caller) / 10);


        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 5,
        };
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            if (gameOptions.invincible) return;
            gameOptions[tsID].cd--;
            turns[turns.length - 1].logs.push(`:skull:${victimUsername} took some poison damages (-${damage} :heart:)`);
            victim.health -= damage;
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`:skull:${victimUsername} died cuz of the poison gas!`);
            }
        });

        if (Util.getStand(victim.stand).name !== Util.getStand('Purple Haze').name) promises.push(func);
    }
}

export const Reality_Overwriting_Punch: Ability = {
    name: 'Reality Overwriting Punch',
    description: "OUUUUUUUUUUUCH",
    cooldown: 0,
    damages: 60,
    blockable: false,
    dodgeable: false,
    stamina: 50
}

export const Road_Roller_DA: Ability = {
    name: 'Road Roller DA!',
    description: "MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDA MUDAAAAAA !",
    cooldown: 0,
    damages: 100,
    blockable: false,
    dodgeable: false,
    stamina: 50
}

export const Heaven_Ascended_Smite: Ability = {
    name: 'Heaven Ascended Smite',
    description: "HOLY SHIT!",
    cooldown: 0,
    damages: 120,
    blockable: false,
    dodgeable: false,
    stamina: 50
}

export const Secondary_Jaw: Ability = {
    name: 'Secondary Jaw',
    description: 'no desc cuz private ability',
    cooldown: 3,
    damages: 30,
    blockable: false,
    dodgeable: false,
    stamina: 50
}

export const Light_Lunge: Ability = {
    name: 'Light Lunge',
    description: 'materialize a light sword & attacks.',
    cooldown: 3,
    damages: 9,
    blockable: false,
    dodgeable: true,
    stamina: 10
}

export const Light_Kick: Ability = {
    name: 'Light Kick',
    description: 'light kicks the ennemy dealing wow dmgs.',
    cooldown: 5,
    damages: 13,
    blockable: false,
    dodgeable: true,
    stamina: 10
}

export const Mirror_Kick: Ability = {
    name: 'Yata no Kagami',
    description: 'mirror kicks (zigzag)',
    cooldown: 7,
    damages: 25,
    blockable: false,
    dodgeable: false,
    stamina: 10
}

export const Jewels_Of_Light: Ability = {
    name: 'Jewels of Light',
    description: 'light op bro u cannot dodge this (pwee pwee pwee pwee LIGHT).',
    cooldown: 10,
    damages: 30,
    blockable: false,
    dodgeable: false,
    stamina: 10
}


export const Coin_Bomb: Ability = {
    name: 'Coin Bomb',
    description: 'Throw a coin bomb at one of your opponents moves',
    cooldown: 3,
    damages: 15,
    blockable: false,
    dodgeable: false,
    stamina: 10,
}

export const Bomb: Ability = {
    name: 'Bomb',
    description: 'Plant a bomb on your enemy, and a one turn delay, the bomb explodes',
    cooldown: 5,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 10,
}

export const Coin_Barrage: Ability = {
    name: 'Coin Barrage',
    description: 'Unleash a barrage of coins, that explode on impact',
    cooldown: Stand_Barrage.cooldown,
    damages: Stand_Barrage.damages,
    blockable: Stand_Barrage.blockable,
    dodgeable: Stand_Barrage.dodgeable,
    stamina: Stand_Barrage.stamina,
}

export const Escape_Plan: Ability = {
    name: 'Escape Plan',
    description: 'Blast yourself off in an explosion. Dealing some damages to the enemy, and some damages to yourself, but their next hit will automatically miss',
    cooldown: 0,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 15,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const tsID = Util.generateID();
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        gameOptions[tsID] = {
            cd: 2,
        };
        const damage = Math.round(Util.calcATKDMG(victim) / 3);
        caller.health -= damage;

        turns[turns.length - 1].logs.push(`🌬️ ${callerUsername} used ESCAPE PLAN and took some damages (-${damage} :heart:)`);
        const oldVictim = Util.isNPC(victim) ? victim.skill_points.perception : victim.spb.perception
        const oldCaller = Util.isNPC(caller) ? caller.skill_points.perception : caller.spb.perception

        Util.isNPC(victim) ? victim.skill_points.perception = -696969 : victim.spb.perception = -696969
        Util.isNPC(caller) ? caller.skill_points.perception = -696969 : caller.spb.perception = -696969
        const callerHp = caller.health;


        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;

            if (gameOptions[tsID].cd === 0) {
                if (caller.health !== callerHp) turns[turns.length - 1].logs.push(`:skull:${victimUsername} somehow dodged...`);
                Util.isNPC(victim) ? victim.skill_points.perception = oldVictim : victim.spb.perception = oldVictim
                Util.isNPC(caller) ? caller.skill_points.perception = oldCaller : caller.spb.perception = oldCaller
                console.log('escape plan finished');
            }
        });
        promises.push(func);

    }

}

export const Assimilation: Ability = {
    name: 'Assimilation',
    description: 'Assimilate your enemy, dealing some damages, and stealing some of their health',
    cooldown: 3,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 10,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 3,
        };
        turns[turns.length - 1].logs.push(`:yellow_circle:  **${victimUsername}** is stunned. :yellow_circle: `);
        gameOptions.invincible = true;
        turns[turns.length - 1].lastMove = "attack";

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            gameOptions.trns--;
            if (gameOptions[tsID].cd === 0) {
                gameOptions.invincible = false;
                gameOptions.trns--;
                turns[turns.length - 1].logs.push(`:yellow_circle: **${victimUsername}** is no longer stunned. :yellow_circle: `);
            }
        });
        if (gameOptions.opponentNPC === caller.id) {
            for (let i = 0; i < gameOptions[tsID].cd; i++) {
                gameOptions.NPCAttack(true);
            }
            turns[turns.length - 1].logs.push(`:yellow_circle: **${victimUsername}** is no longer stunned. :yellow_circle: `);
        } else promises.push(func);
    }

}

export const Sheer_Heart_Attack: Ability = {
    name: 'Sheer Heart Attack',
    description: "Makes a creature appear that can only be seen by you. It will stay on your opponent's shoulder and do damage for 5 turns. After the 5th turn, the creature will self-destruct. During these 5 turns, you can't use any of your stand's abilities",
    cooldown: 10,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 20,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 5,
        };
        const damage = Math.round(Util.calcAbilityDMG(Stand_Barrage, caller) / 3);

        turns[turns.length - 1].logs.push(`> <:sheer:1028643880473743390> SHEER HEART ATTACK: ON`);
        turns[turns.length - 1].lastMove = "attack";
        gameOptions.stopCooldown.push(caller.id);
        gameOptions.cooldowns.forEach((c: any) => {
            if (c.id === caller.id) c.cd += 1;
        });

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            victim.health -= damage;
            turns[turns.length - 1].logs.push(`> <:sheer:1028643880473743390> SHEER HEART ATTACK: -${damage} HP`);

            if (gameOptions[tsID].cd === 0) {
                gameOptions.cooldowns.forEach((c: any) => {
                    if (c.id === caller.id) c.cd -= 1;
                });
                gameOptions.stopCooldown.splice(gameOptions.stopCooldown.indexOf(caller.id), 1);
                victim.health -= Math.round(damage * 3);
                turns[turns.length - 1].logs.push(`> <:sheer:1028643880473743390> SHEER HEART ATTACK: AUTO-DESTRUCTION :explosion: (-${Math.round(damage * 3)} HP)`);
            }
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`> <:sheer:1028643880473743390> SHEER HEART ATTACK: JOB'S DONE.`);
            }
        });
        promises.push(func);

    }
}


export const Wall: Ability = {
    name: 'Wall',
    description: 'Reform the ground into a wall, guaranteeing their attack will miss.',
    cooldown: 0,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 15,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const tsID = Util.generateID();
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        gameOptions[tsID] = {
            cd: 2,
        };
        const damage = Math.round(Util.calcATKDMG(victim) / 3);

        turns[turns.length - 1].logs.push(`🧱 ${callerUsername} reformed the ground into a WALL. 🧱`);
        const oldVictim = Util.isNPC(victim) ? victim.skill_points.perception : victim.spb.perception
        const oldCaller = Util.isNPC(caller) ? caller.skill_points.perception : caller.spb.perception

        Util.isNPC(victim) ? victim.skill_points.perception = -696969 : victim.spb.perception = -696969
        Util.isNPC(caller) ? caller.skill_points.perception = -696969 : caller.spb.perception = -696969
        const callerHp = caller.health;


        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;

            if (gameOptions[tsID].cd === 0) {
                if (caller.health !== callerHp) turns[turns.length - 1].logs.push(`:skull:${victimUsername} somehow dodged...`);
                Util.isNPC(victim) ? victim.skill_points.perception = oldVictim : victim.spb.perception = oldVictim
                Util.isNPC(caller) ? caller.skill_points.perception = oldCaller : caller.spb.perception = oldCaller
                        // @ts-ignore
                console.log(victim.spb, caller.spb)
            }
        });
        promises.push(func);

    }

}

export const Bearing_Shot: Ability = {
    name: 'Bearing Shot',
    description: 'Through a bearing at incredibly high speeds and regenerates 9% of your hp (even if you miss).',
    cooldown: 0,
    damages: 25,
    heal: '9%',
    blockable: false,
    dodgeable: true,
    stamina: 15
}


export const YO_Angelo: Ability = {
    name: 'YO Angelo',
    description: 'secret ability. use it and SEE....',
    cooldown: 0,
    damages: 0,
    blockable: false,
    dodgeable: true,
    stamina: 20,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 4,
        };
        turns[turns.length - 1].logs.push(`🪨🪨🪨 YO ANGELO! ${victimUsername} has been transformed into a rock for 4 TURNS🪨🪨🪨 :joy: rip bozo. take this L 🪨🪨🪨`);

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            gameOptions.trns--;
            gameOptions.invincible = true;
            if (gameOptions[tsID].cd === 0) {
                gameOptions.invincible = false;
                gameOptions.trns--;
                turns[turns.length - 1].logs.push(`🪨🪨 **${victimUsername}** is back🪨🪨`);
            }
        });
        if (gameOptions.opponentNPC === caller.id) {
            for (let i = 0; i < gameOptions[tsID].cd; i++) {
                gameOptions.NPCAttack(true);
            }
            turns[turns.length - 1].logs.push(`🪨🪨 :gun::x: **${victimUsername}** is back🪨🪨`);
        } else promises.push(func);
    }
}

export const Dino_Virus_Bite: Ability = {
    name: 'Dino Virus Bite',
    description: 'Bites your enemy, turning them into a dinosaur, and rendering their abilities useless for 2 turns.',
    cooldown: 0,
    damages: 15,
    blockable: false,
    dodgeable: false,
    stamina: 15,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const victimStand = victim.stand;
        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 7,
        };

        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            if (gameOptions[tsID].cd === 0) {
                turns[turns.length - 1].logs.push(`:x:${Emojis.scary_monsters} \`${victimUsername}\` is no longoarrrrrrr a dinosoarrrrr :sob:  :x:${Emojis.scary_monsters}`);
                victim.stand = victimStand;
            }
        });

        if (victimStand) {
            turns[turns.length - 1].logs.push(`${Emojis.scary_monsters} \`${victimUsername}\` is now a DINOSAURRRRRRRRRRRRRRRRRR! ${Emojis.scary_monsters}`);
            victim.stand = null;
            promises.push(func);
        } else {
            turns[turns.length - 1].logs.push(`${victimUsername} doesn't have a stand.. you fool lol you just wasted your stamina. HOW CAN YOU BE SO DUMB MAN LMAO SMH CANT BE ME`);
        }

    },
}

export const Several_Minor_Scratches: Ability = {
    ...Stand_Barrage,
    name: "Several Minor Scratches",
}
/*
export const Dino_Morph: Ability = {

}*/