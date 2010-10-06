StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use('KiokuJS.Backend.Batch', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Backend.Batch, "KiokuJS.Backend.Batch is here")
        
        t.endAsync(async0)
        
        t.done()
    })
})    
