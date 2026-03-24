import { Role, Intensity, Status } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import * as argon2 from 'argon2';



async function main() {
    console.log('🌱 Seeding database...');

    const adminPassword = await argon2.hash('monMotDePasse')
    const memberPassword = await argon2.hash('monMotDePasse')

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
            description: 'L\entrée du parc. Préparez vous à être décontaminé avant de pénétrer dans Zombieland',
            min_height: 0,
            duration: 15,
            capacity: 100,
            intensity: Intensity.LOW,
        },
    });

    const biomasse = await prisma.attraction.create({
        data: {
            name: 'Ride de la Biomasse',
            description: 'Une attraction immersive dans les profondeurs d\'une masse organique vivante et terrifiante.',
            min_height: 120,
            duration: 30,
            capacity: 20,
            intensity: Intensity.HIGH,
        },
    });

    const marche = await prisma.attraction.create({
        data: {
            name: 'L\'Allée Brisée',
            description: 'Une ruelle dévastée abritant le Marché de Zombieland - boutiques et restauration au cœur du chaos.',
            min_height: 0,
            duration: 60,
            capacity: 200,
            intensity: Intensity.LOW,
        },
    });

    const grand8 = await prisma.attraction.create({
        data: {
            name: 'Grand Huit',
            description: 'Des rails tordus à travers une carcasse métallique géante...',
            min_height: 140,
            duration: 10,
            capacity: 24,
            intensity: Intensity.HIGH,
        },
    });

    const fosse = await prisma.attraction.create({
        data: {
            name: 'La fosse aux cadavres',
            description: 'Une fosse sans fond où les morts refusent de rester enterrés. Entrez si vous l\'osez.',
            min_height: 130,
            duration: 20,
            capacity: 30,
            intensity: Intensity.MEDIUM,
        },
    });

    const labo = await prisma.attraction.create({
        data: {
            name: 'Le Centre de Recherche',
            description: 'Le laboratoire secret à l\'origine de l\'épidémie. Découvrez les expériences qui ont tout déclenché.',
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