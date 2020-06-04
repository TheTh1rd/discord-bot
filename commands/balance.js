// const Discord = require('discord.js');
// let currency = new Discord.Collection();
// module.exports = {
// 	name: 'balance',
// 	description: 'checks users balance',
// 	guildOnly: true,
// 	args: false,
// 	execute: (message, currency1) => {
// 		currency = currency1;
// 		Reflect.defineProperty(currency, 'getBalance', {
// 			value: function getBalance(id) {
// 				const user = currency.get(id);
// 				return user ? user.balance : 0;
// 			},
// 		});
// 		console.log('snorlax');
// 		const target = message.mentions.users.first() || message.author;
// 		return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
// 	},
// };