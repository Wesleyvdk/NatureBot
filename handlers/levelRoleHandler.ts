import * as db from "./databaseHandler";

export default async function levelRoleHandler(
  user: any,
  guild: any,
  level: any
) {
  console.log(`levelRoleHandler called with level: ${level}`);

  // Check if the role exists in PostgreSQL
  let role = await db.getRoleByLevel(guild.id, level);
  let roleId: string;

  if (role) {
    // Check if the role exists on Discord server
    const serverRole = await guild.roles.fetch(role.roleId).catch(() => null);
    roleId = serverRole ? role.roleId : await createRole(guild, level);

    // Update role in database if missing from Discord
    if (!serverRole) {
      const guildId = guild.id;
      await db.addOrUpdateLevelRole({ guildId, level, roleId });
    }
  } else {
    // Create a new role since it doesn't exist in the database
    roleId = await createRole(guild, level);
    const guildId = guild.id;
    await db.addOrUpdateLevelRole({ guildId, level, roleId });
  }

  // Assign the role to the user
  await assignRoleToUser(user, guild, roleId);
}

export async function addExistingRolesToPostgreSQL(guildId: string) {
  console.log("processing levelRoles for aylian Studio");
  const levelRoles = [
    { level: 1, roleId: "1088055118173327360" },
    { level: 5, roleId: "1088055313233612810" },
    { level: 10, roleId: "1088055314781310986" },
    { level: 20, roleId: "1088055316173824060" },
    { level: 30, roleId: "1088055317318881420" },
    { level: 40, roleId: "1088055318476509255" },
    { level: 50, roleId: "1088055319638331442" },
    { level: 60, roleId: "1088055321144074360" },
  ];

  await db.addExistingRoles(guildId, levelRoles);
}

async function createRole(guild: any, level: any) {
  const roleName = `level ${level}`;

  const roles = await guild.roles.fetch();
  const levelRoles = roles.filter((role: any) =>
    role.name.startsWith("level ")
  );
  const highestLevelRole = levelRoles
    .sort((a: any, b: any) => b.position - a.position)
    .first();

  const role = await guild.roles.create({
    name: roleName,
    reason: `Role for level ${level}`,
    mentionable: false,
    hoist: true,
    position: highestLevelRole ? highestLevelRole.position + 1 : 1,
  });

  return role.id;
}

async function assignRoleToUser(user: any, guild: any, roleId: any) {
  const member = await guild.members.fetch(user.id);
  await member.roles.add(roleId);
}
