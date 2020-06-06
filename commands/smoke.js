const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'smoke',
	description: 'light it up',
	guildOnly: true,
	args: false,
	async execute(message) {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const item = await CurrencyShop.findOne({ where: { name: 'Weed' } });
		console.log('lighting');
		const doIt = await user.useItem(item);
		if(!doIt) {
			console.log('no item');
			return message.reply('You dont have any weed to smoke');
		}
		message.channel.send('*cough* *cough* thats some good stuff');
	},
};