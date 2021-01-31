// .vuepress/config.js
module.exports = {
    title: 'Chemotion',
    base: process.env.NODE_ENV === 'production' ? '/chemotion-docs/' : '',
    themeConfig: {
        sidebar: ['/', 'installation'],
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Chemotion', link: 'https://www.chemotion.net' },
        ],
    },
}

console.log({ NODE_ENV: process.env.NODE_ENV })
