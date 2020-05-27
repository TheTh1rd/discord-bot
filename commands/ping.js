module.exports = {
	name: 'ping',
	description: 'Ping!',
	guildOnly: true,
	execute(message, args) {
		message.channel.send('What did you expect?');
	},
};