module.exports = {
	name: 'server',
	description: 'server info',
	args: false,
	execute(message) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};