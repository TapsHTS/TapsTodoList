const Discord = require('discord.js');
const client = new Discord.Client({
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    shards: "auto",
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});
const fs = require('fs');
const prefix = '!';
client.commands = new Discord.Collection();

//Create a folder named 'commands' in root
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command, command.description);
    console.log('[✔️  ] ' + command.name);
}

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(x => x.aliases && x.aliases.includes(cmd));

    if (command) command.execute(message, args, client);
    else return;
});

client.on('ready', () => {
    console.log(`${client.user.username} is online !`);
    client.user.setStatus('idle');
    client.user.setActivity("les choses à faires", { type: 'WATCHING' });
});

client.login('OTY1NTU1NzQyNTE2MDcyNDQ5.Yl053A.I5yqVN-e72qv315e0v2QeR-yR8I');