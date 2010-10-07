Class('KiokuJS.Backend.Batch.Server', {
    
    trait       : 'JooseX.CPS',

    
    has : {
        backendClass            : { required : true },
        backendParams           : null,
        
        backend                 : null,
        
        baseURL                 : '',
        
        app                     : { required : true }
    },
    

    methods : {
        
        initialize : function () {
            this.backend    = new this.backendClass(this.backendParams || {})
            
            var app         = this.app
            var baseURL     = this.baseURL.replace(/\/$/, '')
            
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
                this.backend.get(ids).now()
            },
            
            
            onInsert : function (entries, mode) {
                this.backend.insert(entries, mode).now()
            },
            
            
            onRemove : function (ids) {
                this.backend.remove(ids).now()
            },
            
            
            onExists : function (ids) {
                this.backend.exists(ids).now()
            }
        }
    }
})
