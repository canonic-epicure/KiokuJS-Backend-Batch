require.paths.unshift('./lib')


var http    = require('http')
var sys     = require('sys')
var puts    = sys.puts
var express = require('express')

var argv            = require('optimist').argv

var backendClass    = argv.backend          || 'KiokuJS.Backend.Hash'
var backendParams   = argv.backendParams    || '{}'
var baseURL         = argv.baseURL          || '/'
var port            = Number(argv.port)     || 8080


require('Task/Joose/NodeJS')

use([

    'KiokuJS.Backend.Batch.Server',
    backendClass

], function () {
    
    var app = express.createServer()
    
    app.configure(function () {
        app.use( express.bodyDecoder() )
    })
    
    
    var params = eval('(' + backendParams + ')')
    
    var server = new Syncler.Server({
        backendClass        : eval('(' + backendClass + ')'),
        
        backendParams       : params,
        
        baseURL             : baseURL.replace(/\/$/, ''),
        port                : port,
        
        app                 : app
    })

    
    app.listen(port)
    
    puts('KiokuJS.Backend.Batch.Server server started')
    puts('Backend class: : [' + backendClass + ']')
    puts('Backend configuration parameters: [' + params + ']')
    puts('BaseURL: [' + baseURL + ']')
    puts('Port: [' + port + ']')
})


process.on('uncaughtException', function (err) {
    console.log('exception: ' + err)
})
