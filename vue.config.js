const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: import.meta.env.MODE === 'production' || import.meta.env.MODE === 'test'
    ? './'
    : '/'
})
