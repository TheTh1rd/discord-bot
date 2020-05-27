module.exports = {
	name: 'dog',
	description: 'its a dog',
	aliases: ['woof', 'doggy', 'doogo'],
	guildOnly: true,
	async execute(message, args) {
		const fetch = require('node-fetch');
		const dogPic = await fetch('https://random.dog/woof.json').then(response => response.json());
		message.channel.send(dogPic.url);
	},
};