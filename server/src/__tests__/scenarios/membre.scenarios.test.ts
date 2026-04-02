// Scénarios membre — tests de bout en bout (sans vraie BDD)
// On simule le parcours réel d'un membre connecté via Supertest + mocks Prisma

// Faux client Prisma : simule les tables nécessaires sans toucher la vraie BDD
const mockPrisma = vi.hoisted(() => ({
    user: { findUnique: vi.fn() },
    reservation: { groupBy: vi.fn(), create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    ticket: { findUnique: vi.fn() },
    setting: { findUnique: vi.fn() }
}))

// Faux middleware d'auth : simule un membre connecté par défaut
const mockCheckToken = vi.hoisted(() => vi.fn())

// Remplace l'adaptateur Prisma PostgreSQL par une classe vide (pas de vraie BDD)
vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class { } }))
// Remplace PrismaClient par notre faux client mockPrisma
vi.mock('@prisma/client', () => ({
    PrismaClient: class { constructor() { Object.assign(this, mockPrisma) } }
}))
// Remplace checkToken par notre fausse fonction contrôlable
vi.mock('../../middlewares/auth.middleware.js', () => ({
    checkToken: mockCheckToken
}))

// contrôlable dans les tests qui vérifient le mot de passe
vi.mock('argon2', () => ({
    verify: vi.fn()
}))

import { vi, describe, test, expect, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import supertest from 'supertest'
import app from '../../app.js'
import { UnauthorizedError } from '../../utils/AppError.js'
import * as argon2 from 'argon2'

// Avant chaque test : réinitialise les mocks et simule un membre connecté (id: 1)
beforeEach(() => {
    vi.clearAllMocks()
    mockCheckToken.mockImplementation((req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
        req.user = { id: 1, role: 'MEMBER' }
        next()
    })
})

// SCÉNARIO 1 : Un membre consulte son propre profil
// Parcours : le membre est connecté → il appelle GET /api/users/1/profile
// Le serveur vérifie que l'id dans l'URL correspond bien à l'id du cookie
// et retourne ses informations (sans le mot de passe)

describe('Scénario : consultation du profil membre', () => {

    test('le membre peut consulter son propre profil', async () => {
        // Simule un utilisateur existant en BDD avec toutes ses données
        mockPrisma.user.findUnique.mockResolvedValue({
            id_USER: 1,
            firstname: 'Zoé',
            lastname: 'Durand',
            email: 'zoe@zombieland.fr',
            password: 'hashed_password',
            role: 'MEMBER',
            created_at: new Date(),
            updated_at: new Date()
        })

        // Le membre consulte son propre profil (son id dans l'URL = son id dans le cookie)
        const response = await supertest(app).get('/api/users/1/profile')

        // La réponse doit être 200 avec les infos du membre (sans le mot de passe)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('firstname', 'Zoé')
        expect(response.body).toHaveProperty('email', 'zoe@zombieland.fr')
        expect(response.body).not.toHaveProperty('password')
    })

    test('le membre ne peut pas consulter le profil d\'un autre membre', async () => {
        // le membre connecté a l'id 1 mais tente d'accéder au profil du membre 2
        // Aucun mock Prisma nécessaire : le contrôleur refuse avant même d'interroger la BDD

        // Tentative d'accès au profil d'un autre membre (id 2 ≠ id cookie 1)
        const response = await supertest(app).get('/api/users/2/profile')

        // Le serveur doit refuser avec un 403 Forbidden
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(403)
    })

    test('le membre ne peut pas consulter son profil s\'il n\'est pas connecté', async () => {
        // Simule l'absence de token (membre non connecté)
        mockCheckToken.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            next(new UnauthorizedError('Token manquant'))
        })

        // Tentative d'accès au profil sans être connecté
        const response = await supertest(app).get('/api/users/1/profile')

        // Le serveur doit refuser avec un 401 Unauthorized
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(401)
    })
})

// SCÉNARIO 2 : Un membre crée une réservation
// Parcours : le membre est connecté → il appelle POST /api/reservations
// Le serveur vérifie les disponibilités, le ticket, puis crée la réservation

describe('Scénario : création d\'une réservation par un membre', () => {

    test('le membre peut créer une réservation avec des données valides', async () => {
        // Simule une capacité max de 100 places avec 20 déjà réservées → 80 disponibles
        mockPrisma.setting.findUnique.mockResolvedValue({ key: 'max_tickets_per_day', value: '100' })
        mockPrisma.reservation.groupBy.mockResolvedValue([
            { date: new Date('2027-08-10'), _sum: { nb_tickets: 20 } }
        ])
        // Simule un ticket existant au prix de 25€
        mockPrisma.ticket.findUnique.mockResolvedValue({ id_TICKET: 1, amount: 25 })
        // Simule la création de la réservation en BDD
        mockPrisma.reservation.create.mockResolvedValue({
            id_RESERVATION: 42,
            nb_tickets: 2,
            date: new Date('2027-08-10'),
            id_TICKET: 1,
            id_USER: 1,
            total_amount: 50,
            status: 'CONFIRMED'
        })
        // Simule la récupération de la réservation avec les infos du membre
        mockPrisma.reservation.findUnique.mockResolvedValue({
            id_RESERVATION: 42,
            nb_tickets: 2,
            date: new Date('2027-08-10'),
            id_TICKET: 1,
            id_USER: 1,
            total_amount: 50,
            status: 'CONFIRMED',
            user: { firstname: 'Zoé', lastname: 'Durand', email: 'zoe@zombieland.fr' }
        })

        // Le membre envoie sa demande de réservation
        const response = await supertest(app).post('/api/reservations').send({
            nb_tickets: 2,
            date: '2027-08-10',
            id_TICKET: 1
        })

        // La réservation doit être créée avec un 201 et les données correctes
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(201)
        expect(response.body).toHaveProperty('id_RESERVATION', 42)
        expect(response.body).toHaveProperty('status', 'CONFIRMED')
        expect(response.body).toHaveProperty('total_amount', 50)
    })

    test('le membre ne peut pas réserver si le parc est complet', async () => {
        // Simule une capacité max de 100 places déjà toutes réservées
        mockPrisma.setting.findUnique.mockResolvedValue({ key: 'max_tickets_per_day', value: '100' })
        mockPrisma.reservation.groupBy.mockResolvedValue([
            { date: new Date('2027-08-10'), _sum: { nb_tickets: 100 } }
        ])

        // Le membre tente de réserver mais la date est complète
        const response = await supertest(app).post('/api/reservations').send({
            nb_tickets: 1,
            date: '2027-08-10',
            id_TICKET: 1
        })

        // Le serveur doit refuser avec un 409 Conflict (capacité maximale atteinte)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(409)
    })

    test('le membre ne peut pas réserver s\'il n\'est pas connecté', async () => {
        // Simule l'absence de token (membre non connecté)
        mockCheckToken.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            next(new UnauthorizedError('Token manquant'))
        })

        // Tentative de réservation sans être connecté
        const response = await supertest(app).post('/api/reservations').send({
            nb_tickets: 1,
            date: '2027-08-10',
            id_TICKET: 1
        })

        // Le serveur doit refuser avec un 401 Unauthorized
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(401)
    })
})

