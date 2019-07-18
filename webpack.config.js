
module.exports = {

    mode: "development",

    entry: './src/main.js',
    output: {
        filename: 'bundle.js'
    },

    watch: true,

    devtool: "source-map"
};