import type { Chapter } from '../../@types';
import * as Quests from './Quests';
import * as NPCs from './NPCs';
import * as Items from './Items';
import * as Mails from './Mails';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';

export const C1: Chapter = {
    id: 1,
    description: {
        'en-US': "You live an ordinary life until you are 15 years old. It's your first day in high school, you're on your way home from school and you see an old classmate. It's Kakyoin ! You greet him but but he runs into you and attacks you. It appears he's being manipulated.\n\nP.S: He's a stand user...",
        'fr-FR': "Vous vivez une vie ordinaire jusqu'à l'âge de 15 ans. C'est votre premier jour au lycée, vous rentrez de l'école et vous croisez un ancien camarade de classe. C'est Kakyoin ! Il te fonce dessus et t'attaque. Il semble qu'il soit un utilisateur de stand...",
        'es-ES': "Vives una vida normal hasta que tengas 15 años. Es tu primer día en la escuela, estás en tu camino hacia casa y ves un vecino. Es Kakyoin ! Te saluda pero se te pega y te ataca. Aparece que está siendo manipulado.\n\nP.S: Es un usuario de stand...",
        'de-DE': "Du lebst eine normallebende Geschichte bis du 15 Jahre alt bist. Es ist dein erster Tag in der Schule, du gehst zu Hause und siehst einen alten Kurskameraden. Er ist Kakyoin ! Du begrüßt ihn aber erst, wenn er dich angreift. Er scheint manipuliert zu sein.\n\nP.S: Er ist ein Stand-Benutzer..."
    },
    title: {
        'en-US': "Prologue",
        'fr-FR': "Prologue",
        'es-ES': "Prologue",
        'de-DE': "Prologue"
    },
    tips: {
        'en-US': ["You may need the `/loot` command until you collect an amout of coins in order to complete some of your quests"],
        'fr-FR': ["Tu peux avoir besoin de la commande `/loot` jusqu'à ce que tu as collecté un certain nombre de pièces dans le but de compléter certaines de tes quêtes"],
        'es-ES': ["Puedes necesitar la `/loot` hasta que recolectes una cantidad determinada de monedas para completar algunas de tus misiones"],
        'de-DE': ["Du kannst das `/loot`-Kommando benutzen, bis du eine bestimmte Anzahl an Münzen sammeln kannst, um einige deiner Aufgaben zu erfüllen"]
    },
    quests: [
        Quests.Defeat(NPCs.Kakyoin),
        Quests.ClaimCoins(3500),
        Quests.Awaken_Stand,
        Quests.ClaimDaily(1)
    ]

};

export const C2: Chapter = {
    id: 2,
    description: {
        'en-US': 'You finally beat Kakyoin. You notice a strange creature on his head, you conclude that it is because of this creature that he is manipulated. On his back, you also find some yellow hairs...',
        'fr-FR': 'Tu as vaincu Kakyoin. Tu remarques une créature étrange sur sa tête, tu conclues que c\'est parce que cette créature qu\'il est manipulé. Sur son dos, tu trouves aussi des poils jaune...',
        'es-ES': 'Has derrotado a Kakyoin. Te notas una criatura extraña en su cabeza, concluyes que es por esta criatura que él es manipulado. En su espalda, también encontrás algunos pelos amarillos...',
        'de-DE': 'Du hast Kakyoin besiegt. Du siehst ein seltsames Wesen auf seinem Kopf, du weisst, dass es durch dieses Wesen ist manipuliert. Auf seinem Rücken, auch auf seinen Hüften, du findest auch einige gelbe Haare...'
    },
    title: {
        'en-US': 'The beginning',
        'fr-FR': 'Le début',
        'es-ES': 'El principio',
        'de-DE': 'Der Anfang'
    },
    mails: [
        Mails.P1C1_GP
    ],
    items: [
        Items.Yellow_Hair,
        Items.Mysterious_Arrow
    ],
    tips: {
        'en-US': 'You may need the `/action` command in order to complete some of your quests',
        'fr-FR': 'Tu peux avoir besoin de la commande `/action` pour compléter certaines de tes quêtes',
        'es-ES': 'Puedes necesitar la `/action` para completar algunas de tus misiones',
        'de-DE': 'Du kannst das `/action`-Kommando benutzen, um einige deiner Aufgaben zu erfüllen'
    },
    quests: [
        Quests.Remove_Thing_Kakyoin,
        Quests.Analyse_Hair,
        Quests.ClaimDaily(1)
    ]
}

