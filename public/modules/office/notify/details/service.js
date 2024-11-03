
myApp.registerFtr('notify_details_service', ['fRoot','$q', function (fRoot,$q) {
    var obj = {};

    obj.load_details = function (code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_details",
            method: "POST",
            data: JSON.stringify({code}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reload_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/reload_details",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_info = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_file_info",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approval = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/approval",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/reject",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.like = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/like",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.unlike = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/unlike",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    return obj;
}]);