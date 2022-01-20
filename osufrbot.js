// heroku part
const express = require('express');
const http = require("http");
const path = require('path');
const app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/static/index.html'));
})

app.listen(process.env.PORT, function () {
	console.log('heroku is on')
})

// bot part
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	// ping every 5m
	setInterval(function() {
    http.get("http://osufrbot.herokuapp.com");
	}, 300000); // every 5 minutes (300000

	console.log(`Osufrbot est en ligne.`);
	client.user.setActivity(`${client.users.size} users | *help`, { type: ``})
	client.guilds.get("650662490690289695").fetchMembers('', client.guilds.get("650662490690289695").memberCount)
    	.then(function(Guild){
    		Guild.members.forEach(function(members){
            	if (isVerified(members) == 'no'){
            		members.send("Bienvenue sur le serveur osu!fr, créé et géré par Sohii#4897 et Ayato#3036.\nAfin de procéder à votre vérification sur le serveur, ayez le 'Game Activity' d'activé, puis lancez osu.\nVous serez automatiquement vérifié, si vous avez besoin d'aide, renvoyez un message.");
            	}
			})
    	})
});

function isGhostping(data) {
  	if (data.mentions.users.first() != undefined && !data.author.bot && !data.mentions.users.first().bot && data.mentions.users.first().id != client.user.id && data.author.id != client.user.id){
  		return true;
  	} else {
  		return false;
  	}
}

client.on("messageDelete", (data) => {
	if (isGhostping(data)) {
		return data.channel.send(`<@!${data.author.id}> ghostpinged <@!${data.mentions.users.first().id}>`);
	};
})

function isVerified(user){
	gosu = client.guilds.get("650662490690289695");
	gmember = gosu.member(user);
	if (gmember){
		if (gmember.roles.size > 1) {
			return 'yes'
		} else {
			return 'no'
		}
	} else {
		return 'left'
	}
}

function verifyStatus(user, presence){
	if (presence.game != null || presence.game != null){
		if (presence.game.name.toString().toLowerCase() == 'osu!'){
			if (presence.game.type != null){
				if (presence.game.url == null){
					if (presence.game.state != null && presence.game.state == 'Idle' || presence.game.state == 'Looking for a beatmap' || presence.game.state == 'AFK' || presence.game.state == 'Modding a beatmap' || presence.game.state == 'Clicking circles' || presence.game.state == 'Catching fruit'|| presence.game.state == 'Smashing keys' || presence.game.state == 'Bashing drums' ){
						if (presence.game.applicationID != null && presence.game.applicationID == '367827983903490050'){
							if (presence.game._flags == undefined || presence.game._flags){
								if (presence.game.syncID == undefined || presence.game.syncID){
									if (presence.game.assets){
										if (presence.game.assets.largeImage && presence.game.assets.smallImage){
											if (presence.game.assets.largeImage == '373344233077211136') {
												smallModeImages = ['373370493127884800', '373370543161999361', '373370588703621136', '373370519891738624'];
												if (smallModeImages.includes(presence.game.assets.smallImage)){
													return 'legit';
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

function updateUserRoles(assets, gmember, gosu){
	//userRoles = Array.from(gmember.roles);
	//userRoles.forEach(function (roole){
	//var raules = ['adm', 'BOT', 'RPU (Rich Presence Unavailable)', 'Admirable','@everyone'];
	//if (raules.includes(roole[1].name.toString().toLowerCase())){
	//	return;
	//} else {
	//	gmember.removeRole(gosu.roles.find(role => role.name === (roole[1].name.toString()))).catch(err => console.log(err));
	//	}
	//})
	addUserRoles(assets, gmember, gosu);
}

function addUserRoles(assets, gmember, gosu){
	if (assets.largeText && assets.largeText.includes('(')){
		rawgdigit = assets.largeText.split('(')[1].replace('rank #', '');
		gdigit = rawgdigit.substring(0, rawgdigit.length - 1).replace(',', '');
		gmember.addRole(gosu.roles.find(role => role.name === (gdigit.length + ' [Digit]'))).catch(err => console.log(err));
		//gmember.setNickname(gdigit.length + '-' + gmember.user.username).catch(err => console.log(err));
	}
}
client.on('guildMemberAdd', member => {
    member.send("Bienvenue sur le serveur osu! [FR], créé et géré par Sohii#4897 & Ayato#3036.\nAfin de procéder à votre vérification sur le serveur, ayez le 'Game Activity' d'activé, puis lancez osu.\nVous serez automatiquement vérifié, si vous avez besoin d'aide, renvoyez un message.")
});

client.on('message', msg => {
	if (msg.channel.type === 'dm') {
		auth = msg.author;

		if (auth.bot) return;
		if (msg.content.toLowerCase() == '!aide') {
			auth.send("https://i.imgur.com/BPFypdB.png");
			auth.send("https://i.imgur.com/tyBe6H9.png");
			auth.send("https://i.imgur.com/cEoQVk9.png");
			auth.send("Après ça, lancez juste osu! sur votre compte.")
		} else {
			if (isVerified(auth.id) == 'yes'){
				auth.send("Vous êtes déjà vérifié.");
			} else if (isVerified(auth.id) == 'left') {
				auth.send("Vous n'êtes pas dans le serveur. Voici une invitation: https://discord.gg/Ax2aWNu")
			} else {
				auth.send("Tapez !aide pour obtenir de l'aide avec le 'Game Activity' pour votre vérification.\nSi il est déjà actif sur votre discord, lancez juste osu et vous serez vérifié.");
			}
		}
	} else {
		require("./MainHandler.js")(client, msg);
	}
});

client.on('presenceUpdate', (userOld, userNew) => {
	gosu = client.guilds.get("650662490690289695");
	if (verifyStatus(userNew, userNew.presence) == 'legit'){
		gmember = gosu.member(userNew);
		gmember.addRole(gosu.roles.find(role => role.name === 'Admirable'));
		if (userNew.presence.game.assets) {
			assets = userNew.presence.game.assets;
			updateUserRoles(assets, gmember, gosu);
		}
	}
});

client.login(process.env.secret);