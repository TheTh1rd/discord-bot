module.exports = {
	name: 'domain',
	description: 'checks domain availability',
	args: true,
	guildOnly: true,
	async execute(message, args) {
		const fetch = require('node-fetch');
		const { whois_token } = require('../config.json');
		// create domain availability url
		const baseurl = 'https://domain-availability.whoisxmlapi.com/api/v1?';
		const url = baseurl + 'apikey=' + whois_token + '&domainName=' + args[0];
		console.log(url);
		try{
			// fetch response
			const json_response = await fetch(url).then(response => response.json());
			const domainName = json_response.DomainInfo.domainName;
			const domainAvailability = json_response.DomainInfo.domainAvailability;
			message.channel.send(`The domain ${domainName} is ${domainAvailability} to register.`);
		}
		catch (error) {
			message.reply('Please submit a valid domain');
		}
	},
};