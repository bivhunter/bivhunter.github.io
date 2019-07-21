const webpack = require("webpack");
module.exports = {

    mode: "development",

    entry: './src/main.js',
    output: {
        filename: 'bundle.js'
    },

    watch: true,

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': "jquery"
        })
    ],

    resolve: {
        modules: ['node_modules']
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};