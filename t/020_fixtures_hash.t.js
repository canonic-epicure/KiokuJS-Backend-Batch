StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Test, "KiokuJS.Test is here")
    t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
    t.ok(KiokuJS.Backend.Batch, "KiokuJS.Backend.Batch is here")
    
    
    t.harness.currentPort   = t.harness.currentPort || 9000
    
    
    new KiokuJS.Test({
        t       : t,
        
//        fixtures    : [ 'StressLoad.Tree' ],
        
        connect : function () {
            
            var port    = t.harness.currentPort++
            
            HTTP.Request.Provider.getRequest({ 
                
                headers : { 'content-type' : 'application/json' },
                
                url     : '/8080/start_test', 
                method  : 'PUT',
                
                data    : JSON2.stringify({ 
                    port            : port,
                    
                    backendClass    : 'KiokuJS.Backend.Hash'
                })
                
            }).andThen(function (res) {
                
                var backend = new KiokuJS.Backend.Hash({
                    trait   : KiokuJS.Backend.Batch,
                    
                    baseURL : 'http://local/' + port
                })
                
                backend.__port__ = port
                
                this.CONTINUE(backend)
            })
        },
        
        cleanup : function (backend, t) {
            
            HTTP.Request.Provider.getRequest({ 
                
                headers : { 'content-type' : 'application/json' },
                
                url     : '/8080/finish_test', 
                method  : 'PUT',
                
                data    : JSON2.stringify({ 
                    port : backend.__port__ 
                })
                
            }).now()
        }
        
    }).runAllFixtures().andThen(function () {
        
        t.endAsync(async0)
        
        t.done()
    })
})    
