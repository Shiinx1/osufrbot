const ping = require('node-http-ping')

async function renameAll(client, guild, nickgiven){
	guild.fetchMembers('', guild.memberCount)
	.then(function(Guild){
	Guild.members.forEach(function(members){
		members.setNickname(nickgiven);
		})
	})
}

async function mostLikedAvatar(client){
	var avatar_channel = client.guilds.get('650662490690289695').channels.find(c => c.id == '654006278842220548');
	var HighestTotal = 0;
	var HighestAuthor;
	var Total = 0;
	await avatar_channel.fetchMessages({ limit: 100 }).then(async msgs => {
		await msgs.forEach(async function(msg){
			if(msg.attachments.size > 0 && msg.content == '' && msg.reactions.size > 0){
				let Total = +msg.reactions.find(reaction => reaction.emoji.name == "❤️").count - 1;
				if(Total>HighestTotal){
					HighestTotal = Total;
					HighestAuthor = msg.author.username;
				}
			}
		})
	})
	await client.guilds.get('650662490690289695').channels.find(c => c.id == '650662491130560513').send(`L'avatar le plus liké est actuellement celui de ${HighestAuthor} avec ${HighestTotal} like.`);
}

async function cleanAvatarChannel(client){
	var avatar_channel = client.guilds.get('650662490690289695').channels.find(c => c.id == '654006278842220548');
	await avatar_channel.fetchMessages({ limit: 100 }).then(msgs => {
		msgs.forEach(function(msg){
			if(msg.attachments.size > 0){
				react(msg);
			}
		})
	})
	await avatar_channel.fetchMessages({ limit: 100 }).then(msgs => {
		msgs.forEach(function(msg){
			if(!msg.attachments.size > 0){
				msg.delete();
			}
		})
	})
}

async function main(client, data){
	setInterval(cleanAvatarChannel(client), 30000);
	if(cmdcheck(data) == true){
		let dcontent = data.content.toLowerCase();
		let args = dcontent.split(' ');
		switch ((args[0].replace('*', ''))){
			case 'help':
				data.channel.send('Commandes:\n`help, p4, test, ping, clear (adm only), rename (adm only)`')
				break;
			case 'test':
				data.channel.send('ça marche pas');
				break;
			case 'ping':
				ping('https://google.com')
					.then(time => data.channel.send(`${time}ms`))
				break;
			case 'p4':
				require("./games/p4/main.js")(client, data, args);
				break;
			case 'rename':
				if (!data.member.hasPermission('MANAGE_GUILD')){
					data.channel.send(`Vous devez être administrateur.`)
					break;
				}
				var mention = data.mentions.users.first();
				if (!mention && args[1] != '*'){
					data.channel.send(`Mentionnes quelqu'un ou utilise *`);
					break;
				}
				if (!data.content.includes("`")) {
					data.channel.send("Spécifie le nom à donner sous deux ` !");
					break;
				}
				var nickgiven = (data.content.split("`")[1]).replace("`", "");
				if (mention) {
					member = data.guild.member(mention);
					member.setNickname(nickgiven);
					data.channel.send(`Successfuly renamed.`)
					break;
				}
				if (args[1] == '*'){
					data.channel.send(`This might take a bit of time, please wait.`);
					await renameAll(client, data.guild, nickgiven);
					break;
				}
				break;
			case 'clear':
				if (!data.member.hasPermission('MANAGE_GUILD')){
					data.channel.send(`Vous devez être administrateur.`)
					break;
				}

				if (args[1] == ''){
					data.channel.send(`Please specify an amount.`)
					break;
				}

				if (args[1] > 100){
					data.channel.send('Amount must be below or equal to 100.')
					break;
				}

				await data.channel.fetchMessages({limit:args[1]}).then(messages => {
					data.channel.bulkDelete(messages);
				});
				await data.delete();
				break;
			case 'sv_avatar':
				if (data.guild.id != '650662490690289695'){
					data.channel.send(`Cette fonctionnalité est restreinte à osu!fr.`)
					break;
				}

				await mostLikedAvatar(client);
				break;
		}
	}

}

function cmdcheck(data){
	if(data.content.split(' ')[0].startsWith('*')){
		return true;
	} else {
		return false;
	}
}

function isGhostping(client, data) {
  	if (data.mentions.users.first() != undefined && !data.author.bot && !data.mentions.users.first().bot && data.mentions.users.first().id != client.user.id && data.author.id != client.user.id){
  		return true;
  	} else {
  		return false;
  	}
}

function react(input) {
	input.react("❤️");
}


module.exports = main;