const connection = async ({ client }) => {
    try {
        console.log(`Logged in as ${client.user.fullName} (${client.user.username})`);
        console.log(`User ID: ${client.user.id}`);
        console.log(`Followers: ${client.user.followerCount}`);
        console.log(`Following: ${client.user.followingCount}`);
        console.log(`Business: ${client.user.isBusiness}`);
        console.log(`Verified: ${client.user.isVerified}`);
        console.log(`Private: ${client.user.isPrivate}`);
        console.log('\nBot is Online.');
        return true
    } catch (error) {
        return false
    }
}

module.exports = connection