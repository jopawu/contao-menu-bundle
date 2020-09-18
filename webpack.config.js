var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('src/Resources/public/')
    .addEntry('contao-menu-bundle', './src/Resources/assets/js/contao-menu-bundle-init.js')
    .setPublicPath('/public/')
    .disableSingleRuntimeChunk()
    .addExternals({
        '@hundh/contao-utils-bundle': 'utilsBundle'
    })
    .enableSourceMaps(!Encore.isProduction())
    .enableSassLoader()
;

module.exports = Encore.getWebpackConfig();
