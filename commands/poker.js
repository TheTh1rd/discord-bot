const Discord = require('discord.js');
const { currency } = require('../index.js');
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
module.exports = {
	name: 'poker',
	description: 'poker game',
	usage: '<amount to bet>',
	aliases: ['cards', '5card'],
	guildOnly: true,
	args: true,
	async execute(message, args) {
		console.log('totodile');
		const balance = await currency.getBalance(message.author.id);
		const reg = new RegExp('^\\d+$');
		if(!reg.test(args[0])) {
			return message.reply('Please enter a valid amount!\nPlease use !help to get a list of commands.');
		}
		if(args[0] > balance) {
			return message.reply('You do not have enough money to bet that much!');
		}

		message.channel.send('hey');
		// const exampleEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle('Some title');

		// message.channel.send(exampleEmbed);

	},
};