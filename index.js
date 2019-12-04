const { Client, RichEmbed } = require('discord.js')
const info = require('./config.json')
const express = require('express')
const http = require('http')

const app = express()
app.get(`/`, (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const bot = new Client()

const wait = time => new Promise(res => setTimeout(res, time))

bot.on('guildMemberAdd', async member => {
    const channel = bot.channels.get(info.channelID)
    if (!channel) {
        console.error(`No channel with ID ${info.channelID} found! Exiting...`)
        process.exit(1)
    } else {
        // Waits a second. This is needed for all information to process after message.guild.members.someone joining.
        await wait(1000)
        const date = member.user.createdAt
        const diff = new Date() - date
        const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
        const roles = member.roles.filter(x => x.id !== member.guild.id)
        const embed = new RichEmbed()
            .setAuthor(member.user.username, member.user.avatarURL)
            .setDescription(`<@${member.id}> ${diffDays <= 30 ? `**This user's account does not reach the 30 day limit.**` : ``}`)
            .addField(`Joined`, member.joinedAt.toUTCString(), true)
            .addField(`Registered`, member.user.createdAt.toUTCString(), true)
            .addField(`Roles [${roles.size}]`, roles.map(x => `<@&${x.id}>`).join(', '), true)
            .setThumbnail(member.user.avatarURL)
            .setFooter(`ID: ${member.id}`)
            .setTimestamp()
        await channel.send(embed)
    }
})

bot.on('message', async message => {
    const args = message.content.split(/ +/gi).slice(1);
    if (message.content.startsWith(`>whois`)) {
        let member
        if (message.mentions.members.first()) {
            member = message.mentions.members.first()
        } else if (args.length) {
            const name = args.join(` `)
            if (message.guild.members.some(x => x.nickname && x.nickname.toLowerCase() === name.toLowerCase())) {
                member = message.guild.members.find(x => x.nickname && x.nickname.toLowerCase() === name.toLowerCase())
            } else if (message.guild.members.some(x => x.user.username.toLowerCase() === name.toLowerCase())) {
                member = message.guild.members.find(x => x.user.username.toLowerCase() === name.toLowerCase())
            } else if (message.guild.members.has(name.toLowerCase())) {
                member = message.guild.members.get(name.toLowerCase())
            } else if (message.guild.members.some(x => x.user.tag.toLowerCase() === name.toLowerCase())) {
                member = message.guild.members.find(x => x.user.tag.toLowerCase() === name.toLowerCase()) 
            } else {
                await message.reply(`no user found.`)
                return
            }
        } else {
            await message.reply(`you must provide a user.`)
        }
        const date = member.user.createdAt
        const diff = new Date() - date
        const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
        const roles = member.roles.filter(x => x.id !== member.guild.id)
        const embed = new RichEmbed()
            .setAuthor(member.user.username, member.user.avatarURL)
            .setDescription(`<@${member.id}> ${diffDays <= 30 ? `**This user's account does not reach the 30 day limit.**` : ``}`)
            .addField(`Joined`, member.joinedAt.toUTCString(), true)
            .addField(`Registered`, member.user.createdAt.toUTCString(), true)
            .addField(`Roles [${roles.size}]`, roles.map(x => `<@&${x.id}>`).join(', '), true)
            .setThumbnail(member.user.avatarURL)
            .setFooter(`ID: ${member.id}`)
            .setTimestamp()
        await message.channel.send(embed)
    }
})

bot.login(info.token).then(console.log('Logged in.'))