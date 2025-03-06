// src/database.ts
import {
  PrismaClient,
  Currency,
  Settings,
  Levels,
  CommandUsage,
  IgnoredChannels,
  LevelRoles,
} from "@prisma/client";

const prisma = new PrismaClient();

// Currency CRUD Operations
export async function createCurrency(
  data: Omit<Currency, "id">
): Promise<Currency> {
  return prisma.currency.create({ data });
}

export async function getCurrencyById(id: string): Promise<Currency | null> {
  return prisma.currency.findUnique({ where: { id } });
}

export async function getUserBalance(
  userId: string,
  guildId: string
): Promise<Currency | null> {
  return prisma.currency.findUnique({
    where: { id: `${userId}-${guildId}` },
  });
}

export async function createUserBalance(
  userId: string,
  guildId: string,
  username: string
): Promise<Currency> {
  return prisma.currency.create({
    data: {
      id: `${userId}-${guildId}`,
      userId,
      guildId,
      name: username,
      bank: 500, // Default balance for new users
      cash: 0,
      bitcoin: 0,
    },
  });
}

export async function depositToBank(
  userId: string,
  guildId: string,
  amount?: number
): Promise<Currency> {
  const user = await getUserBalance(userId, guildId);

  if (!user) {
    await createUserBalance(userId, guildId, "Unknown User");
    return await depositToBank(userId, guildId, amount);
  }

  let newBank: number;
  let newCash: number;

  if (!amount) {
    newBank = user.cash + user.bank;
    newCash = 0;
  } else if (amount > user.cash) {
    throw new Error(`Insufficient cash. Current cash: ${user.cash}`);
  } else {
    newCash = user.cash - amount;
    newBank = user.bank + amount;
  }

  return prisma.currency.update({
    where: { id: `${userId}-${guildId}` },
    data: { cash: newCash, bank: newBank },
  });
}

export async function transferFunds(
  senderId: string,
  receiverId: string,
  guildId: string,
  amount: number
): Promise<{ sender: Currency; receiver: Currency }> {
  return prisma.$transaction(async (prisma) => {
    const sender = await prisma.currency.findUnique({
      where: { id: `${senderId}-${guildId}` },
    });
    const receiver = await prisma.currency.findUnique({
      where: { id: `${receiverId}-${guildId}` },
    });

    if (!sender) throw new Error("You don't have an account yet!");
    if (!receiver)
      throw new Error("The recipient doesn't have an account yet!");
    if (sender.cash < amount)
      throw new Error(`Insufficient funds! Your current cash: ${sender.cash}`);

    // Update balances
    const updatedSender = await prisma.currency.update({
      where: { id: `${senderId}-${guildId}` },
      data: { cash: sender.cash - amount },
    });

    const updatedReceiver = await prisma.currency.update({
      where: { id: `${receiverId}-${guildId}` },
      data: { cash: receiver.cash + amount },
    });

    return { sender: updatedSender, receiver: updatedReceiver };
  });
}

export async function withdrawFromBank(
  userId: string,
  guildId: string,
  amount?: number
): Promise<Currency> {
  const user = await getUserBalance(userId, guildId);

  if (!user) {
    await createUserBalance(userId, guildId, "Unknown User");
    return await withdrawFromBank(userId, guildId, amount);
  }

  let newBank: number;
  let newCash: number;

  if (!amount) {
    newBank = 0;
    newCash = user.bank + user.cash;
  } else if (amount > user.bank) {
    throw new Error(
      `Insufficient funds in the bank. Current bank balance: ${user.bank}`
    );
  } else {
    newBank = user.bank - amount;
    newCash = user.cash + amount;
  }

  return prisma.currency.update({
    where: { id: `${userId}-${guildId}` },
    data: { cash: newCash, bank: newBank },
  });
}

// Handle coinflip betting transaction
export async function handleCoinflip(
  userId: string,
  guildId: string,
  amount: number,
  won: boolean
): Promise<Currency> {
  return prisma.$transaction(async (prisma) => {
    const user = await prisma.currency.findUnique({
      where: { id: `${userId}-${guildId}` },
    });

    if (!user) {
      await createUserBalance(userId, guildId, "Unknown User");
      return await handleCoinflip(userId, guildId, amount, won);
    }

    if (user.cash < amount)
      throw new Error(`Insufficient funds! Your current cash: ${user.cash}`);

    const newCash = won ? user.cash + amount : user.cash - amount;

    return prisma.currency.update({
      where: { id: `${userId}-${guildId}` },
      data: { cash: newCash },
    });
  });
}

