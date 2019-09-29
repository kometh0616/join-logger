const { Client, RichEmbed } = require('discord.js')
const info = require('./config.json')

const bot = new Client()

const wait = time => new Promise(res => setTimeout(res, time))

bot.on('guildMemberAdd', async member => {
    const channel = bot.channels.get(info.channelID)
    if (!channel) {
        console.error(`No channel with ID ${info.channelID} found! Exiting...`)
        process.exit(1)
    } else {
        // Waits a second. This is needed for all information to process after someone joining.
        await wait(1000)
        const roles = member.roles.filter(x => x.id !== member.guild.id)
        const embed = new RichEmbed()
            .setAuthor(member.user.username, member.user.avatarURL)
            .setDescription(`<@${member.id}>`)
            .addField(`Joined`, member.joinedAt.toUTCString(), true)
            .addField(`Registered`, member.user.createdAt.toUTCString(), true)
            .addField(`Roles [${roles.size}]`, roles.map(x => `<@&${x.id}>`).join(', '), true)
            .addField(`Join position`, member.guild.memberCount - member.guild.members.filter(x => x.user.bot).size, true)
            .setThumbnail(member.user.avatarURL)
            .setFooter(`ID: ${member.id}`)
            .setTimestamp()
        await channel.send(embed)
    }
})

bot.login(info.token).then(console.log('Logged in.'))