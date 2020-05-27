module.exports = {
	name: 'weather',
	description: 'provides weather forecast',
	args: true,
	usage: '<zipcode>',
	async execute(message, args) {
		const fetch = require('node-fetch');
		const { OPENWEATHER_TOKEN } = require('../config.json');
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
	},
};