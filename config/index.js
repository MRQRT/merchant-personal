// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8083,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // proxyTable: {
    //     "/gold": {
    //         // target: "http://120.133.0.86:8099/",
    //         target: "http://101.201.197.238:8099/",
    //         pathRewrite: {"^/gold": ""},
    //         secure: false,
    //         changeOrigin: true
    //     }
    // },
    proxyTable: {
        "/merchant-api/": {
            // target:"http://192.168.10.100:8088",
            target:"https://sh-test.au32.cn",
            // target:"https://api-test.au32.cn/",
            // target:"http://10.88.88.3:9191",
            changeOrigin: true,
            pathRewrite: {
                "^/merchant-api/": "/"
            },
        },
        "/api": {
            // target:"http://192.168.10.100:8088",
            target:"https://api-test.au32.cn",
            // target:"http://cjtsh.au32.cn/api/",
            // target:"http://10.88.88.3:9191",
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
            },
        },
        "/oss_api/": {
            target:"https://oss-test.au32.cn/",
            changeOrigin: true,
            pathRewrite: {
                "^/oss_api/": "/"
            },
        },
        "/oss_upload/": {
            target:"http://au32-cjt-test.oss-cn-beijing.aliyuncs.com",
            changeOrigin: true,
            pathRewrite: {
                "^/oss_upload/": "/"
            },
        }
    },
    //    proxyTable: {
    //     "/gold": {
    //         target: "http://120.133.0.86:8090/",
    //         pathRewrite: {"^/gold": ""},
    //         secure: false,
    //         changeOrigin: true
    //     }
    // },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
