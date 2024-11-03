myApp.registerFtr('waiting_storage_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load = function(search,priority,receive_method,type,tab,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/load",
            method: "POST",
            data: JSON.stringify({ search,priority,receive_method,type,tab,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search,da_book,priority,receive_method,type,tab) {
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/outgoing_dispatch/count",
          method: "POST",
          data: JSON.stringify({ search,da_book,priority,receive_method,type,tab}),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
  }

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDetailsWFP = function (id) {
      return fRoot.requestHTTP({
          url: BackendDomain + "/office/workflow_play/loaddetails",
          method: "POST",
          data: JSON.stringify({id}),
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          }
      });
    }

    obj.insert = function (
        outgoing_dispatch_id,
        title,
        organ_id,
        file_notation,
        language,
        usage_mode,
        year,
        description,
        maintenance_time,
        references,
        storage_name,
        storage_position,
        parents,
        parent
      ) {
        var dataInsert = JSON.stringify({
            outgoing_dispatch_id,
            title,
            organ_id,
            file_notation,
            language,
            usage_mode,
            year,
            description,
            maintenance_time,
            references,
            storage_name,
            storage_position,
            parents,
            parent
        })
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/briefcase/insert",
          method: "POST",
          data: dataInsert,
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          },
        });
      };

    obj.getPrepareInsertData = function () {
      return fRoot.requestHTTP({
        url: BackendDomain + "/office/briefcase/prepareData",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json;odata=verbose"
        }
      });
    }

    obj.searchReference = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/search-reference",
            method: "POST",
            data: JSON.stringify({search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
