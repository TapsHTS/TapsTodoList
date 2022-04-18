const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const filename = "todo.txt"
module.exports = {
    name: 'list',
    description: 'Affiche la list des choses à faire',
    aliases: ['todo', 'todolist', 'listtodo', 'tache'],
    usage: 'list <add/remove> <tache>',
    execute(message, args, client) {
        if (args[0] === 'add' || args[0] === 'create') {
            if (args[1] === undefined) {
                message.channel.send('Vous devez entrer une tache à faire !');
                //si la tache existe déjà on ne la crée pas
            } else if (fs.existsSync(filename)) {
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) throw err;
                    var todo = data.split('\n');
                    if (todo.includes(args.slice(1).join(' '))) {
                        message.channel.send('Cette tache existe déjà !');
                    } else {
                        fs.appendFile(filename, args.slice(1).join(' ') + '\n', function(err) {
                            if (err) throw err;
                            message.channel.send('Tache ajoutée !');
                        });
                    }
                });
            } else {
                let todo = args.slice(1).join(' ');
                fs.appendFile(filename, todo + '\n', (err) => {
                    if (err) throw err;
                    message.channel.send('Tache ajoutée !');
                });
            }
        } else if (args[0] === 'remove' || args[0] === 'del') {
            if (args[1] === undefined) {
                message.channel.send('Vous devez entrer une tache à supprimer !');
            } else {
                let todo = args.slice(1).join(' ');
                fs.readFile(filename, 'utf8', (err, data) => {
                    if (err) throw err;
                    let todos = data.split('\n');
                    let index = todos.indexOf(todo);
                    if (index === -1) {
                        message.channel.send('Tache introuvable !');
                    } else {
                        todos.splice(index, 1);
                        fs.writeFile(filename, todos.join('\n'), (err) => {
                            if (err) throw err;
                            message.channel.send('Tache supprimée !');
                        });
                    }
                });
            }
        } else if (args[0] === 'list' || args[0] === 'todo' || args[0] === 'show' || args[0] === 'l') {
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) throw err;
                if (!data) return message.channel.send('Aucune tache à faire !');
                let todos = data.split('\n');
                if (todos.length === 0) {
                    message.channel.send('Aucune tache à faire !');
                } else {
                    const embedList = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Liste des taches à faire:')
                        .setDescription(todos.map(todo => '- ' + `\`${todo}\``).join('\n'))
                        .setFooter({ text: process.env.BOT_NAME, iconURL: process.env.BOT_LOGO })
                    message.channel.send({ embeds: [embedList] });

                }
            });
        } else if (args[0] === "clear" || args[0] === "effacer") {
            fs.writeFile(filename, '', (err) => {
                if (err) throw err;
                message.channel.send('Toutes les taches ont été supprimées !');
            });
        }
    },
};