// Handle dice game betting transaction
export async function handleDiceGame(
  userId: string,
  guildId: string,
  amount: number,
  won: boolean
): Promise<Currency> {
  return prisma.$transaction(async (prisma) => {
    const user = await prisma.currency.findUnique({
      where: { id: `${userId}-${guildId}` },
    });

    if (!user) {
      await createUserBalance(userId, guildId, "Unknown User");
      return await handleDiceGame(userId, guildId, amount, won);
    }

    if (user.cash < amount)
      throw new Error(`Insufficient funds! Your current cash: ${user.cash}`);

    const newCash = won ? user.cash + amount * 2 : user.cash - amount;

    return prisma.currency.update({
      where: { id: `${userId}-${guildId}` },
      data: { cash: newCash },
    });
  });
}

// Handle Rock Paper Scissors game betting transaction
export async function handleRPSGame(
  userId: string,
  guildId: string,
  amount: number,
  result: "win" | "lose" | "tie"
): Promise<Currency> {
  return prisma.$transaction(async (prisma) => {
    const user = await prisma.currency.findUnique({
      where: { id: `${userId}-${guildId}` },
    });

    if (!user) {
      await createUserBalance(userId, guildId, "Unknown User");
      return await handleRPSGame(userId, guildId, amount, result);
    }

    if (user.cash < amount)
      throw new Error(`Insufficient funds! Your current cash: ${user.cash}`);

    let newCash = user.cash;

    if (result === "win") newCash += amount * 2; // Double the winnings
    if (result === "lose") newCash -= amount; // Lose the bet
    // Tie results in no cash change

    return prisma.currency.update({
      where: { id: `${userId}-${guildId}` },
      data: { cash: newCash },
    });
  });
}

// Handle robbery transactions
export async function handleRobbery(
  robberId: string,
  victimId: string,
  guildId: string,
  amount: number,
  success: boolean
): Promise<void> {
  return prisma.$transaction(async (prisma) => {
    const robber = await prisma.currency.findUnique({
      where: { id: `${robberId}-${guildId}` },
    });
    const victim = await prisma.currency.findUnique({
      where: { id: `${victimId}-${guildId}` },
    });

    if (!robber || !victim) return;

    let newRobberCash = robber.cash;
    let newVictimCash = victim.cash;

    if (success) {
      newRobberCash += amount;
      newVictimCash -= amount;
    } else {
      newRobberCash -= amount;
    }

    await prisma.currency.update({
      where: { id: `${robberId}-${guildId}` },
      data: { cash: Math.max(newRobberCash, 0) }, // Prevent negative balance
    });

    await prisma.currency.update({
      where: { id: `${victimId}-${guildId}` },
      data: { cash: Math.max(newVictimCash, 0) },
    });
  });
}

export async function updateCurrency(
  id: string,
  data: Partial<Currency>
): Promise<Currency> {
  return prisma.currency.update({ where: { id }, data });
}

export async function deleteCurrency(id: string): Promise<Currency> {
  return prisma.currency.delete({ where: { id } });
}

// Levels CRUD Operations
export async function createLevel(data: Omit<Levels, "id">): Promise<Levels> {
  return prisma.levels.create({ data });
}

export async function getLevelById(id: string): Promise<Levels | null> {
  return prisma.levels.findUnique({ where: { id } });
}

export async function updateLevel(
  id: string,
  data: Partial<Levels>
): Promise<Levels> {
  return prisma.levels.update({ where: { id }, data });
}

// Get top 10 users in the leaderboard for a guild
export async function getLeaderboard(guildId: string): Promise<Levels[]> {
  return prisma.levels.findMany({
    where: { guildId },
    orderBy: [{ level: "desc" }, { exp: "desc" }], // Sort by level first, then experience
    take: 10, // Get the top 10 users
  });
}

// Get user level and experience
export async function getUserLevel(
  userId: string,
  guildId: string
): Promise<Levels | null> {
  return prisma.levels.findUnique({
    where: { id: `${userId}-${guildId}` },
  });
}

// Add experience to a user
export async function addExperience(
  userId: string,
  guildId: string,
  username: string
) {
  return prisma.levels.upsert({
    where: { id: `${userId}-${guildId}` }, // Unique composite key
    update: { exp: { increment: 5 } },
    create: {
      id: `${userId}-${guildId}`,
      userId,
      guildId,
      name: username,
      exp: 5,
      level: 1,
    },
  });
}

