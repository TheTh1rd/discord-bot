const fetch = require('node-fetch');
module.exports = {
	name: 'cat',
	description: 'its a cat',
	aliases: ['kitty', 'cato'],
	guildOnly: true,
	args: false,
	async execute(message) {
		try{
			const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
			message.channel.send(file);
		}
		catch (error) {
			message.reply('Cat api is down 😭');
		}

	},
};