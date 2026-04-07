//Seeder genrate by IA to have a maximum of data for the tests and the demo. 
//It creates 2 admins, 6 members (1 deleted) and 7 attractions (1 demo). 
//It also creates reservations for each member to test pagination, 
//filtering and sorting in the admin panel. 
//The passwords are hashed with argon2 for security. 
//The seeding process is idempotent, so it can be run multiple times without creating duplicates.

import { Role, Intensity, Status } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import * as argon2 from 'argon2';

async function main() {
    console.log('🌱 Seeding database...');

    // -------------------------------------------------------------------------
    // PASSWORDS
    // -------------------------------------------------------------------------
    const adminPassword = await argon2.hash('Admin123!')
    const vertPassword = await argon2.hash('Vert123!')
    const bleuPassword = await argon2.hash('Bleu123!')
    const rougePassword = await argon2.hash('Rouge123!')
    const jaunePassword = await argon2.hash('Jaune123!')
    const noirPassword = await argon2.hash('Noir123!')
    const violetPassword = await argon2.hash('Violet123!')

    // -------------------------------------------------------------------------
    // USERS
    // -------------------------------------------------------------------------
    await prisma.user.createMany({
        data: [
            // Admins
            {
                email: 'john.doe@example.com',
                firstname: 'John',
                lastname: 'Doe',
                password: adminPassword,
                role: Role.ADMIN,
            },
            {
                email: 'jane.smith@example.com',
                firstname: 'Jane',
                lastname: 'Smith',
                password: adminPassword,
                role: Role.ADMIN,
            },
            // Membres actifs
            {
                email: 'zombievert@example.com',
                firstname: 'Zombie',
                lastname: 'Vert',
                password: vertPassword,
                role: Role.MEMBER,
            },
            {
                email: 'zombiebleu@example.com',
                firstname: 'Zombie',
                lastname: 'Bleu',
                password: bleuPassword,
                role: Role.MEMBER,
            },
            {
                email: 'zombierouge@example.com',
                firstname: 'Zombie',
                lastname: 'Rouge',
                password: rougePassword,
                role: Role.MEMBER,
            },
            {
                email: 'zombiejaune@example.com',
                firstname: 'Zombie',
                lastname: 'Jaune',
                password: jaunePassword,
                role: Role.MEMBER,
            },
            {
                email: 'zombienoir@example.com',
                firstname: 'Zombie',
                lastname: 'Noir',
                password: noirPassword,
                role: Role.MEMBER,
            },
            // Membre supprimé
            {
                email: 'zombieviolet@example.com',
                firstname: 'Zombie',
                lastname: 'Violet',
                password: violetPassword,
                role: Role.MEMBER,
                deleted_at: new Date('2025-03-01'),
            },
        ],
        skipDuplicates: true
    });

    const admin1 = await prisma.user.findUnique({ where: { email: 'john.doe@example.com' } })
    const admin2 = await prisma.user.findUnique({ where: { email: 'jane.smith@example.com' } })
    const vert = await prisma.user.findUnique({ where: { email: 'zombievert@example.com' } })
    const bleu = await prisma.user.findUnique({ where: { email: 'zombiebleu@example.com' } })
    const rouge = await prisma.user.findUnique({ where: { email: 'zombierouge@example.com' } })
    const jaune = await prisma.user.findUnique({ where: { email: 'zombiejaune@example.com' } })
    const noir = await prisma.user.findUnique({ where: { email: 'zombienoir@example.com' } })
    const violet = await prisma.user.findUnique({ where: { email: 'zombieviolet@example.com' } })

    if (!admin1 || !admin2 || !vert || !bleu || !rouge || !jaune || !noir || !violet) {
        throw new Error("Erreur : les utilisateurs n'ont pas été créés")
    }

    // -------------------------------------------------------------------------
    // TICKET — un seul tarif pour le MVP
    // -------------------------------------------------------------------------
    const existingTicket = await prisma.ticket.findFirst()
    const ticket = existingTicket ?? await prisma.ticket.create({
        data: {
            label: 'Billet Journée',
            amount: 25.00,
            description: 'Accès illimité aux attractions pendant une journée',
        },
    })

    // -------------------------------------------------------------------------
    // CATEGORIES
    // -------------------------------------------------------------------------
    const catThrill = await prisma.category.upsert({
        where: { id_CATEGORY: 1 },
        update: {},
        create: { name: 'Sensations fortes' }
    })
    const catFamily = await prisma.category.upsert({
        where: { id_CATEGORY: 2 },
        update: {},
        create: { name: 'Famille' }
    })
    const catImmersive = await prisma.category.upsert({
        where: { id_CATEGORY: 3 },
        update: {},
        create: { name: 'Immersif' }
    })

    // -------------------------------------------------------------------------
    // ATTRACTIONS — 6 principales + 1 démo (à modifier/supprimer)
    // -------------------------------------------------------------------------
    const attractionsData = [
        {
            name: 'Zone de quarantaine',
            description: "Bienvenue dans la dernière ligne de défense… ou ce qu'il en reste. Autrefois sécurisée, cette zone servait à contenir les premiers infectés. Aujourd'hui, les barrières sont brisées et les protocoles ont été abandonnés dans la panique. Les lumières vacillent, des messages de détresse résonnent encore, et quelque chose rôde entre les anciens sas de décontamination. Ici, chaque bruit peut vous trahir. Avancez lentement… car survivre est une question de discrétion.",
            min_height: 0, duration: 15, capacity: 100, intensity: Intensity.LOW,
        },
        {
            name: 'Ride de la Biomasse',
            description: "Entrez dans le cœur d'une expérience qui n'aurait jamais dû exister. Dans ce laboratoire abandonné, la matière vivante a muté au-delà de toute compréhension. Chair, métal et organismes inconnus se sont fusionnés en une entité instable et vivante. Les parois semblent respirer, les sols vibrent sous vos pieds… et certaines masses bougent encore. Vous ne traversez pas un lieu. Vous êtes à l'intérieur d'un organisme. Et il vous a déjà repéré.",
            min_height: 120, duration: 30, capacity: 20, intensity: Intensity.HIGH,
        },
        {
            name: "L'Allée Brisée",
            description: "Autrefois lieu de vie et d'échanges, cette allée marchande est aujourd'hui figée dans le chaos. Les étals renversés, les lumières clignotantes et les traces de fuite témoignent d'une évacuation brutale. Mais certains n'ont jamais quitté les lieux… Dans les ombres, des silhouettes se confondent avec le décor avant de surgir sans prévenir. Ici, le danger est partout… et surtout là où vous ne regardez pas.",
            min_height: 0, duration: 60, capacity: 200, intensity: Intensity.LOW,
        },
        {
            name: 'Grand Huit',
            description: "Accrochez-vous… ce manège n'a jamais été arrêté. Ce grand huit délabré continue de fonctionner dans un vacarme métallique inquiétant. À chaque montée, une présence se rapproche. À chaque descente, quelque chose vous poursuit. Entre vitesse extrême, obscurité totale et apparitions soudaines, vous perdez tout contrôle. Une seule certitude : ce ne sont pas les rails qui vous feront le plus peur.",
            min_height: 140, duration: 10, capacity: 24, intensity: Intensity.HIGH,
        },
        {
            name: 'Vaisseau Écho',
            description: "Explorez la carcasse fumante d'un vaisseau spatial écrasé en bordure de forêt. Cette maison hantée technologique vous force à ramper dans des couloirs de métal déchiré où pendent des câbles comme des entrailles. Entre brume glaciale et émanations toxiques vertes, affrontez l'ancien équipage muté par les radiations. Une expérience de claustrophobie absolue.",
            min_height: 120, duration: 40, capacity: 12, intensity: Intensity.HIGH,
        },
        {
            name: 'Le Labyrinthe des Hautes Herbes',
            description: "Une \"Chasse à l'Homme\" grandeur nature dans une zone de quarantaine délaissée. Perdez-vous dans un dédale de roseaux secs et de métal rouillé suintant de biomasse radioactive. Mais attention : vous n'êtes pas seul. Des rôdeurs affamés se cachent dans l'épaisseur des herbes pour vous traquer. Un seul conseil de survie : ne vous arrêtez jamais de courir.",
            min_height: 0, duration: 45, capacity: 80, intensity: Intensity.MEDIUM,
        },
        {
            name: 'Le Grand Cirque Macabre',
            description: "Sous ce chapiteau délabré, l'émerveillement a laissé place à l'horreur pure. Assistez à un spectacle immersif où acrobates et clowns morts-vivants exécutent des numéros de magie noire et des cascades suicidaires. Entre rires hystériques et cris de terreur, cette représentation vous plongera dans une atmosphère oppressante de foire abandonnée. Les spectateurs sont avertis : ici, les artistes ont très faim.",
            min_height: 0, duration: 60, capacity: 150, intensity: Intensity.MEDIUM,
        },
        {
            name: 'La fosse aux cadavres',
            description: "Respirez profondément… l'odeur ne vous quittera plus. Cette fosse a été creusée pour contenir les victimes de l'épidémie. Mais les corps n'y sont jamais restés immobiles bien longtemps. Le sol est instable, des silhouettes s'agitent sous vos pieds, et certaines mains émergent encore pour vous agripper. Chaque pas est un risque. Chaque mouvement attire leur attention. Ici, les morts ne dorment jamais vraiment.",
            min_height: 130, duration: 20, capacity: 30, intensity: Intensity.MEDIUM,
        },
        {
            name: 'Le Centre de Recherche',
            description: "Tout a commencé ici. Ce centre scientifique est à l'origine de l'épidémie qui a ravagé le monde. Les chercheurs ont tenté de contrôler l'incontrôlable… et ont disparu dans le processus. Les écrans affichent encore des données incohérentes, les expériences sont restées actives, et certaines créatures errent toujours dans les laboratoires. Vous allez découvrir la vérité. Mais certaines vérités devraient rester enterrées.",
            min_height: 120, duration: 45, capacity: 15, intensity: Intensity.MEDIUM,
        },
        // Attraction démo — à modifier/supprimer pendant la soutenance
        {
            name: 'Le Couloir Oublié',
            description: "Une attraction mystérieuse dont personne ne connaît vraiment l'histoire. Idéale pour une démonstration de modification ou suppression.",
            min_height: 0, duration: 20, capacity: 50, intensity: Intensity.LOW,
        },
    ]

    const attractions = []
    for (const data of attractionsData) {
        const existing = await prisma.attraction.findFirst({ where: { name: data.name } })
        if (!existing) {
            const a = await prisma.attraction.create({ data })
            attractions.push(a)
        } else {
            attractions.push(existing)
        }
    }

    const [quarantaine, biomasse, allee, grand8, fosse, labo, couloir, vaisseau, labyrinthe, cirque] = attractions

    // Categories associations
    await prisma.attractionCategory.createMany({
        data: [
            { id_ATTRACTION: quarantaine.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
            { id_ATTRACTION: biomasse.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: biomasse.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
            { id_ATTRACTION: allee.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
            { id_ATTRACTION: grand8.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: fosse.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: fosse.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
            { id_ATTRACTION: labo.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
            { id_ATTRACTION: couloir.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
            { id_ATTRACTION: vaisseau.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: vaisseau.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
            { id_ATTRACTION: labyrinthe.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: cirque.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
            { id_ATTRACTION: cirque.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
        ],
        skipDuplicates: true
    })

    // -------------------------------------------------------------------------
    // RESERVATIONS
    // Tarif 25€ — total = nb_tickets * 25
    // -------------------------------------------------------------------------
    const PRICE = 25

    await prisma.reservation.createMany({
        data: [
            // --- Zombie Vert — beaucoup de réservations pour la pagination
            { nb_tickets: 2, date: new Date('2025-01-10'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 1, date: new Date('2025-01-25'), total_amount: 1 * PRICE, status: Status.CANCELLED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 3, date: new Date('2025-02-14'), total_amount: 3 * PRICE, status: Status.CONFIRMED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 2, date: new Date('2025-03-05'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 4, date: new Date('2025-04-20'), total_amount: 4 * PRICE, status: Status.CANCELLED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 1, date: new Date('2025-05-01'), total_amount: 1 * PRICE, status: Status.CONFIRMED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 2, date: new Date('2025-06-15'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 3, date: new Date('2026-05-10'), total_amount: 3 * PRICE, status: Status.CONFIRMED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 1, date: new Date('2026-06-20'), total_amount: 1 * PRICE, status: Status.CONFIRMED, id_USER: vert.id_USER, id_TICKET: ticket.id_TICKET },

            // --- Zombie Bleu — mix passé/futur
            { nb_tickets: 2, date: new Date('2025-03-12'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: bleu.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 1, date: new Date('2025-06-01'), total_amount: 1 * PRICE, status: Status.CANCELLED, id_USER: bleu.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 5, date: new Date('2026-04-15'), total_amount: 5 * PRICE, status: Status.CONFIRMED, id_USER: bleu.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 2, date: new Date('2026-07-04'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: bleu.id_USER, id_TICKET: ticket.id_TICKET },

            // --- Zombie Rouge
            { nb_tickets: 3, date: new Date('2025-02-20'), total_amount: 3 * PRICE, status: Status.CONFIRMED, id_USER: rouge.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 2, date: new Date('2025-07-10'), total_amount: 2 * PRICE, status: Status.CANCELLED, id_USER: rouge.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 1, date: new Date('2026-05-22'), total_amount: 1 * PRICE, status: Status.CONFIRMED, id_USER: rouge.id_USER, id_TICKET: ticket.id_TICKET },

            // --- Zombie Jaune
            { nb_tickets: 4, date: new Date('2025-04-05'), total_amount: 4 * PRICE, status: Status.CONFIRMED, id_USER: jaune.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 2, date: new Date('2025-09-18'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: jaune.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 3, date: new Date('2026-08-30'), total_amount: 3 * PRICE, status: Status.CONFIRMED, id_USER: jaune.id_USER, id_TICKET: ticket.id_TICKET },

            // --- Zombie Noir
            { nb_tickets: 1, date: new Date('2025-05-15'), total_amount: 1 * PRICE, status: Status.CANCELLED, id_USER: noir.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 2, date: new Date('2025-11-11'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: noir.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 6, date: new Date('2026-09-05'), total_amount: 6 * PRICE, status: Status.CONFIRMED, id_USER: noir.id_USER, id_TICKET: ticket.id_TICKET },

            // --- Zombie Violet (compte supprimé) — réservations orphelines
            { nb_tickets: 2, date: new Date('2025-01-20'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: violet.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 1, date: new Date('2025-02-28'), total_amount: 1 * PRICE, status: Status.CANCELLED, id_USER: violet.id_USER, id_TICKET: ticket.id_TICKET },

            // --- Admin John — quelques réservations
            { nb_tickets: 2, date: new Date('2025-06-15'), total_amount: 2 * PRICE, status: Status.CONFIRMED, id_USER: admin1.id_USER, id_TICKET: ticket.id_TICKET },
            { nb_tickets: 1, date: new Date('2026-10-31'), total_amount: 1 * PRICE, status: Status.CONFIRMED, id_USER: admin1.id_USER, id_TICKET: ticket.id_TICKET },
        ],
        skipDuplicates: true
    })

    // -------------------------------------------------------------------------
    // SETTINGS
    // -------------------------------------------------------------------------
    await prisma.setting.upsert({
        where: { key: 'max_tickets_per_day' },
        update: {},
        create: {
            key: 'max_tickets_per_day',
            value: '100'
        }
    })

    console.log('✅ Seed terminé avec succès !');
    console.log('👤 Admins    : john.doe@example.com / jane.smith@example.com — Admin123!')
    console.log('👥 Membres   : zombievert/bleu/rouge/jaune/noir@example.com — Couleur123!')
    console.log('💀 Supprimé  : zombieviolet@example.com — Violet123!')
    console.log('🎟️  Tarif     : 25€ / billet')
    console.log('🎡 Attractions: 6 principales + 1 démo (Le Couloir Oublié)')
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });