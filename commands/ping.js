module.exports = {
	name: 'ping',
	description: 'Ping!',
	guildOnly: true,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};