export const C3_P1: Chapter = {
    id: 3,
    description: {
        'en-US': 'Kakyoin tells you that he has been manipulated by a certain Dio and asks you if you could stop Dio. You accept and you have the mission to contact your grandfather about Dio...',
        'fr-FR': 'Kakyoin t\'informe que il a été manipulé par un certain Dio et demande que tu l\'arrêtes. Tu acceptes et tu as la mission de contacter ton grand-père sur Dio...',
        'es-ES': 'Kakyoin te dice que ha sido manipulado por un cierto Dio y te pide que te detengas. Aceptas y tienes la misión de contactar a tu abuelo sobre Dio...',
        'de-DE': 'Kakyoin te informiert, dass er manipuliert wurde von einem bestimmten Dio und fragt dich, ob du ihn stoppen könntest. Du akzeptierst und hast die Mission, deinen Väter zu kontaktieren über Dio...'
    },
    title: {
        'en-US': 'A bizarre journey',
        'fr-FR': 'Un voyage bizarre',
        'es-ES': 'Un viaje extraño',
        'de-DE': 'Ein seltsamer Reise'
    },
    items: [
        Items.Mysterious_Arrow,
        Items.Mysterious_Arrow,
        Items.Mysterious_Arrow
    ],
    quests: [
        Quests.Tell_Your_Grandfather_About_DIO
    ],
    tips: {
        'en-US': 'You may need the `/action` command in order to complete some of your quests',
        'fr-FR': 'Tu peux avoir besoin de la commande `/action` pour compléter certaines de tes quêtes',
        'es-ES': 'Puedes necesitar la `/action` para completar algunas de tus misiones',
        'de-DE': 'Du kannst das `/action`-Kommando benutzen, um einige deiner Aufgaben zu erfüllen'
    },
}

