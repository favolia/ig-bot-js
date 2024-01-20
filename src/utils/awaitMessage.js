const Insta = require("node-ig-framework");

/**
 * @typedef {Object} awaitMessageOptions
 * @property {Number} [timeout] - The time in milliseconds to wait for a message.
 * @property {Number} [chatID] - The chat ID to wait for, where the message is expected.
 * @property {Number} [authorID] - The user ID to wait for, representing the account that is expected to send the message.
 * @property {Function} [filter] - The filter function used to determine if a message meets the criteria.
 */

/**
 * Asynchronously waits for a specific message based on the provided options.
 *
 * @param {Insta.Client} client - The Instagram client instance.
 * @param {awaitMessageOptions} options - The options specifying the conditions for waiting for a message.
 * @returns {Promise<Insta.Message>} - A Promise resolving to the awaited message.
 */
async function awaitMessage(client, options = {}) {
    return new Promise((resolve, reject) => {
        if (typeof options !== 'object') reject(new Error('Options must be an object'));
        if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
        if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));

        const timeout = options?.timeout || undefined;
        const filter = options?.filter || (() => true);
        let timeoutId = undefined;

        /**
         * Listener function for message creation events.
         *
         * @param {Insta.Message} msg - The message object.
         */
        const listener = (msg) => {
            if (
                (!options.chatID || msg.chatID === options.chatID) &&
                (!options.authorID || msg.authorID === options.authorID) &&
                filter(msg)
            ) {
                clearTimeout(timeoutId);
                client.off('messageCreate', listener);
                resolve(msg);
            }
        };

        client.on('messageCreate', listener);

        if (timeout) {
            timeoutId = setTimeout(() => {
                client.off('messageCreate', listener);
                reject(new Error('Timeout'));
            }, timeout);
        }
    });
}

// Example usage:
// const result = await awaitMessage(client, { chatID: yourChatID, authorID: yourAuthorID, timeout: 10000 });

module.exports = awaitMessage;
