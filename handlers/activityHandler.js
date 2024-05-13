export async function messageCounter(userid, guild, conn, mongoclient) {
  conn
    .promise()
    .query(
      `SELECT * FROM activity WHERE userID = ${userid} AND guildID = ${guild}`
    )
    .then(async ([rows, fields]) => {
      if (rows.length < 1) {
        conn
          .promise()
          .query(
            `INSERT INTO activity (userID, guildID, message, voice) VALUES (${userid}, ${guild}, 1, 0);`
          );
      } else {
        conn
          .promise()
          .query(
            `UPDATE activity SET message = message + 1 WHERE userID = ${userid} AND guildID = ${guild}`
          );
      }
    });
}
export async function voiceCounter() {}
export async function joinCounter() {}
