module.exports = {
	name: 'ralph',
	description: 'shows ralphs commands',
	execute(message, args) {
		message.channel.send(`Hi friend, here are my current commands: 
		!cat , gives a random cat picture.
		!server , server details.
		!domain <domain name> , checks domain availability.
		!stock <stock Symbol> , provides stock price.
		!weather <zip code> , returns weather forcast for given location.`);	},
};