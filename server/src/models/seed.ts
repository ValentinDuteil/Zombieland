import { Role, Intensity, Status } from '@prisma/client';
import { prisma } from '../lib/prisma.js';




async function main() {
    console.log('🌱 Seeding database...');

    await prisma.user.createMany({
        data: [
            {
                email: 'john.doe@example.com',
                firstname: 'John',
                lastname: 'Doe',
                password: 'hashedpassword123',
                role: Role.ADMIN,
            },
            {
                email: 'jane.smith@example.com',
                firstname: 'Jane',
                lastname: 'Smith',
                password: 'hashedpassword456',
                role: Role.MEMBER,
            },
        ],
    });

    const user1 = await prisma.user.findUnique({ where: { email: 'john.doe@example.com' } });
    const user2 = await prisma.user.findUnique({ where: { email: 'jane.smith@example.com' } });

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
    const catWater = await prisma.category.create({ data: { name: 'Attractions aquatiques' } });

    const rollerCoaster = await prisma.attraction.create({
        data: {
            name: 'Thunder Roller Coaster',
            description: 'Un grand huit rapide et intense',
            min_height: 140,
            duration: 120,
            capacity: 24,
            intensity: Intensity.HIGH,
        },
    });

    const carousel = await prisma.attraction.create({
        data: {
            name: 'Carrousel Magique',
            description: 'Un manège classique pour toute la famille',
            min_height: 0,
            duration: 180,
            capacity: 40,
            intensity: Intensity.LOW,
        },
    });

    const waterSlide = await prisma.attraction.create({
        data: {
            name: 'Aqua Splash',
            description: 'Toboggan aquatique géant',
            min_height: 120,
            duration: 90,
            capacity: 20,
            intensity: Intensity.MEDIUM,
        },
    });

    await prisma.attractionCategory.createMany({
        data: [
            { id_ATTRACTION: rollerCoaster.id_ATTRACTION, id_CATEGORY: catThrill.id_CATEGORY },
            { id_ATTRACTION: carousel.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
            { id_ATTRACTION: waterSlide.id_ATTRACTION, id_CATEGORY: catWater.id_CATEGORY },
            { id_ATTRACTION: waterSlide.id_ATTRACTION, id_CATEGORY: catFamily.id_CATEGORY },
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