// required modules
const Discord = require('discord.js');
const fetch = require('node-fetch');
// load config values
const { prefix, discord_token, whois_token } = require('./config.json');
// generate discord client
const client = new Discord.Client();

// user names
const dabears135 = '<@!209858147974643713>';

// runs after client is ready
// display bootup message
client.once('ready', () => {
	console.log('Ready!');
});
// login to discord bot
client.login(discord_token);
// when message recieved
client.on('message', async message => {
	console.log(message.content);
	// ignore bot messages
	if (message.author.bot) return;
	if (message.content.includes(dabears135)) {
		message.channel.send(`We have searched the NSA database and ${dabears135} is racist!`);
	}
	// proceeds if message starts with command prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	// parse command
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ralph') {
		// reply if !ralph was recieved
		message.channel.send('Hi friend, here are my current commands: \n!cat\n!server\n!domain');
	}
	else if (command === 'server') {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	}
	else if (command === 'args-info') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		message.channel.send(`Command name: ${command}\nArguments: ${args}`);
	}
	else if (command === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);
	}
	else if (command === 'domain') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		// create domain availability url
		const baseurl = 'https://domain-availability.whoisxmlapi.com/api/v1?';
		const url = baseurl + 'apikey=' + whois_token + '&domainName=' + args[0];
		console.log(url);
		// fetch response
		const json_response = await fetch(url).then(response => response.json());
		const domainName = json_response.DomainInfo.domainName;
		const domainAvailability = json_response.DomainInfo.domainAvailability;
		message.channel.send(`The domain ${domainName} is ${domainAvailability} to register.`);
	}
});
