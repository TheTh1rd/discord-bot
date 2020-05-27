const fetch = require('node-fetch');
module.exports = {
	name: 'dog',
	description: 'its a dog',
	aliases: ['woof', 'doggy', 'doggo'],
	guildOnly: true,
	args: false,
	async execute(message) {
		const dogPic = await fetch('https://random.dog/woof.json').then(response => response.json());
		message.channel.send(dogPic.url);
	},
};