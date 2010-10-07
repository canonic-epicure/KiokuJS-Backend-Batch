Class('KiokuJS.Backend.Batch.Server', {
    
    trait       : 'JooseX.CPS',

    
    has : {
        backendClass            : null,
        backendParams           : null,
        
        backend                 : null,
        
        baseURL                 : null,
        port                    : null,
        
        app                     : { required : true }
    },
    

    methods : {
        
        initialize : function () {
            this.backend    = new this.backendClass(this.backendParams)
            
            var app         = this.app
            var baseURL     = this.baseURL
            
            var me          = this
            
            app.put(baseURL + '/get', function (req, res) {
                var ids = req.body
                
                me.onGet(ids).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function (result) {
                    
                    res.send({
                        result : result
                    })
                })
            })
            
            
            app.put(baseURL + '/insert', function (req, res) {
                var data = req.body
                
                me.onInsert(data.entries, data.mode).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function (result) {
                    
                    res.send({
                        result : result
                    })
                })
            })
            
            
            app.put(baseURL + '/remove', function (req, res) {
                var ids = req.body
                
                me.onRemove(ids).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function () {
                    
                    res.send({
                        result : []
                    })
                })
            })
            
            
            app.put(baseURL + '/exists', function (req, res) {
                var ids = req.body
                
                me.onExists(ids).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function (result) {
                    
                    res.send({
                        result : result
                    })
                })
            })
        },
        
    
        encodeException : function (e) {
            return this.backend.encodePacket({ error : e }, [])
        }
        
    },
    
    
    continued : {
        
        methods : {
        
            onGet : function (ids) {
                var backend = this.backend
                
                backend.get(ids).andThen(function (entries) {
                    
                    this.CONTINUE(entries)
                })
            },
            
            
            onInsert : function (entries, mode) {
                var backend = this.backend
                
                backend.insert(entries, mode).now()
            },
            
            
            onRemove : function (ids) {
                var backend = this.backend
                
                backend.remove(ids).now()
            },
            
            
            onExists : function (ids) {
                var backend = this.backend
                
                backend.exists(ids).now()
            }
        }
    }
})
