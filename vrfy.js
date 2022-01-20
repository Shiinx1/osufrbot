const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
client.login(config.token);

const Channels = ['469603172676272148','469603233514651648','469603216565207040','469603840841482252','469603824705732619','469603799624056843','469603247233957893','469603267828252672','469603859568918538','469603894301818881'];

client.on('ready', () => {
console.log('Bot is ready!');
FixEvery5M();
setInterval(Reconnect1H, 3600000);
GameBar();
setInterval(GameBar, 30000);
setInterval(FixEvery5M, 900000);
})

function Reconnect1H(){
	client.destroy();
	client.login(config.token);
}

function adminVI(){
	for(i in Channels){
		let Channel = client.guilds.get('469595261468147732').channels.find(channels => channels.id == Channels[i]);
		verifyImages(Channel);
		}
}

function FixEvery5M(){
	for(i in Channels){
		let Channel = client.guilds.get('469595261468147732').channels.find(channels => channels.id == Channels[i]);
		fixChannel(Channel);
		cleanChannel(Channel);
		}
}

function verifyImages(Channel){
	Channel.fetchMessages({ limit: 100 }).then(msgs => {
				msgs.forEach(function(msg){
					if(msg.attachments.size > 0){
				let argsM = msg.createdAt.toString().split(" ");
				let dateObj = new Date();
				let n = dateObj.getUTCDate();
				if(+argsM[2]+7 > 29){
					var jours = n + ( 29 - +argsM[2]);
					} else {
					var jours = n - +argsM[2];
				}
				 if(jours > 2){
					let NbZero = +msg.reactions.find(reaction => reaction.emoji.id == "469736145224204298").count - 1;
					let NbVingt = +msg.reactions.find(reaction => reaction.emoji.id == "469736164639637504").count - 1;
					let NbQuarante = +msg.reactions.find(reaction => reaction.emoji.id == "469736177981718535").count - 1;
					let NbSoixante = +msg.reactions.find(reaction => reaction.emoji.id == "469736192007471111").count - 1;
					let NbQuatrevingt = +msg.reactions.find(reaction => reaction.emoji.id == "469736204514885644").count - 1;
					let NbCent = +msg.reactions.find(reaction => reaction.emoji.id == "469736216494080001").count - 1;
					let Total = NbZero+NbVingt+NbQuarante+NbSoixante+NbQuatrevingt+NbCent;
					let TotalValeur = (NbZero)+(NbVingt*20)+(NbQuarante*40)+(NbSoixante*60)+(NbQuatrevingt*80)+(NbCent*100);
					let Moyenne = TotalValeur/Total;
					console.log("Moyenne: "+Moyenne);
					if(Moyenne < 60){
						msg.delete();
					}
					}
                } else {
                    msg.delete();
					}
				})
			})
}

function fixChannel(Channel){
	Channel.fetchMessages({ limit: 100 }).then(msgs => {
				msgs.forEach(function(msg){
					if(msg.attachments.size > 0){
						react(msg);
					}
				})
	})
}

function cleanChannel(Channel){
	Channel.fetchMessages({ limit: 100 }).then(msgs => {
				msgs.forEach(function(msg){
					if(!msg.attachments.size > 0){
						msg.delete();
					}
				})
	})
}

function GameBar(){
    client.user.setPresence({
        game: {
            name: "Adding reactions / "+client.users.size+" users on HFR!",
            type: 0
        }
    });
}

client.on('message', (msg) => {
	if(msg.content == "/help"){
		msg.channel.send('Available commands: help, fix,  vi, adminvi');
	}
	if(Channels.includes(msg.channel.id)){
	if (msg.attachments.size > 0) {
            react(msg);
				}
		if(msg.content == "/fix"){
			if(msg.member.hasPermission('ADMINISTRATOR')){
				msg.delete();
				msg.channel.fetchMessages({ limit: 100 }).then(msgs => {
				msgs.forEach(function(msg){
					if(msg.attachments.size > 0){
						react(msg);
					} else {
						msg.delete();
					}
				})
				})
			}
		}
	if(msg.member.hasPermission('ADMINISTRATOR')){
    if(msg.content == "/vi"){
			verifyImages(msg.channel);
			}
		if(msg.content == "/adminvi"){
			adminVI();
			}
		} else {
			msg.channel.send("You don't have the permission to execute that command!");
			}
		}
})

function react(input) {
	input.react("469736145224204298")
	.catch()
	.then( () => 
	input.react("469736164639637504"))
	.catch()
	.then( () =>
	input.react("469736177981718535"))
	.catch()
	.then( () =>
	input.react("469736192007471111"))
	.catch()
	.then( () =>
	input.react("469736204514885644"))
	.catch()
	.then( () =>
	input.react("469736216494080001"));
}