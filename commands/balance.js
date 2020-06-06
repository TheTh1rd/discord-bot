const { currency } = require('../index.js');
module.exports = {
	name: 'balance',
	description: 'checks users balance',
	guildOnly: true,
	args: false,
	execute: (message) => {
		console.log('snorlax');
		const target = message.mentions.users.first() || message.author;
		return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	},
};