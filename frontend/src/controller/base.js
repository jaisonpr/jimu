'use strict';


const ENDPOINT = "http://localhost:3000/api/v1";

class BaseController {
   
    static getEndpoint() {
        return ENDPOINT;
    }

    static sendDelete(resource, id) {  
        $.ajax({
            url: `${ENDPOINT}/${resource}/${id}`,
            type: 'DELETE'
        })
        .done(function () { console.log("sendDelete:success"); })
        .fail(function () { console.log("sendDelete:error"); })
        .always(function () { console.log("sendDelete:complete"); });
    }
    
    static sendSave(resource, data, id) {  
        $.ajax({
            url: `${ENDPOINT}/${resource}/${ (id === 0 ? '' : id) }`,
            type: id === 0 ? 'POST' : 'PUT',
            contentType: "application/json",
            dataType: 'json',
            data: data
        })
        .done(function () { console.log("sendSave:success"); })
        .fail(function () { console.log("sendSave:error"); })
        .always(function () { console.log("sendSave:complete"); });
    }

    static sendQuery(resource, query) {
        return this.getURL(`${ENDPOINT}/${resource}/?${query}`);
    }

    static sendParam(resource, param) {
        return this.getURL(`${ENDPOINT}/${resource}/${param}`);
    }

    static getURL(url) {
        let ret = [];
        $.ajax({
            url: url,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            async: false,
        })
        .done(function (data) {
            ret = data;
        })
        .fail(function () {   console.log("getURL:error");       })
        .always(function () { console.log("getURL:complete");    });
    
        return ret;
    }
}
  
export { BaseController };  