// Check and handle level-ups
export async function checkLevelUp(
  userId: string,
  guildId: string,
  message: any
) {
  const userLevel = await prisma.levels.findUnique({
    where: { id: `${userId}-${guildId}` },
  });

  if (!userLevel) return;

  let currentExp = userLevel.exp;
  let currentLevel = userLevel.level;
  let requiredExp = 5 * currentLevel ** 2 + 50 * currentLevel + 100;

  if (currentExp >= requiredExp) {
    await prisma.levels.update({
      where: { id: `${userId}-${guildId}` },
      data: { level: { increment: 1 }, exp: 0 },
    });

    const newLevel = currentLevel + 1;
    message.channel
      .send(`${message.author} has leveled up to level ${newLevel}!`)
      .catch(console.error);
  }
}

export async function deleteLevel(id: string): Promise<Levels> {
  return prisma.levels.delete({ where: { id } });
}

// levelRoles CRUD Operations

export async function getRoleByLevel(
  guildId: string,
  level: number
): Promise<LevelRoles | null> {
  return prisma.levelRoles.findFirst({
    where: { guildId, level },
  });
}

export async function addOrUpdateLevelRole(
  data: Omit<LevelRoles, "id">
): Promise<LevelRoles> {
  return await prisma.levelRoles.create({ data });
}

export async function addExistingRoles(
  guildId: string,
  roles: { level: number; roleId: string }[]
): Promise<void> {
  await prisma.levelRoles.createMany({
    data: roles.map((role) => ({
      guildId,
      level: role.level,
      roleId: role.roleId,
    })),
    skipDuplicates: true,
  });
}

// Settings CRUD Operations

export async function createSetting(
  data: Omit<Settings, "id">
): Promise<Settings> {
  return prisma.settings.create({ data });
}

export async function getSettingByCommand(
  guildId: string,
  command: string
): Promise<Settings | null> {
  return prisma.settings.findFirst({
    where: { guildId, command },
  });
}

export async function updateSetting(
  id: string,
  data: Partial<Settings>
): Promise<Settings> {
  return prisma.settings.update({ where: { id }, data });
}

export async function deleteSetting(id: string): Promise<Settings> {
  return prisma.settings.delete({ where: { id } });
}

// CommandUsage CRUD Operations

export async function createCommandUsage(
  data: Omit<CommandUsage, "id">
): Promise<CommandUsage> {
  return prisma.commandUsage.create({ data });
}

export async function getCommandUsage(
  command: string
): Promise<CommandUsage | null> {
  return prisma.commandUsage.findFirst({ where: { command } });
}

export async function incrementCommandUsage(
  command: string
): Promise<CommandUsage> {
  return prisma.commandUsage.upsert({
    where: { command },
    update: { usageCount: { increment: 1 } }, // Increments usage count
    create: { command, category: "unknown", usageCount: 1 }, // Default category if not found
  });
}

export async function deleteCommandUsage(
  command: string
): Promise<CommandUsage> {
  return prisma.commandUsage.delete({ where: { command } });
}

// Bulk insert settings for a new guild
export async function createMultipleSettings(
  data: Omit<Settings, "id">[]
): Promise<void> {
  await prisma.settings.createMany({
    data,
    skipDuplicates: true, // Prevents duplicate command entries for the same guild
  });
}

// Delete all data for a guild when it leaves
export async function deleteGuildData(guildId: string): Promise<void> {
  await prisma.$transaction([
    prisma.currency.deleteMany({ where: { guildId } }),
    prisma.levels.deleteMany({ where: { guildId } }),
    prisma.settings.deleteMany({ where: { guildId } }),
  ]);
}

// Add a channel to the ignored channels list
export async function addIgnoredChannel(
  guildId: string,
  channelId: string,
  status: string
) {
  return prisma.ignoredChannels.upsert({
    where: { channelId },
    update: { status },
    create: { guildId, channelId, status },
  });
}

// Get ignored channel status
export async function getIgnoredChannelStatus(
  guildId: string,
  channelId: string
): Promise<IgnoredChannels | null> {
  return prisma.ignoredChannels.findFirst({
    where: { guildId, channelId },
  });
}

// Remove a channel from ignored list
export async function removeIgnoredChannel(channelId: string) {
  return prisma.ignoredChannels.delete({
    where: { channelId },
  });
}

// Close the Prisma Client connection
export async function disconnect() {
  await prisma.$disconnect();
}
