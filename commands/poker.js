const Discord = require('discord.js');
const { currency } = require('../index.js');

module.exports = {
	name: 'poker',
	description: 'poker game',
	usage: '<amount to bet>',
	aliases: ['cards', '5card', 'card'],
	guildOnly: true,
	args: true,
	async execute(message, args) {
		console.log('totodile');
		const pokerEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle('5 Card Draw');
		const balance = await currency.getBalance(message.author.id);
		const reg = new RegExp('^\\d+$');
		if(!reg.test(args[0])) {
			return message.reply('Please enter a valid amount!\nPlease use !help to get a list of commands.');
		}
		if(args[0] > balance) {
			return message.reply('You do not have enough money to bet that much!');
		}

		const arr = [];
		while(arr.length < 5) {
			const r = Math.floor(Math.random() * 52) + 1;
			if(arr.indexOf(r) === -1) arr.push(r);
		}
		const cards = [];
		const cardValue = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		const suits = ['♠️', '♥️', '♣️', '♦️'];
		const count = new Array(13).fill(0);
		const flush = new Array(5).fill(0);
		const straight = [];
		const hand = [];
		let card;
		const cardStats = new Array(3).fill(0);
		const cardMap = [];

		// card stats values
		// 0:s suits
		// 1:v card Number
		// 2:newCard  card
		for(card in arr) {
			const s = Math.ceil(arr[card] / 13) - 1;
			cardStats[0] = s;
			const v = arr[card] % 13;
			cardStats[1] = v;
			const newCard = `${cardValue[v]}${suits[s]}`;
			cardStats[2] = newCard;
			cards.push(newCard);
			hand.push(newCard);
			count[v]++;
			flush[s]++;
			straight.push(v);
			cardMap.push(cardStats);
		}

		function hasStraight(cardValues) {
			cardValues.sort((a, b) => a - b);
			for(let i = 0; i < (cardValues.length - 1); i++) {
				if((cardValues[i + 1] - cardValues[i]) != 1) return false;
			}
			return true;
		}

		pokerEmbed.addFields(
			{ name: 'Cards', value: `| ${hand[0]} | ${hand[1]} | ${hand[2]} | ${hand[3]} | ${hand[4]} | ` })
			.setFooter('Sponsored by big ralph industries');

		if(flush.indexOf(5) != -1 && hasStraight(straight)) {
			currency.add(message.author.id, args[0] * 5);
			pokerEmbed.addFields({ name: 'Congrats! You have a straight flush', value: `You won ${args[0] * 6} ralph bucks!💰💰💰` });
		}
		else if(flush.indexOf(5) != -1) {
			currency.add(message.author.id, args[0] * 3);
			pokerEmbed.addFields({ name: 'Congrats! You have a flush', value: `You won ${args[0] * 4} ralph bucks!💰💰💰` });
		}
		else if(hasStraight(straight)) {
			currency.add(message.author.id, args[0] * 3);
			pokerEmbed.addFields({ name: 'Congrats! You have a straight', value: `You won ${args[0] * 4} ralph bucks!💰💰💰` });
		}
		else if(count.indexOf(5) != -1) {
			currency.add(message.author.id, args[0] * 3);
			pokerEmbed.addFields({ name: 'Congrats! You have a five of a kind', value: `You won ${args[0] * 4} ralph bucks!💰💰💰` });
		}
		else if(count.indexOf(4) != -1) {
			currency.add(message.author.id, args[0] * 3);
			pokerEmbed.addFields({ name: 'Congrats! You have a four of a kind', value: `You won ${args[0] * 4} ralph bucks!💰💰💰` });
		}
		else if(count.indexOf(3) != -1) {
			currency.add(message.author.id, args[0] * 2);
			pokerEmbed.addFields({ name: 'Congrats! You have a three of a kind', value: `You won ${args[0] * 3} ralph bucks!💰💰💰` });
		}
		else if(count.indexOf(2) != -1) {
			if(count.indexOf(2, count.indexOf(2) + 1) != -1) {
				currency.add(message.author.id, args[0] * 1.5);
				pokerEmbed.addFields({ name: 'Congrats! You have two pair', value: `You won ${args[0] * 2.5} ralph bucks!💰💰💰` });
			}
			else{
				currency.add(message.author.id, args[0]);
				pokerEmbed.addFields({ name: 'Congrats! You have a pair', value: `You won ${args[0] * 2} ralph bucks!💰💰💰` });

			}
		}
		else{
			currency.add(message.author.id, -args[0]);
			pokerEmbed.addFields({ name: 'Dealer:', value: 'HA! you dont have shit!' });
		}

		message.channel.send(pokerEmbed);

	},
};