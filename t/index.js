var Harness
var isNode        = typeof process != 'undefined' && process.pid

if (isNode) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
var INC = (isNode ? require.paths : []).concat('../lib', '/jsan')


Harness.configure({
    title     : 'KiokuJS.Backend.Batch Test Suite',
    
    preload : [
        'Task.KiokuJS.Backend.Batch.Prereq',
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + Harness.prepareINC(INC)
        },
        'Task.KiokuJS.Backend.Batch.Test'
    ]
})


Harness.start(
    '010_sanity.t.js',
    '020_fixtures_hash.t.js',
    '030_fixtures_couchdb.t.js'
)

