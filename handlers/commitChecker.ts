// async function checkBotCommits() {
//   try {
//     const response = await axios.get(
//       `https://api.github.com/repos/${botREPO}/commits?sha=${botBRANCH}`,
//       {
//         headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
//       }
//     );

//     const latestCommit = response.data[0];
//     if (lastBotCommitSha == null) {
//       lastCommitSha = latestCommit.sha;
//     }
//     if (latestCommit.sha !== lastBotCommitSha) {
//       lastBotCommitSha = latestCommit.sha;
//       // Fetch detailed commit data
//       const commitDetailsResponse = await axios.get(latestCommit.url, {
//         headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
//       });
//       const files = commitDetailsResponse.data.files.map(
//         (file) => file.filename
//       );
//       // .join(", ");

//       // const commitMessage = `New commit in ${REPO} on branch ${BRANCH}: ${latestCommit.commit.message}\nAffected files: ${files}`;
//       console.log(files);
//       let embed = new EmbedBuilder()
//         .setTitle("New Bot Update")
//         .setDescription(`Update: ${latestCommit.commit.message}`);
//       for (i = 0; i < files.length; i++) {
//         let file = files[i].replace("commands/", "");
//         file = file.replace(".js", "");
//         if (files[i].includes("commands")) {
//           embed.addFields({
//             name: `${file}`,
//             value: "Command",
//             inline: true,
//           });
//         } else {
//           embed.addFields({
//             name: `${files[i]}`,
//             value: "other",
//             inline: true,
//           });
//         }
//       }

//       const channel = await client.channels.cache.get("929363312527953950");
//       channel.send({ embeds: [embed] });
//     }
//   } catch (error) {
//     console.error("Error fetching commits:", error);
//   }
// }

// async function checkWebCommits() {
//   try {
//     const response = await axios.get(
//       `https://api.github.com/repos/${webREPO}/commits?sha=${webBRANCH}`,
//       {
//         headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
//       }
//     );

//     const latestCommit = response.data[0];
//     if (lastWebCommitSha == null) {
//       lastWebCommitSha = latestCommit.sha;
//     }
//     if (latestCommit.sha !== lastWebCommitSha) {
//       lastWebCommitSha = latestCommit.sha;

//       // const commitMessage = `New commit in ${REPO} on branch ${BRANCH}: ${latestCommit.commit.message}\nAffected files: ${files}`;

//       let embed = new EmbedBuilder()
//         .setTitle("New Web Update")
//         .setDescription(`Update: ${latestCommit.commit.message}`);

//       const channel = await client.channels.cache.get("929363312527953950");
//       channel.send({ embeds: [embed] });
//     }
//   } catch (error) {
//     console.error("Error fetching commits:", error);
//   }
// }
