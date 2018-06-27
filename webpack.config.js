const path = require('path');
//const es2015 = require('babel-preset-es2015');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const es2015 = require('babel-preset-es2015');
const react = require('react');

const outputDir = path.resolve(__dirname, './dist')

/**
 * creates a webpack config for the UI (provider UI aka notification center)
 * @param {string} projectPath The path to the project
 * @param {string} entryPoint The entry point to the application,
 *  usually a js file
 * @return {Object} A webpack module for the project
 */
function createWebpackConfigForProviderUI(projectPath, entryPoint) {
    const includePathToProject = path.resolve(__dirname, `./src/${projectPath}`);

    return Object.assign({
        entry: entryPoint,
        output: {
            path: outputDir + '/ui/pack',
            filename: '[name]-bundle.js'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        devtool:'source-map',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                },
                {
                    test: /\.(png|jpg|gif|otf|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192
                            }
                        }
                    ]
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                },
                // {
                //     test: /\.jsx$/,
                //     include: [includePathToProject],
                //     loader: 'babel-loader',
                //     query: {
                //         presets: [react, es2015]
                //     }
                // },
                {
                    test: /\.js$/,
                    include: [includePathToProject],
                    loader: 'babel-loader',
                    query: {
                        presets: [es2015, "react"]
                    }
                }

            ]
        },
        plugins: [new ExtractTextPlugin({ filename: 'bundle.css' })]
    });
}

/**
 * build rudimentary webpack config for typescript (client/provider)
 * @param {string} infile The entry point to the application (usually a js file)
 * @param {string} outfile The name of the packed output file
 * @return {Object} A webpack module
 */
function createWebpackConfigForTS(infile, outfile) {
    return Object.assign({
        entry: infile,
        output: {
            path: outputDir,
            filename: outfile + '.js'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                }
            ]
        }
    });
}

/**
 * build webpack config for the client side
 * @return {Object} A webpack module
 */
function createWebpackConfigForClient() {
    return createWebpackConfigForTS('./src/client/index.ts', 'client');
}

/**
 * build webpack config for the provider side
 * @return {Object} A webpack module
 */
function createWebpackConfigForProvider() {
    return Object.assign(
        createWebpackConfigForTS('./src/provider/index.ts', 'provider'),
        { 
            plugins: [
                new CopyWebpackPlugin([
                    { from: './src/ui', to: 'ui/' },
                    { from: './src/demo', to: 'demo/' },
                    { from: './src/provider.html' }
                ]),
                new CopyWebpackPlugin([
                    { from: './src/app.template.json', to: 'app.json', transform: (content) => {
                        const config = JSON.parse(content);
                        config.startup_app.url =  'https://cdn.openfin.co/services/openfin/notifications/' + process.env.GIT_SHORT_SHA + '/provider.html';
                        return JSON.stringify(config);
                    }}
                ])

            ]
        }
    )
}

/**
 * Modules to be exported
 */
module.exports = [
    createWebpackConfigForClient(),
    createWebpackConfigForProvider(),
    createWebpackConfigForProviderUI('Service/UI', {
        react: './src/ui/js/index.tsx',
        serviceui: './src/ui/index.ts',
        openfin: './src/ui/js/openfin.ts',
        toast: './src/ui/js/toast/index.tsx'
    }),
];
