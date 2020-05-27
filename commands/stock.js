const fetch = require('node-fetch');
const { alpha_token } = require('../config.json');
module.exports = {
	name: 'stock',
	description: 'checks stock price',
	ussage: '<stock symbol>',
	args: true,
	guildOnly: true,
	async execute(message, args) {
		// create domain availability url
		const baseurlA = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE';
		const urlA = baseurlA + '&symbol=' + args[0] + '&apikey=' + alpha_token;
		// fetch response
		try{
			const json_responseA = await fetch(urlA).then(response => response.json());
			const price = parseFloat(json_responseA['Global Quote']['05. price']).toFixed(2);
			// price = price.toFixed(2);
			const change = parseFloat(json_responseA['Global Quote']['10. change percent']).toFixed(2);
			// change = change.toFixed(2);
			message.channel.send(`The stock ${args[0]} current value is $${price}, a ${change} percent change today.`);
		}
		// catch error most commonly from invalid stock symbol
		catch(error) {
			message.reply(`${args[0]} is not a valid stock symbol.`);
		}
	},
};