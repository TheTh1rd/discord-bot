module.exports = {
	name: 'ralph',
	description: 'shows ralphs commands',
	guildOnly: true,
	execute(message, args) {
		message.author.send(`	Hey how you doin' lil' mama let me whisper in ya ear
		Tell ya somethin' that ya might like to hear
		Got a sexy ass body and ya ass look soft
		Mind if I touch it to see if it's soft
		Nah, I’m just playin' ‘less you say I can
		And I'm known to be a real nasty man
		And they say a closed mouth don't get fed
		So I don't mind askin' fo' head
		Ya heard what I said
		We need to make our way to the bed
		You can start usin' ya head
		Ya like to fuck, have ya legs open all in the buck
		Do it up, slappin' ass, gurl the sex get rough
		Switch position and let the dick get down to business
		So you can see what you been missin'
		You might had some, but you never had none like this
		Just wait til' you see my dick (Oooooooo!!!)`);
		message.channel.send(`Hi friend, here are my current commands: 
		!cat , gives a random cat picture.
		!server , server details.
		!domain <domain name> , checks domain availability.
		!stock <stock Symbol> , provides stock price.
		!weather <zip code> , returns weather forcast for given location.`);
	},
};