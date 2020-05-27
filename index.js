// required modules
const fs = require('fs');
const Discord = require('discord.js');
const fetch = require('node-fetch');
// load config values
const { prefix, discord_token } = require('./config.json');
// generate discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

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
	// checks for racism
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
	const commandName = args.shift().toLowerCase();
	// create command object and check for aliiases
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// check if command is allowed in DMs
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	// cooldowns to prevent spam

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}
	}
	else{
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
