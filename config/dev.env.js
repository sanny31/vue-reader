var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_BASEURL: '"http://pdf.cm0575.com"',
  APP_BASEURL: '"http://localhost:8080"'
})
