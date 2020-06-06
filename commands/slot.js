const { Users } = require('../dbObjects');
const { currency } = require('../index.js');
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
module.exports = {
	name: 'slot',
	description: 'slots game',
	usage: '<amount to bet>',
	aliases: ['slots', 'gamble'],
	guildOnly: true,
	args: true,
	async execute(message, args) {
		console.log('diglet');
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const balance = await currency.getBalance(message.author.id);
		console.log(`balance ${balance}`);
		const reg = new RegExp('^\\d+$');
		if(!reg.test(args[0])) {
			return message.reply('Please enter a valid amount!\nPlease use !help to get a list of commands.');
		}
		if(args[0] > balance) {
			return message.reply('You do not have enough money to bet that much!');
		}
		console.log(args[0]);
		console.log(balance);
		const icons = ['🎲', '💸', '💰'];
		const slot1 = getRandomInt(3);
		const slot2 = getRandomInt(3);
		const slot3 = getRandomInt(3);
		// const slots = [icons[slot1], icons[slot2], icons[slot3]];

		const response = [];
		response.push(`entered ${args[0]} ralph bucks!`);
		response.push('-----------------');
		response.push(`<|${icons[(slot1 + 2) % 3]}|${icons[(slot2 + 1) % 3]}|${icons[(slot3 + 2) % 3]}|>`);
		response.push(`>|${icons[slot1]}|${icons[slot2]}|${icons[slot1]}|<`);
		response.push(`<|${icons[(slot1 + 1) % 3]}|${icons[(slot2 + 2) % 3]}|${icons[(slot3 + 1) % 3]}|>`);
		response.push('-----------------');
		if(slot1 == slot2 && slot1 == slot3) {
			currency.add(message.author.id, args[0] * (slot1 + 1) * 5);
			response.push(`Congrats you won ${args[0] * (slot1 + 1) * 5} ralph bucks!💰💰💰`);
			return message.reply(response.join('\n'));
		}
		else{
			currency.add(message.author.id, -args[0]);
			response.push('Sorry you lost :cry:');
			return message.reply(response.join('\n'));
		}
	},
};