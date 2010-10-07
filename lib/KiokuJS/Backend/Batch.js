Role('KiokuJS.Backend.Batch', {
    
    /*VERSION,*/
    
    requires    : [
        'getBackend',
        
        'serialize',
        'deserialize',
        
        'get',
        'insert',
        'remove',
        'exists'
    ],
    
    
    trait   : 'JooseX.CPS',
    
    has : {
        baseURL     : {
            is      : 'rw',
            init    : '/'
        }
    },
    
    
    use     : [
        Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR',
        
        'KiokuJS.Exception.Format',
        'KiokuJS.Exception.Network',
        'KiokuJS.Exception.LookUp',
        'KiokuJS.Exception.Overwrite', 
        'KiokuJS.Exception.Update',
        'KiokuJS.Exception.Conflict'
    ],
    

    
    methods : {
        
        getRequest : function (config) {
            config.headers = {
                'content-type' : 'application/json'
            }
            
            return new HTTP.Request.Provider.getRequest(config)
        },
        
        
        getURLfor : function (action) {
            return this.getBaseURL() + '/' + action 
        },
        
        
        decodeException : function (packet) {
            return this.decodePacket(packet)[ 0 ].error
        }
    },
    
    
    continued : {
        
        override : {
            
            get     : function (idsToGet, mode) {
                
                if (!idsToGet.length) {
                    this.CONTINUE([])
                    
                    return
                }
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.serializer.serialize(idsToGet)
                })
                
                
                req.request(this.getURLfor('get')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.deserialize(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else
                        this.CONTINUE(response.result)
                }, this)
            },
            
            
            insert  : function (entries, mode) {
                if (!entries.length) {
                    this.CONTINUE([])
                    
                    return
                }
                
                var data        = this.serialize({
                    entries     : entries,
                    
                    mode        : mode
                })
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : data
                })
                
                
                req.request(this.getURLfor('insert')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.deserialize(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else
                        this.CONTINUE(response.result)
                }, this)
            },
            
            
            remove  : function (entriesOrIds) {
                if (!entriesOrIds.length) {
                    this.CONTINUE()
                    
                    return
                }
                
                
                var ids = Joose.A.map(entriesOrIds, function (entryOrId) {
                    
                    if (entryOrId === Object(entryOrId)) {
                        var copy = Joose.O.copy(entryOrId)
                        
                        delete copy.data
                        
                        return copy
                    } 
                    
                    return entryOrId
                })
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.serialize(ids)
                })
                
                
                req.request(this.getURLfor('remove')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.deserialize(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else 
                        this.CONTINUE(response.result)
                }, this)
            },
            
            
            exists  : function (idsToCheck) {
                if (!idsToCheck.length) {
                    this.CONTINUE([])
                    
                    return
                }
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.serialize(idsToCheck)
                })
                
                
                req.request(this.getURLfor('exists')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.deserialize(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else 
                        this.CONTINUE(response.result)
                }, this)
            }
        }
    }
})

