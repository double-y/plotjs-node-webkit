var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/jsx/main.js',
    output: {
        path: './build/js',
        filename: 'bundle.js'
    },
    resolve: {
      modulesDirectories: ["node_modules", "build/bower_components"],
        root: [path.join(__dirname, "bower_components")],
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: path.join(__dirname, 'src/jsx'),
                query: {
                  presets: 'react',
                },
            }
        ]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    node: {
      fs: "empty"
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};
