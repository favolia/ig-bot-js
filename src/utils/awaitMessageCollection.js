let count = 1
const awaitMessageCollection = ({ bot, ms = 5000 }, onMessage, endMessage) => {
    const collector = bot.createMessageCollector({
        filter: (m) => m.authorID === bot.authorID,
        idle: ms
    })

    if (onMessage && typeof onMessage == "function") {
        collector.on('message', async (m) => {
            await onMessage(m)
        })
    }

    if (endMessage && typeof endMessage == "function") {
        collector.on('end', (reason) => {
            if (reason === 'idle') {
                endMessage(reason)
            }
        })
    }
}

module.exports = awaitMessageCollection;