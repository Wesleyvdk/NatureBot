export default async function bumpHandler() {
  const keyword = "Bump done";
  const roleName = "bumper";
  const role = message.guild.roles.cache.find((role) => role.name === roleName);
  const embed = message.embeds[0];
  try {
    if (embed && embed.description) {
      try {
        if (embed.description.includes(keyword)) {
          message.channel.send(
            `thank you for bumping! next bump is ready in 2 hours. to get the bump reminder role, use \`.addBump\`\n
                  if this role does not exist, the role will be created on first use of the .addBump command`
          );

          const delay = 2 * 60 * 60 * 1000;
          // in milliseconds
          if (role) {
            const roleMention = role.toString();
            setTimeout(() => {
              // Send a message to the channel where the command was used
              message.channel.send(`bump is ready ${roleMention}`);
            }, delay);
          } else {
            setTimeout(() => {
              // Send a message to the channel where the command was used
              message.channel.send("bump is ready");
            }, delay);
          }
        } else {
          return;
        }
      } catch (e) {
        errorHandler(null, e, message);
      }
    }
  } catch (e) {
    errorHandler(null, e, message);
  }
}
