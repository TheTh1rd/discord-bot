const { CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'shop',
	description: 'Lists available items in the shop',
	guildOnly: true,
	args: false,
	async execute(message) {
		console.log('treecko');
		const items = await CurrencyShop.findAll();
		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
	},
};