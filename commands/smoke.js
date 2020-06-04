module.exports = {
	name: 'smoke',
	description: 'light it up',
	guildOnly: true,
	args: false,
	async execute(message) {
		// remove 1 weed from database... if eddie fixes it.
		message.channel.send('*cough* *cough* thats some good stuff');
	},
};