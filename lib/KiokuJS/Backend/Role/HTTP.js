Role('KiokuJS.Backend.Role.HTTP', {
    
    has : {
        baseURL     : {
            is      : 'rw',
            init    : ''
        }
    },
    
    
    use     : [
        Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR'
    ],
    

    after : {
        
        initialize : function () {
            this.baseURL = this.baseURL.replace(/\/+$/, '')
        }
    },
    
    
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
    }
})

