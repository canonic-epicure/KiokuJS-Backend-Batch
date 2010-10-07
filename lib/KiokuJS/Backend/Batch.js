Role('KiokuJS.Backend.Batch', {
    
    /*VERSION,*/
    
    requires    : [
        'getBackend',
        
        'get',
        'insert',
        'remove',
        'exists'
    ],
    
    
    use     : [
        'JSON2',
    
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
            return this.baseURL + '/' + action 
        },
        
        
        stringifyJSON : function (data) {
            try {
                return JSON2.stringify(data)
            } catch (e) {
                throw new KiokuJS.Exception.Format({ message : 'Invalid JSON: ' + data })
            }
        },
        
        
        parseJSON : function (str) {
            try {
                return JSON2.parse(str)
            } catch (e) {
                throw new KiokuJS.Exception.Format({ message : 'Invalid JSON: ' + str })
            }
        },
        
        
        decodeException : function (packet) {
            return this.decodeObjects(packet)[ 0 ].error
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function (idsToGet, scope, mode) {
                
                if (!idsToGet.length) {
                    this.CONTINUE([])
                    
                    return
                }
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(idsToGet)
                })
                
                
                req.request(this.getURLfor('get')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else
                        this.CONTINUE(this.decodeEntries(response.result))
                }, this)
            },
            
            
            
            insert  : function (nodesToInsert, scope, mode) {
                if (!nodesToInsert.length) {
                    this.CONTINUE([])
                    
                    return
                }
                
                var entries     = this.encodeNodes(nodesToInsert)
                
                var data        = this.stringifyJSON({
                    entries     : entries,
                    
                    mode        : mode
                })
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : data
                })
                
                var nodesByID   = {}
                
                Joose.A.each(nodesToInsert, function (node) {
                    nodesByID[ node.ID ] = node
                })
                
                req.request(this.getURLfor('insert')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else {
                        
                        var ids = Joose.A.map(response.result, function (insertResult) {
                            
                            if (insertResult === Object(insertResult) && insertResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(insertResult) })
                            
                            var id      = insertResult[0]
                            var rev     = insertResult[1]
                            
                            nodesByID[ id ].REV = rev
                            
                            return id
                        })
                        
                        this.CONTINUE(ids)
                    }
                }, this)
            },
            
            
            remove  : function (nodesOrIds) {
                if (!nodesOrIds.length) {
                    this.CONTINUE()
                    
                    return
                }
                
                
                var ids = Joose.A.map(nodesOrIds, function (nodeOrID) {
                    
                    if (nodeOrID instanceof KiokuJS.Node) return nodeOrID.ID
                    
                    return nodeOrID
                })
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(ids)
                })
                
                
                req.request(this.getURLfor('remove')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else {
                        
                        Joose.A.each(response.result, function (removeResult) {
                            
                            if (removeResult === Object(removeResult) && removeResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(removeResult) })
                        })
                        
                        this.CONTINUE()
                    }
                }, this)
            },
            
            
            exists  : function (idsToCheck) {
                if (!idsToCheck.length) {
                    this.CONTINUE([])
                    
                    return
                }
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(ids)
                })
                
                
                req.request(this.getURLfor('exists')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else {
                        
                        var results = Joose.A.each(response.result, function (existsResult) {
                            
                            if (existsResult === Object(existsResult) && existsResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(existsResult) })
                            
                            return existsResult
                        })
                        
                        this.CONTINUE(results)
                    }
                }, this)
            }
        }
    }
})

