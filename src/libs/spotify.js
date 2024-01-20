const axios = require('axios')
require("dotenv").config()

const spotifySearchMusic = async (query) => {
    try {
        const { data } = await axios.get(`${process.env.SPOTIFY_ENDPOINT}query=${query}`);

        if (!data.data) {
            return {
                status: false,
                data: 'Tidak ditemukan.',
            };
        }

        const list = data.data.map((m, index) => {
            return `(${index + 1}) ${m.title} - ${m.artist}`;
        }).join("\n\n")

        const musicIndex = data.data.map((m, index) => index + 1);

        return {
            status: true,
            data: list,
            musicIndex,
            musicLength: data.data.length,
            musicList: data.data,
        };
    } catch (err) {
        return {
            status: false,
            data: "Tidak ditemukan.",
        };
    }
};

async function spotifyFetchURL(url) {
    if (!url) return { status: false, message: 'No url requested' };
    const base = `${process.env.SPOTIFY_ENDPOINT}url=${url}`
    try {
        try {
            const { data } = await axios.get(base)

            return data

        } catch (error) {
            const res = await axios.get(base)
            return res.data

        }
    } catch (error) {
        return { status: false, message: 'Not Found' }
    }

}


module.exports = {
    spotifySearchMusic,
    spotifyFetchURL
}