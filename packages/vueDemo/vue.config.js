const path = require('path');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
function resolve(dir) {
    return path.join(__dirname, dir);
}
const env = process.env.NODE_ENV;

const smp = new SpeedMeasureWebpackPlugin({
    outputFormat: 'human',
    // outputTarget: resolve('./buildSpeed.log')
});

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false,
    runtimeCompiler: true,

    // 显示打包中loader和plugin中花费的时间
    configureWebpack: smp.wrap({}),

    chainWebpack: config => {
        config.optimization.minimize(env === 'production');

        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/Components'))
            .set('static', resolve('src/static'));
    },
};
