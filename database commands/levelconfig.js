const mysql = require("mysql2");
require("dotenv").config();
const conn = mysql.createConnection(process.env.DATABASE_URL);
conn.connect(function (err) {
  if (err) throw err;
  console.log("Succesfully connected to PlanetScale!");
});

conn.promise().query("DROP TABLE IF EXISTS levelconfig");

conn
  .promise()
  .query(
    "CREATE TABLE IF NOT EXISTS levelconfig (id INT NOT NULL AUTO_INCREMENT, guildid INT NOT NULL, roleid INT NOT NULL, rolename TEXT NOT NULL, rolelevel INT NOT NULL, PRIMARY KEY (`id`));"
  );

conn
  .promise()
  .query(
    "INSERT INTO levelconfig(guildid, roleid, rolename, rolelevel) VALUES (1, 1, 'level1', 1);"
  );

conn.query("SELECT * FROM levelconfig");
