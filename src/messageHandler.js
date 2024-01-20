const getCommand = require("./libs/getCommand");
const Insta = require("node-ig-framework");
const { spotifySearchMusic, spotifyFetchURL } = require("./libs/spotify");
const awaitMessage = require("./utils/awaitMessage.js");

/**
 * Handles incoming messages.
 * 
 * @param {Object} options - Options for the message handler.
 * @param {Insta.Client} options.client - The Instagram client instance.
 * @param {Insta.Message} options.bot - The message object.
 * @returns {Promise<void>} - A Promise indicating the completion of message handling.
 */
const messageHandler = async ({ client, bot }) => {
    if (bot.author.id === client.user.id) return;

    const {
        content
    } = bot;

    const reply = (txt) => bot.reply(txt);

    const waitMsg = async () => {
        let _getMsg = await awaitMessage(client, {
            chatID: bot.chatID,
            authorID: bot.authorID,
            filter: (parm) => parm || '',
        })
        return _getMsg.content || ''
    }

    const { command, q } = getCommand({ msg: content });

    switch (command) {
        case "menu": case "help": {
            reply(`/ping\n/spotify`)
        }
        case "p": case "ping": {
            reply("Pong!")
        } break;
        case "spotify": {
            if (!q) return reply(`Tambahkan judul lagu\ncontoh: /${command} crying city - urn.`)
            reply('mencari🔍...')
            const spotify = await spotifySearchMusic(q)
            if (!spotify.status) return reply(spotify.data);

            reply(`${spotify.data}\n\nPilih lagu sesuai angka, contoh: 1`)

            const newMsg = await waitMsg()

            if (!spotify?.musicIndex?.includes(Number(newMsg))) return reply("Pilihan tidak ditemukan");
            const selectedMusic = spotify.musicList[Number(newMsg) - 1]
            reply(`${selectedMusic.title}` + ' | Proses, mohon tunggu... ')

            const musicData = await spotifyFetchURL(selectedMusic.url)
            await bot.chat.sendPhoto(musicData?.metadata?.cover)
                .catch(err => reply("Terjadi kesalahann saat mengambil thumbnail lagu."))
            await reply(`${musicData?.metadata?.artists} - ${musicData?.metadata?.title}\n\nalbum: ${musicData?.metadata?.album}\nreleased: ${musicData?.metadata?.releaseDate}`)
            reply(musicData.link)

        } break;

        default:
            if (command != '') {
                reply(`Maaf command [${command}] tidak tersedia.`)
            }
            break;
    }

};



module.exports = messageHandler;