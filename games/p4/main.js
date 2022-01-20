var game_logic = require('./utils.js');

async function main(client, data, args){
	// Joueurs
	var player1 = data.author;
	var mention = data.mentions.users.first();
	if (!mention || mention == player1) return data.channel.send(`Mentionnes quelqu'un!`);
	else { var player2 = mention; }

	// Validation
	var started = false;
	var canceled = false;
	data.channel.send({ embed: {color: 0xFFFF6F, description: `${client.emojis.find(emoji => emoji.id === "637409257624567808")} pour oui, ${client.emojis.find(emoji => emoji.id === "637409112958959617")} pour non.`, title: `${player2.username}, voulez-vous faire un puissance 4 avec ${player1.username} ?`}}).then(async embedMessage => {
    await embedMessage.react(client.emojis.find(emoji => emoji.id === "637409257624567808"));
    await embedMessage.react(client.emojis.find(emoji => emoji.id === "637409112958959617"));
    client.on("messageReactionAdd", async (reaction, user) => {
		if (reaction.emoji.id == "637409112958959617" && !started && !canceled && user.id != client.user.id && user.id == player1.id || reaction.emoji.id == "637409112958959617" && !started && !canceled && user.id != client.user.id && user.id == player2.id){
			embedMessage.edit({ embed: {color: 0xFFFF6F, description: `Demande refusée ou annulée par ${user.username}.`, title: `Puissance 4 annulé.`}})
    		canceled = true;
			setTimeout(function() {
				embedMessage.delete();
			}, 3000);
   		}
    	if (reaction.emoji.id == "637409257624567808" && !canceled && user.id != client.user.id && !started && user.id == player2.id){
    		started = true;
    		canceled = true;
    		// remove all reactions
    		let players = [player1, player2];
    		let turn = players[Math.floor(Math.random()*players.length)];;
    		let re = '🔴';
    		let bl = '🔵';
    		let wh = '⬛';
    		let board =[[wh,wh,wh,wh,wh,wh,wh],
						[wh,wh,wh,wh,wh,wh,wh],
						[wh,wh,wh,wh,wh,wh,wh],
						[wh,wh,wh,wh,wh,wh,wh],
						[wh,wh,wh,wh,wh,wh,wh],
						[wh,wh,wh,wh,wh,wh,wh]];
			let visualboard = `${board[0]}\n${board[1]}\n${board[2]}\n${board[3]}\n${board[4]}\n${board[5]}`;
			while (visualboard.includes(',')){
				visualboard = visualboard.replace(',', '');
			}
			embedMessage.edit({ embed: {color: 0xFFFF6F, description: `Tour de: ${turn}\n${visualboard}`, title: `Puissance 4: ${player1.username} vs ${player2.username}.`}})
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "one"));
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "two"));
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "three"));
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "four"));
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "five"));
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "six"));
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "seven"));
			await embedMessage.react(client.emojis.find(emoji => emoji.name === "x"));
    		}
    	})
	})
}

module.exports = main;