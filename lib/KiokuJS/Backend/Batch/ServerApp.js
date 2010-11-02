Class('KiokuJS.Backend.Batch.ServerApp', {
    
    trait       : 'JooseX.CPS',

    
    has : {
        backendClass            : { required : true },
        backendParams           : Joose.I.Object,
        
        backend                 : null,
        
        baseURL                 : '',
        
        app                     : { required : true },
        
        // TODO prefetch requested entries in-depth
        deepPrefetch            : false
    },
    

    methods : {
        
        initialize : function () {
            this.backend    = new this.backendClass(this.backendParams)
            
            var app         = this.app
            var baseURL     = this.baseURL.replace(/\/$/, '')
            
            var me          = this
            
            app.put(baseURL + '/get', function (req, res) {
                var ids = req.body
                
                me.send(me.onGet(ids), res)
            })
            
            
            app.put(baseURL + '/insert', function (req, res) {
                var data = req.body
                
                me.send(me.onInsert(data.entries, data.mode), res)
            })
            
            
            app.put(baseURL + '/remove', function (req, res) {
                var ids = req.body
                
                me.send(me.onRemove(ids), res)
            })
            
            
            app.put(baseURL + '/exists', function (req, res) {
                var ids = req.body
                
                me.send(me.onExists(ids), res)
            })
        },
        
    
        encodeException : function (e) {
            return this.backend.encodePacket({ error : e }, [])
        },
        
        
        send : function (cont, res) {
            var me = this
            
            cont.then(function (result) {
                
                res.send({
                    result : result
                })
            }).except(function (e) {
                
                res.send({
                    error : me.encodeException(e)
                })
                
            }).now()            
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
