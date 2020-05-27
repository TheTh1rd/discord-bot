module.exports = {
	name: 'cat',
	description: 'its a cat',
	aliases: ['kitty'],
	async execute(message, args) {
		const fetch = require('node-fetch');
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);
	},
};