export const C3_P2: Chapter = {
    id: 4,
    description: {
        'en-US': 'You enter the airport and meet Mohammed Avdol. You also saw your grandfather and your friend Kakyoin again. Unfortunately, it seems that your grandfather has sexually assaulted someone. The guards are after your grandfather and you have to finish them.',
        'fr-FR': 'Tu entre dans l\'aéroport et rencontres Mohammed Avdol. Tu aussi rencontres ton grand-père et ton ami Kakyoin. Malheureusement, il semble que ton grand-père a été violé par quelqu\'un. Les gardes sont après ton grand-père et tu dois les finir.',
        'es-ES': 'Entras en el aeropuerto y encuentras Mohammed Avdol. También has visto tu abuelo y tu amigo Kakyoin de nuevo. Desafortunadamente, parece que tu abuelo ha sido violado sexualmente. Los guardias están buscando a tu abuelo y tienes que terminarlos.',
        'de-DE': 'Du kommst in den Flugplatz und treffst Mohammed Avdol. Du hast auch nochmal deinen Väter und deinen Freund Kakyoin gesehen. Leider scheint, dass dein Väter geschlechtlich geschlagen wurde. Die Wächter sind nach deinem Väter gefolgt und du musst sie beenden.'
    },
    title: C3_P1.title,
    items: [
        Items.Mysterious_Arrow,
        Items.Mysterious_Arrow
    ],
    quests: [
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.Defeat(NPCs.Security_Guard),
        Quests.ClaimCoins(20000),
        Quests.ClaimDaily(1),
        Quests.Assault(10),
        Quests.UseLoot(5)
    ],
    dialogues: {
        'en-US': [
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephHMM) + " Yo my gran- YO what the hell is it really you?????? Anyway, this is my friend, Mohammed Avdol. He's a stand handler, like us.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Hello {{userName}}, glad to meet you",
            Util.makeNPCString(NPCs.Kakyoin) + " Yooooo {{userName}}, glad to see that you're fine",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " Anyways so first of all, i'm going to tell you who Dio is really.",
            "\nDio is just a motherf*cker.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Indeed.",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " ok so-",
            Util.makeNPCString(NPCs.Lisa) + " IT'S HIM! HE'S THE ONE WHO TOUCHED MY ASS! STOP THIS PERVERT !!!1!1!11!",
            Util.makeNPCString(NPCs.Security_Guard) + " OK, GOT IT. Wait, it's you ? What the fuck are you doing here?",
            Util.makeNPCString(NPCs.Harry_Lester) + " NOOOOO ! *runs*   BEAT THESE GUARDS PLZ, SEE YA LATER IN THE PLANE **F-6969**"
        ],
        'fr-FR': [
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephHMM) + " Yo my gran- YO what the hell is it really you?????? Anyway, this is my friend, Mohammed Avdol. He's a stand handler, like us.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Hello {{userName}}, glad to meet you",
            Util.makeNPCString(NPCs.Kakyoin) + " Yooooo {{userName}}, glad to see that you're fine",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " Anyways so first of all, i'm going to tell you who Dio is really.",
            "\nDio is just a motherf*cker.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Indeed.",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " ok so-",
            Util.makeNPCString(NPCs.Lisa) + " IT'S HIM! HE'S THE ONE WHO TOUCHED MY ASS! STOP THIS PERVERT !!!1!1!11!",
            Util.makeNPCString(NPCs.Security_Guard) + " OK, GOT IT. Wait, it's you ? What the fuck are you doing here?",
            Util.makeNPCString(NPCs.Harry_Lester) + " NOOOOO ! *runs*   BEAT THESE GUARDS PLZ, SEE YA LATER IN THE PLANE **F-6969**"
        ],  
        'es-ES': [
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephHMM) + " Yo my gran- YO what the hell is it really you?????? Anyway, this is my friend, Mohammed Avdol. He's a stand handler, like us.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Hello {{userName}}, glad to meet you",
            Util.makeNPCString(NPCs.Kakyoin) + " Yooooo {{userName}}, glad to see that you're fine",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " Anyways so first of all, i'm going to tell you who Dio is really.",
            "\nDio is just a motherf*cker.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Indeed.",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " ok so-",
            Util.makeNPCString(NPCs.Lisa) + " IT'S HIM! HE'S THE ONE WHO TOUCHED MY ASS! STOP THIS PERVERT !!!1!1!11!",
            Util.makeNPCString(NPCs.Security_Guard) + " OK, GOT IT. Wait, it's you ? What the fuck are you doing here?",
            Util.makeNPCString(NPCs.Harry_Lester) + " NOOOOO ! *runs*   BEAT THESE GUARDS PLZ, SEE YA LATER IN THE PLANE **F-6969**"
        ],  
        'de-DE': [
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephHMM) + " Yo my gran- YO what the hell is it really you?????? Anyway, this is my friend, Mohammed Avdol. He's a stand handler, like us.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Hello {{userName}}, glad to meet you",
            Util.makeNPCString(NPCs.Kakyoin) + " Yooooo {{userName}}, glad to see that you're fine",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " Anyways so first of all, i'm going to tell you who Dio is really.",
            "\nDio is just a motherf*cker.",
            Util.makeNPCString(NPCs.Mohammed_Avdol) + " Indeed.",
            Util.makeNPCString(NPCs.Harry_Lester, Emojis.josephChad) + " ok so-",
            Util.makeNPCString(NPCs.Lisa) + " IT'S HIM! HE'S THE ONE WHO TOUCHED MY ASS! STOP THIS PERVERT !!!1!1!11!",
            Util.makeNPCString(NPCs.Security_Guard) + " OK, GOT IT. Wait, it's you ? What the fuck are you doing here?",
            Util.makeNPCString(NPCs.Harry_Lester) + " NOOOOO ! *runs*   BEAT THESE GUARDS PLZ, SEE YA LATER IN THE PLANE **F-6969**"
        ],    
    },
    parent: C3_P1,
}

