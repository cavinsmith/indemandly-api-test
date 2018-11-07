// This module is designed to be common and shouldn't include
// business login specific for your current application

!global._babelPolyfill && require('babel-polyfill')
// Source maps for compiled source debug
import 'source-map-support/register'
// Resolve imports from start script path
import 'app-module-path/register'
import server from './server'

module.exports = server()
