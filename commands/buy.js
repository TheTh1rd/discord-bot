const { Users, CurrencyShop } = require('../dbObjects');
const { currency, Op } = require('../index.js');
module.exports = {
	name: 'buy',
	description: 'buys 1 of specified item',
	usage: '<item name>',
	guildOnly: true,
	args: true,
	async execute(message, args) {
		console.log('torchic');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[0] } } });
		if (!item) return message.channel.send('That item doesn\'t exist. Please use !buy <item Name>');
		if (item.cost > currency.getBalance(message.author.id)) {
			return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
		}
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		currency.add(message.author.id, -item.cost);
		await user.addItem(item);

		message.channel.send(`You've bought: ${item.name}.`);
	},
};