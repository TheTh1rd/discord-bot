// required modules
const Discord = require('discord.js');
const fetch = require('node-fetch');
// load config values
const { prefix, discord_token, whois_token, alpha_token, OPENWEATHER_TOKEN } = require('./config.json');
// generate discord client
const client = new Discord.Client();

// user names
const dabears135 = '<@!209858147974643713>';
const dabears135F = '<@209858147974643713>';

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
	if (message.content.includes(dabears135) || message.content.includes(dabears135F)) {
		message.channel.send(` Hey ${message.author}, are you sure you want to summon ${dabears135}? We have looked at their chat history and user ${dabears135} is racist!`);
	}
	// dad joke
	const dad = message.content.match(/I'?’?‘?m\s+(\w+)/i);
	if (dad) {
		const son = message.content.split(/I'?’?‘?m\s+/i);
		message.channel.send(`Hey, ${son[1]}! I'm Ralph!`);
	}
	// proceeds if message starts with command prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	// parse command
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ralph') {
		// reply if !ralph was recieved
		message.channel.send(`Hi friend, here are my current commands: 
		!cat , gives a random cat picture.
		!server , server details.
		!domain <domain name> , checks domain availability.
		!stock <stock Symbol> , provides stock price.
		!weather <zip code> , returns weather forcast for given location.`);
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
	}
	else if(command === 'stock') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		// create domain availability url
		const baseurlA = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE';
		const urlA = baseurlA + '&symbol=' + args[0] + '&apikey=' + alpha_token;
		console.log(urlA);
		// fetch response
		try{
			const json_responseA = await fetch(urlA).then(response => response.json());
			console.log(json_responseA);
			const price = parseFloat(json_responseA['Global Quote']['05. price']).toFixed(2);
			// price = price.toFixed(2);
			const change = parseFloat(json_responseA['Global Quote']['10. change percent']).toFixed(2);
			// change = change.toFixed(2);
			message.channel.send(`The stock ${args[0]} current value is ${price}, a ${change} percent change today.`);
		}
		// catch error most commonly from invalid stock symbol
		catch(error) {
			console.log(error);
			message.reply(`${args[0]} is not a valid stock symbol.`);
		}
	}
	else if(command === 'weather') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		// create url
		const baseurlA = 'https://api.openweathermap.org/data/2.5/weather?';
		const urlA = `${baseurlA}zip=${args[0]},us&apikey=${OPENWEATHER_TOKEN}&units=imperial`;
		console.log(urlA);
		// fetch response
		try{
			const weatherResponse = await fetch(urlA).then(response => response.json());
			console.log(weatherResponse);
			const location = weatherResponse.name;
			const currentTemp = weatherResponse.main.temp.toFixed(0);
			const forecast = weatherResponse.weather[0].description;
			const high = weatherResponse.main.temp_max.toFixed(0);
			const low = weatherResponse.main.temp_min.toFixed(0);
			message.channel.send(`Weather forecast for ${location}:
			Current Temperature: ${currentTemp}°F
			Weather Condition: ${forecast}
			High: ${high}°F
			Low: ${low}°F
			`);
		}
		// catch error most commonly from invalid zip code
		catch(error) {
			console.log(error);
			message.reply(`${args[0]} is not a valid zip code.`);
		}
	}
});
