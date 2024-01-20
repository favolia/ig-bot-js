const getCommand = ({ msg }) => {
    const prefixRegex = /^[°•π÷×¶∆£¢€¥®™✓=|~`,*zxcv!?@#$%^&.\/\\©^]/;
    const prefix = prefixRegex.test(msg) ? msg.match(prefixRegex)?.[0] || '-' : '-';
    const commands = msg.startsWith(prefix) ? msg.replace(prefix, '') : '';
    const command = commands.toLowerCase().split(' ')[0] || '';

    const args = msg.trim().split(/\s+/);
    const q = args.slice(1).join(' ');

    return { command, q }
}

module.exports = getCommand;