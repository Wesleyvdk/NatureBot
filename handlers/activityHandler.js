export async function messageCounter(userid, guild, conn, mongoclient) {
  // conn
  //   .promise()
  //   .query(
  //     `SELECT * FROM activity WHERE userID = ${userid} AND guildID = ${guild}`
  //   )
  //   .then(async ([rows, fields]) => {
  //     if (rows.length < 1) {
  //       conn
  //         .promise()
  //         .query(
  //           `INSERT INTO activity (userID, guildID, message, voice) VALUES (${userid}, ${guild}, 1, 0);`
  //         );
  //     } else {
  //       conn
  //         .promise()
  //         .query(
  //           `UPDATE activity SET message = message + 1 WHERE userID = ${userid} AND guildID = ${guild}`
  //         );
  //     }
  //   });
  // Create a filter for movies with the title "Random Harvest"
  const filter = { userID: `${userid}`, guildID: `${guild}` };
  // Insert if not exists
  const options = { upsert: true };
  // Increase the message count by 1
  const update = { $inc: { message: 1 }, $setOnInsert: { message: 1 } };
  mongoclient
    .db("Aylani")
    .collection("activity")
    .UpdateOne(filter, update, options);
}
export async function voiceCounter() {}
export async function joinCounter() {}
