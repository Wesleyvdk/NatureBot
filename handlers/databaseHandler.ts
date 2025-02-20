// src/database.ts
import { PrismaClient, Currency, Settings, Levels } from '@prisma/client';
const prisma = new PrismaClient();

// Currency CRUD Operations
export async function createCurrency(data: Omit<Currency, 'id'>): Promise<Currency> {
    return prisma.currency.create({ data });
}

export async function getCurrencyById(id: string): Promise<Currency | null> {
    return prisma.currency.findUnique({ where: { id } });
}

export async function updateCurrency(id: string, data: Partial<Currency>): Promise<Currency> {
    return prisma.currency.update({ where: { id }, data });
}

export async function deleteCurrency(id: string): Promise<Currency> {
    return prisma.currency.delete({ where: { id } });
}

// Levels CRUD Operations
export async function createLevel(data: Omit<Levels, 'id'>): Promise<Levels> {
    return prisma.levels.create({ data });
}

export async function getLevelById(id: string): Promise<Levels | null> {
    return prisma.levels.findUnique({ where: { id } });
}

export async function updateLevel(id: string, data: Partial<Levels>): Promise<Levels> {
    return prisma.levels.update({ where: { id }, data });
}

export async function deleteLevel(id: string): Promise<Levels> {
    return prisma.levels.delete({ where: { id } });
}

// Settings CRUD Operations

export async function createSetting(data: Omit<Settings, 'id'>): Promise<Settings> {
    return prisma.settings.create({ data });
}

export async function getSettingByCommand(guildId: string, command: string): Promise<Settings | null> {
    return prisma.settings.findFirst({
        where: { guildId, command },
    });
}

export async function updateSetting(id: string, data: Partial<Settings>): Promise<Settings> {
    return prisma.settings.update({ where: { id }, data });
}

export async function deleteSetting(id: string): Promise<Settings> {
    return prisma.settings.delete({ where: { id } });
}

// Close the Prisma Client connection
export async function disconnect() {
    await prisma.$disconnect();
}
