import { ajax } from "rxjs/ajax";

// Create an Observable that will create an AJAX request
const apiData = ajax("/api/data");
// Subscribe to create the request
apiData.subscribe(res => console.log(res.status, res.response));
