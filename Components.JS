COMPONENTS = {
    // a comment
    
    "Core" : [
        "KiokuJS.Backend.Batch"
    ],
    
    
    "Prereq" : [
        "jsan:Task.KiokuJS.Prereq",
        "jsan:Task.HTTP.Request.Provider.Auto"
    ],
    
    
    "Test" : [
        "jsan:Task.KiokuJS.Test",
        "jsan:Task.KiokuJS.Backend.CouchDB.Core",
        "+Core"
    ]
}
