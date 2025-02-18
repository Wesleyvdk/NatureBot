export default async function levelRoleHandler(
  user,
  guild,
  mongoclient,
  level
) {
  console.log(`levelRoleHandler called with level: ${level}`);
  const db = mongoclient.db("Aylani");
  const collection = db.collection(`${guild.id}LevelRoles`);

  // Check if the role for the current level exists
  const role = await collection.findOne({ level });

  let roleId;
  if (role) {
    // Check if the role exists on the server
    const serverRole = await guild.roles.fetch(role.roleId).catch(() => null);

    if (serverRole) {
      roleId = role.roleId;
    } else {
      // If the role does not exist on the server, create a new role
      roleId = await createRole(guild, level);

      // Update the database with the new role ID
      await collection.updateOne({ level }, { $set: { roleId } });
    }
  } else {
    // If the role does not exist in the database, create a new role
    roleId = await createRole(guild, level);

    // Add the new role to MongoDB
    await addRoleToMongoDB(mongoclient, guild.id, level, roleId);
  }

  // Assign the role to the user
  await assignRoleToUser(user, guild, roleId);
}

// export default async function addExistingRolesToMongoDB(mongoclient, guild) {
//   const levelRole = {
//     1: "1088055118173327360",
//     5: "1088055313233612810",
//     10: "1088055314781310986",
//     20: "1088055316173824060",
//     30: "1088055317318881420",
//     40: "1088055318476509255",
//     50: "1088055319638331442",
//     60: "1088055321144074360",
//   };
//   const db = mongoclient.db("Aylani");
//   const collection = db.collection(`${guild}LevelRoles`);
//   for (const level in levelRole) {
//     await collection.insertOne({ level, roleId: levelRole[level] });
//   }
// }

async function createRole(guild, level) {
  const roleName = `level ${level}`;

  const roles = await guild.roles.fetch();
  const levelRoles = await roles.filter((role) =>
    role.name.startsWith("level ")
  );
  const highestLevelRole = levelRoles
    .sort((a, b) => b.position - a.position)
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

async function addRoleToMongoDB(mongoclient, guildId, level, roleId) {
  const db = mongoclient.db("Aylani");
  const collection = db.collection(`${guildId}LevelRoles`);
  await collection.insertOne({ level, roleId });
}

async function assignRoleToUser(user, guild, roleId) {
  const member = await guild.members.fetch(user.id);
  await member.roles.add(roleId);
}
