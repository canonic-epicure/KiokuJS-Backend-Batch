require.paths.unshift('./lib')


var http    = require('http')
var util = require('util')
var puts    = util.puts
var express = require('express')

var argv            = require('optimist').argv

var backendClass    = argv.backendClass     && JSON.parse(argv.backendClass)     || 'KiokuJS.Backend.Hash'
var backendParams   = argv.backendParams    && JSON.parse(argv.backendParams)    || {}
var baseURL         = argv.baseURL          && JSON.parse(argv.baseURL)          || '/'
var port            = Number(argv.port)                                          || 8080
var deepPrefetch    = argv.deepPrefetch                                          || false


require('Task/Joose/NodeJS')

use([

    'KiokuJS.Backend.Batch.ServerApp',
    backendClass

], function () {
    
    var app = express.createServer()
    
    app.configure(function () {
        app.use( express.bodyDecoder() )
    })
    
    
    puts('Starting KiokuJS.Backend.Batch.ServerApp')
    
    var server = new KiokuJS.Backend.Batch.ServerApp({
        backendClass        : eval('(' + backendClass + ')'),
        
        backendParams       : backendParams,
        
        baseURL             : baseURL.replace(/\/$/, ''),
        port                : port,
        
        app                 : app,
        
        deepPrefetch        : deepPrefetch
    })

    
    app.listen(port)
    
    puts('KiokuJS.Backend.Batch.ServerApp server started')
    puts('Backend class: : [' + backendClass + ']')
    puts('Backend configuration parameters: [' + JSON.stringify(backendParams) + ']')
    puts('BaseURL: [' + baseURL + ']')
    puts('Port: [' + port + ']')
})


process.on('uncaughtException', function (err) {
    console.log('exception: ' + err)
    console.log('stack: ' + err.stack)
})
