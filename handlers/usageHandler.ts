export default async function handleUsage(interaction: any, mongoclient: any, conn: any) {
  await mongoclient
    .db("Aylani")
    .collection("botcommands")
    .updateOne({ command: `${interaction}` }, { $inc: { usage_count: 1 } });

  // conn
  //   .promise()
  //   .query(
  //     `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = '${interaction}'`
  //   );
}
