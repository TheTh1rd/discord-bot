// required modules
const fs = require('fs');
const Discord = require('discord.js');
const { Op } = require('sequelize');

// load config values
const { prefix, discord_token } = require('./config.json');
// generate discord client
const client = new Discord.Client();
// shop items
const { Users, CurrencyShop } = require('./dbObjects');
const currency = new Discord.Collection();

// import commands
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

// helper functions for currency collection
Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

// runs after client is ready
client.once('ready', async () => {
	// sync database
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
});

// login to discord bot
client.login(discord_token);
// when message recieved
client.on('message', async message => {
	console.log(message.content);
	// ignore bot messages
	if (message.author.bot) return;
	// give user 1 monies per message
	currency.add(message.author.id, 1);


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
	console.log(commandName);
	// create command object and check for aliiases
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


	// for eddie to convert
	if (commandName === 'balance') {
		console.log('we in this bish');
		const target = message.mentions.users.first() || message.author;
		return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	}
	else if (commandName === 'inventory') {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
	}
	else if (commandName === 'transfer') {
		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = message.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
		if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
	}
	else if (commandName === 'buy') {
		console.log(args);
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[0] } } });
		if (!item) return message.channel.send('That item doesn\'t exist. Please use !buy <item Name>');
		if (item.cost > currency.getBalance(message.author.id)) {
			return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
		}

		const user = await Users.findOne({ where: { user_id: message.author.id } });
		currency.add(message.author.id, -item.cost);
		await user.addItem(item);

		message.channel.send(`You've bought: ${item.name}.`);
	}
	else if (commandName === 'shop') {
		const items = await CurrencyShop.findAll();
		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
	}
	else if (commandName === 'leaderboard') {
		return message.channel.send(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.get(user.user_id).tag)}: ${user.balance}💰`)
				.join('\n'),
			{ code: true },
		);
	}


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
	// prevents spamming commands
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


	// run command
	try {
		if(command.name == 'smoke') {
			const target = message.mentions.users.first() || message.author;
			const user = await Users.findOne({ where: { user_id: target.id } });
			const item = await CurrencyShop.findOne({ where: { name: 'Weed' } });
			console.log('lighting');
			const doIt = await user.useItem(item);
			if(!doIt) {
				console.log('no item');
				return message.reply('You dont have any weed to smoke');
			}
		}
		command.execute(message, args, currency);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