export const C3_P3: Chapter = {
    id: 5,
    description: {
        'en-US': "As you and your recently acquired friends continue their journey, you are attacked by yet another stand user. The swordsman challenges you, after he managed to beat your friends. He says that if you win, he won't kill them.",
        'fr-FR': "Comme vous et vos amis continuez votre voyage, vous êtes attaqué par un autre utilisateur de stand. Le combattant vous défie, après qu'il ait réussi à battre vos amis. Il dit que si vous gagnez, il ne les tuera pas.",
        'es-ES': "Como vos y vuestos amigos continuan su viaje, vos atacan por un usuario de stand. El espadachín te reta, tras que haya podido derrotar a tus amigos. Dice que si ganas, no los matará.",
        'de-DE': "Als Sie und Ihre kürzlich erwerbten Freunde Ihre Reise fortsetzen, werden Sie von einem anderen Stand-Benutzer angegriffen. Der Schwerhiebige wirft Sie auf, nachdem er sie Ihren Freunden besiegt hat. Er sagt, wenn Sie gewinnen, wird er sie nicht töten.",
    },
    title: C3_P1.title,
    quests: [
        Quests.Defeat(NPCs.Polnareff),
        Quests.Assault(10),
        Quests.UseLoot(5),
        Quests.ClaimCoins(30000)
    ],
    parent: C3_P1
}

export const C3_P4: Chapter = {
    id: 6,
    description: {
        'en-US': "After defeating Polnareff, you return to the hotel you were staying in with him, you realize that Devo is in a refrigerator. You think he is easily defeated, you don't remember him anymore. Later, you are attacked by a stand, you lose your precision because of lack of vision on the stand user, you try to defeat him.",
        'fr-FR': "Après avoir battu Polnareff, vous vous rendez dans un hôtel en le portant, vous vous rendez compte d'un utilisateur de stand, Devo, se trouvant dans un réfrigérateur. Vous pensez qu'il est défaitez facilement, vous ne vous en souviens plus. Plus tard, vous êtes attaqué, par un stand, vous perdez votre précision à cause de manque de vision sur l'utilisateur de stand, vous essayez de l'affronter.",
        'es-ES': "Después de derrotar Polnareff, vuelves a la casa que estabas en con él, te das cuenta de que Devo está en un refrigerador. Piensas que es facilmente derrotado, no te lo recordas más. Más tarde, te atacan por un stand, perdes tu precisión por falta de vision en el usuario de stand, intentas derrotarlo.",
        'de-DE': "Nachdem Sie Polnareff besiegt haben, kehren Sie zurück in das Hotel, in dem Sie ihn verbracht haben. Sie erinnern sich an Devo, der in einem Kühlschrank ist. Sie denken, dass er leicht besiegt wird, Sie werden ihn nicht mehr erinnern. Später werden Sie von einem Stand-Benutzer angegriffen, Sie verlieren Ihre Genauigkeit aufgrund von einem fehlenden Sicht auf den Benutzer, Sie versuchen ihn zu besiegen.",
    },
    title: C3_P1.title,
    quests: [
        Quests.Remove_Fleshbud_Polnareff,
        Quests.Defeat(NPCs.Devo),
        Quests.UseLoot(10),
        Quests.Assault(5)
    ],
    tips: {
        'en-US': 'You may need the `/action` command in order to complete some of your quests',
        'fr-FR': 'Tu peux avoir besoin de la commande `/action` pour compléter certaines de tes quêtes',
        'es-ES': 'Puedes necesitar la `/action` para completar algunas de tus misiones',
        'de-DE': 'Du kannst das `/action`-Kommando benutzen, um einige deiner Aufgaben zu erfüllen'
    },
    parent: C3_P1
}

