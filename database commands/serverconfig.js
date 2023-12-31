const mysql = require("mysql2");
require("dotenv").config();
const conn = mysql.createConnection(process.env.DATABASE_URL);
conn.connect(function (err) {
  if (err) throw err;
  console.log("Succesfully connected to PlanetScale!");
});

conn.promise().query("DROP TABLE IF EXISTS serverconfig");

conn
  .promise()
  .query(
    "CREATE TABLE IF NOT EXISTS serverconfig (id INT NOT NULL AUTO_INCREMENT, guildid INT NOT NULL, moderation INT NOT NULL, relationship INT NOT NULL, levelsystem INT NOT NULL, removeRoleOnLevelUp INT NOT NULL, PRIMARY KEY (`id`));"
  );
