//引入
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// vw适配器
// const postcssPx2vw = require('postcss-px-to-viewport');
const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const resolve = (dir: any) => path.join(__dirname, dir);
const assetDir = 'static';
module.exports = {
  chainWebpack(config: any) {
    // 修改js，js chunk文件输出目录
    config.output
      .filename(assetDir + '/js/[name].js')
      .chunkFilename(assetDir + '/js/[name].js');

    // 修改css输出目录
    config.plugin('extract-css').tap(() => [
      {
        filename: `${assetDir}/css/[name].[contenthash:8].css`,
        chunkFilename: `${assetDir}/css/[name].[contenthash:8].chunk.css`,
        ignoreOrder: true,
      },
    ]);

    // 修改图片输出目录
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
      .use('url-loader')
      .loader(require.resolve('url-loader'))
      .tap((options: any) => {
        const newOptions = {
          ...options,
          name: assetDir + '/img/[name].[hash:8].[ext]',
          fallback: {
            ...options.fallback,
            options: {
              name: assetDir + '/img/[name].[hash:8].[ext]',
              esModule: false,
            },
          },
        };
        return newOptions;
      });

    // 修改svg输出目录
    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options: any) => ({
        ...options,
        name: assetDir + '/img/[name].[hash:8].[ext]',
      }));

    // 修改fonts输出目录
    config.module
      .rule('fonts')
      .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options: any) => ({
        ...options,
        name: assetDir + '/fonts/[name].[hash:8].[ext]',
        fallback: {
          ...options.fallback,
          options: {
            name: assetDir + '/img/[name].[hash:8].[ext]',
            esModule: false,
          },
        },
      }));

    // 添加gzip压缩
    config.when(isEnvProduction, (config: any) => {
      config
        .plugin('compression-webpack-plugin')
        .use(CompressionWebpackPlugin, [
          {
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold: 10240,
            minRatio: 0.8,
          },
        ]);
    });
  },
  // 生产环境去除console日志打印
  terserOptions: {
    compress: {
      drop_console: isEnvProduction,
    },
  },
};