export const C3_P5: Chapter = {
    id: 7,
    description: {
        'en-US':"As you guys continue on your journey, beating a fake captain, and a monkey named Forever. You come to discover that Kakyoin is acting weird. It starts with him weirdly licking cherries. Soon after you learn it is an enemy stand user, with a flesh eating stand called Yellow Temperance",
        'fr-FR':"En continuant votre voyage, en battant un faux capitaine, et un singe nommé Forever. Vous découvrez que Kakyoin se comporte bizarrement. Ça commence avec lui léchant étrangement des cerises. Bientôt après, vous apprenez qu'il s'agit d'un utilisateur de stand ennemi, avec un stand mangeur de chair appelé Yellow Temperance",
        'es-ES':"Mientras continuas tu viaje, derrotando a un falso capitán, y un mono llamado Forever. Descubres que Kakyoin se comporta raro. Empieza con él lamiendo extrañamente cerezas. Pronto después, aprendes que es un usuario de stand enemigo, con un stand comedor de carne llamado Yellow Temperance",
        'de-DE':"Als Sie und Ihre Freunde Ihre Reise fortsetzen, schlagen Sie einen falschen Kapitän und einen Affen namens Forever. Sie entdecken, dass Kakyoin seltsam handelt. Es beginnt mit ihm seltsam Kirschen zu lecken. Bald darauf lernen Sie, dass es sich um einen Feind-Stand-Benutzer handelt, mit einem Fleischfresser-Stand namens Yellow Temperance",
    },
    title: C3_P1.title,
    quests: [
        Quests.Defeat(Util.AttributeChapterQuestToNPC(NPCs.Rubber_Soul, [Quests.Throw_Rubber_Soul_Body_To_The_Sea])),
        Quests.ClaimCoins(35_000),
        Quests.UseLoot(5),
        Quests.Assault(10)
    ],
    parent: C3_P1,
    tips: {
        'en-US': 'You may need the `/action` command in order to complete some of your quests',
        'fr-FR': 'Tu peux avoir besoin de la commande `/action` pour compléter certaines de tes quêtes',
        'es-ES': 'Puedes necesitar la `/action` para completar algunas de tus misiones',
        'de-DE': 'Du kannst das `/action`-Kommando benutzen, um einige deiner Aufgaben zu erfüllen'
    },
}
/*
export const C3_P6: Chapter = {
    id: 8,
    description: {
        'en-US': "After defeating Yellow Temperance, your group travels to India. Where you're attacked by a man named Hol Horse, and J. Geil's stand Hanged Man. You tried your best to help Avdol, but he sadly dies, by the stand Emperor. Now it is up to you to beat J. Geil, and his stand Hanged Man.",
        'fr-FR': "Après avoir battu Yellow Temperance, votre groupe voyage en Inde. Là, vous êtes attaqué par un homme nommé Hol Horse, et son stand Hanged Man. Vous avez essayé de le sauver, mais il est mort, par le stand Emperor. Maintenant, c'est à vous de battre J. Geil, et son stand Hanged man.",
        'es-ES': "Después de derrotar a Yellow Temperance, tu grupo viaja a India. Donde eres atacado por un hombre llamado Hol Horse, y el stand de J. Geil Hanged man. Intentas tu mejor esfuerzo para ayudar a Avdol, pero él muere, por el stand Emperor. Ahora es tu turno de derrotar a J. Geil, stand Hanged man.",
        'de-DE': "Nachdem Sie Yellow Temperance besiegt haben, reisen Sie mit Ihrer Gruppe nach Indien. Wo Sie von einem Mann namens Hol Horse und J. Geils Stand Hanged man. Sie haben Ihr Bestes versucht, um Avdol zu helfen, aber er stirbt leider, durch den Stand Emperor. Jetzt ist es an Ihnen, J. Geil und seinen Stand Hanged Man"
    },
    title: C3_P1.title,
    quests: [
        Quests.Defeat(NPCs.Beggar),
        Quests.Defeat(NPCs.Beggar),
        Quests.Defeat(NPCs.Beggar),
        Quests.Defeat(NPCs.Beggar),
        Quests.Defeat(NPCs.Beggar),
        //Quests.Defeat(NPCs.J_Geil),
    ],
    parent: C3_P1,
    tips: {
        'en-US': 'You may need the `/action` command in order to complete some of your quests',
        'fr-FR': 'Tu peux avoir besoin de la commande `/action` pour compléter certaines de tes quêtes',
        'es-ES': 'Puedes necesitar la `/action` para completar algunas de tus misiones',
        'de-DE': 'Du kannst das `/action`-Kommando benutzen, um einige deiner Aufgaben zu erfüllen'
    },
}
*/