const fetch = require('node-fetch');
module.exports = {
	name: 'cat',
	description: 'its a cat',
	aliases: ['kitty', 'cato'],
	guildOnly: true,
	args: false,
	async execute(message) {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);
	},
};