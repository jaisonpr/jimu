'use strict';

const endpoint = "http://localhost:3000/api/v1/";

class BaseController {
   
    getEndpoint() {
        return endpoint;
    }
    
}
  
export { BaseController };  