// SCÉNARIO 3 : Un membre annule une réservation (règle J-10)
// Parcours : le membre est connecté → il appelle DELETE /api/reservations/:id
// Le serveur vérifie le mot de passe, que la réservation lui appartient
// et que la date est à plus de 10 jours — sinon refuse

describe('Scénario : annulation d\'une réservation (règle J-10)', () => {

    // Date dans le futur à plus de 10 jours (annulation autorisée)
    const dateLointaine = new Date()
    dateLointaine.setDate(dateLointaine.getDate() + 20)

    // Date dans le futur à moins de 10 jours (annulation refusée)
    const dateProche = new Date()
    dateProche.setDate(dateProche.getDate() + 5)

    const fakeReservation = {
        id_RESERVATION: 1,
        nb_tickets: 2,
        date: dateLointaine,
        id_TICKET: 1,
        id_USER: 1,
        total_amount: 50,
        status: 'CONFIRMED',
        created_at: new Date(),
        updated_at: new Date()
    }

    test('le membre peut annuler une réservation à plus de 10 jours', async () => {
        // Simule la réservation existante avec une date lointaine (J+20)
        mockPrisma.reservation.findUnique.mockResolvedValue(fakeReservation)
        // Simule le membre en BDD avec un mot de passe correct
        mockPrisma.user.findUnique.mockResolvedValue({ id_USER: 1, password: 'hashed' })
        vi.mocked(argon2.verify).mockResolvedValue(true)
        mockPrisma.reservation.update.mockResolvedValue({ ...fakeReservation, status: 'CANCELLED' })

        // Le membre envoie sa demande d'annulation avec son mot de passe
        const response = await supertest(app)
            .delete('/api/reservations/1')
            .send({ password: 'correct_password' })

        // La réservation doit être annulée avec un 200 et le message de confirmation
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('message')
        expect(mockPrisma.reservation.update).toHaveBeenCalledWith({
            where: { id_RESERVATION: 1 },
            data: { status: 'CANCELLED' }
        })
    })

    test('le membre ne peut pas annuler une réservation à moins de 10 jours', async () => {
        // Simule la réservation existante avec une date proche (J+5) → règle J-10 s'applique
        mockPrisma.reservation.findUnique.mockResolvedValue({ ...fakeReservation, date: dateProche })
        mockPrisma.user.findUnique.mockResolvedValue({ id_USER: 1, password: 'hashed' })
        vi.mocked(argon2.verify).mockResolvedValue(true)

        // Le membre tente d'annuler mais la date est trop proche
        const response = await supertest(app)
            .delete('/api/reservations/1')
            .send({ password: 'correct_password' })

        // Le serveur doit refuser avec un 400 (règle J-10)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(400)
        expect(mockPrisma.reservation.update).not.toHaveBeenCalled()
    })

    test('le membre ne peut pas annuler la réservation d\'un autre membre', async () => {
        // Simule une réservation qui appartient au membre 2 (pas au membre connecté id:1)
        mockPrisma.reservation.findUnique.mockResolvedValue({ ...fakeReservation, id_USER: 2 })
        mockPrisma.user.findUnique.mockResolvedValue({ id_USER: 1, password: 'hashed' })
        vi.mocked(argon2.verify).mockResolvedValue(true)

        // Le membre connecté (id:1) tente d'annuler la réservation du membre 2
        const response = await supertest(app)
            .delete('/api/reservations/1')
            .send({ password: 'correct_password' })

        // Le serveur doit refuser avec un 403 Forbidden
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(403)
        expect(mockPrisma.reservation.update).not.toHaveBeenCalled()
    })

    test('le membre ne peut pas annuler sans mot de passe', async () => {
        // Simule la réservation existante — aucun mot de passe dans le body
        mockPrisma.reservation.findUnique.mockResolvedValue(fakeReservation)

        // Le membre tente d'annuler sans fournir de mot de passe
        const response = await supertest(app)
            .delete('/api/reservations/1')
            .send({})

        // Le serveur doit refuser avec un 400 (mot de passe requis)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(400)
        expect(mockPrisma.reservation.update).not.toHaveBeenCalled()
    })
})
