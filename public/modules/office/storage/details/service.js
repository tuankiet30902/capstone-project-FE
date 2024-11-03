myApp.registerFtr('storage_details_service', ['fRoot', function (fRoot) {
    var obj = {};

    obj.load_details = function(id, code){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/load-detail",
            method: "POST",
            data: JSON.stringify({ id, code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
