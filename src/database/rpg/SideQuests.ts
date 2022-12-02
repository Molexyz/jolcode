import type { SideQuest } from "../../@types";
import * as Quests from "./Quests";

export const Anniversary_Event_2022: SideQuest = {
    id: "event:anniversary_2022",
    i18n: "ANNIVERSARY_EVENT_2022",
    quests: [
        Quests.ClaimDaily(10)
    ],
    emoji: "🎉",
    rewards: {
        money: 100000,
        xp: '20%',
    }
};
    
