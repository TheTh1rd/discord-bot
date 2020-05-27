module.exports = {
	name: 'ping',
	description: 'Ping!',
	guildOnly: true,
	args: false,
	execute(message) {
		message.channel.send('What did you expect?');
	},
};