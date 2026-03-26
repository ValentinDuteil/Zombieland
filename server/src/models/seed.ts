import { Role, Intensity, Status } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import * as argon2 from 'argon2';



async function main() {
    console.log('🌱 Seeding database...');

    const adminPassword = await argon2.hash('monMotDePasse')
    const memberPassword = await argon2.hash('monMotDePasse')
    // Create users if they don't exist yet
    // skipDuplicates: ignores entries that already exist in the database
    // without throwing an error (based on unique constraints
    await prisma.user.createMany({
        data: [
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
                password: memberPassword,
                role: Role.MEMBER,
            },
        ],
        skipDuplicates: true
    });

    const user1 = await prisma.user.findUnique({ where: { email: 'john.doe@example.com' } });
    const user2 = await prisma.user.findUnique({ where: { email: 'jane.smith@example.com' } });
    // Vérifier que les users existent avant de continuer
    if (!user1 || !user2) {
        throw new Error("Erreur : les utilisateurs n'ont pas été créés");
    }

    const ticket1 = await prisma.ticket.create({
        data: {
            label: 'Billet Journée',
            amount: 66.66,
            description: 'Accès illimité aux attractions pendant une journée',
        },
    });

    const ticket2 = await prisma.ticket.create({
        data: {
            label: 'Billet Enfant',
            amount: 66.66,
            description: 'Billet réservé aux enfants de moins de 12 ans',
        },
    });

    const catThrill = await prisma.category.create({ data: { name: 'Sensations fortes' } });
    const catFamily = await prisma.category.create({ data: { name: 'Famille' } });
    const catImmersive = await prisma.category.create({ data: { name: 'Immersif' } });

    const reception = await prisma.attraction.create({
        data: {
            name: 'Zone de quarantaine',
            description: "Bienvenue dans la dernière ligne de défense… ou ce qu’il en reste. Autrefois sécurisée, cette zone servait à contenir les premiers infectés. Aujourd’hui, les barrières sont brisées et les protocoles ont été abandonnés dans la panique. Les lumières vacillent, des messages de détresse résonnent encore, et quelque chose rôde entre les anciens sas de décontamination. Ici, chaque bruit peut vous trahir. Avancez lentement… car survivre est une question de discrétion.",
            min_height: 0,
            duration: 15,
            capacity: 100,
            intensity: Intensity.LOW,
        },
    });

    const biomasse = await prisma.attraction.create({
        data: {
            name: 'Ride de la Biomasse',
            description: "Entrez dans le cœur d’une expérience qui n’aurait jamais dû exister. Dans ce laboratoire abandonné, la matière vivante a muté au-delà de toute compréhension. Chair, métal et organismes inconnus se sont fusionnés en une entité instable et vivante. Les parois semblent respirer, les sols vibrent sous vos pieds… et certaines masses bougent encore. Vous ne traversez pas un lieu. Vous êtes à l’intérieur d’un organisme. Et il vous a déjà repéré.",
            min_height: 120,
            duration: 30,
            capacity: 20,
            intensity: Intensity.HIGH,
        },
    });

    const marche = await prisma.attraction.create({
        data: {
            name: 'L\'Allée Brisée',
            description: "Autrefois lieu de vie et d’échanges, cette allée marchande est aujourd’hui figée dans le chaos. Les étals renversés, les lumières clignotantes et les traces de fuite témoignent d’une évacuation brutale. Mais certains n’ont jamais quitté les lieux… Dans les ombres, des silhouettes se confondent avec le décor avant de surgir sans prévenir. Ici, le danger est partout… et surtout là où vous ne regardez pas.",
            min_height: 0,
            duration: 60,
            capacity: 200,
            intensity: Intensity.LOW,
        },
    });

    const grand8 = await prisma.attraction.create({
        data: {
            name: 'Grand Huit',
            description: "Accrochez-vous… ce manège n’a jamais été arrêté. Ce grand huit délabré continue de fonctionner dans un vacarme métallique inquiétant. À chaque montée, une présence se rapproche. À chaque descente, quelque chose vous poursuit. Entre vitesse extrême, obscurité totale et apparitions soudaines, vous perdez tout contrôle. Une seule certitude : ce ne sont pas les rails qui vous feront le plus peur.",
            min_height: 140,
            duration: 10,
            capacity: 24,
            intensity: Intensity.HIGH,
        },
    });

    const fosse = await prisma.attraction.create({
        data: {
            name: 'La fosse aux cadavres',
            description: "Respirez profondément… l’odeur ne vous quittera plus. Cette fosse a été creusée pour contenir les victimes de l’épidémie. Mais les corps n’y sont jamais restés immobiles bien longtemps. Le sol est instable, des silhouettes s’agitent sous vos pieds, et certaines mains émergent encore pour vous agripper. Chaque pas est un risque. Chaque mouvement attire leur attention. Ici, les morts ne dorment jamais vraiment.",
            min_height: 130,
            duration: 20,
            capacity: 30,
            intensity: Intensity.MEDIUM,
        },
    });

    const labo = await prisma.attraction.create({
        data: {
            name: 'Le Centre de Recherche',
            description: "Tout a commencé ici. Ce centre scientifique est à l’origine de l’épidémie qui a ravagé le monde. Les chercheurs ont tenté de contrôler l’incontrôlable… et ont disparu dans le processus. Les écrans affichent encore des données incohérentes, les expériences sont restées actives, et certaines créatures errent toujours dans les laboratoires. Vous allez découvrir la vérité. Mais certaines vérités devraient rester enterrées.",
            min_height: 120,
            duration: 45,
            capacity: 15,
            intensity: Intensity.MEDIUM,
        },
    });

    await prisma.attractionCategory.createMany({
        data: [
            { id_ATTRACTION: reception.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
            { id_ATTRACTION: biomasse.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: biomasse.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
            { id_ATTRACTION: marche.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
            { id_ATTRACTION: grand8.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: fosse.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: fosse.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
            { id_ATTRACTION: labo.id_ATTRACTION, id_CATEGORY: catImmersive.id_CATEGORY },
        ],
        skipDuplicates: true
    });

    await prisma.reservation.createMany({
        data: [
            {
                nb_tickets: 2,
                date: new Date('2025-06-15'),
                total_amount: 66.66,
                status: Status.CONFIRMED,
                id_USER: user1.id_USER,
                id_TICKET: ticket1.id_TICKET,
            },
            {
                nb_tickets: 3,
                date: new Date('2025-07-02'),
                total_amount: 66.66,
                status: Status.CONFIRMED,
                id_USER: user2.id_USER,
                id_TICKET: ticket2.id_TICKET,
            },
        ],
        skipDuplicates: true
    });

    console.log('✅ Seed terminé avec succès !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });