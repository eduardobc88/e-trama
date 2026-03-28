## SERVICE MODULE ARCHITECHTURE


| ROUTER | CONTROLLER | REPOSITORY | QUERY | COMMAND |
| ------ | ------ | ------ | ------ | ------ |
| post | post | add | N/A | create | 
| get | get | find | get | N/A | 
| put | put | update | N/A | update | 
| delete | remove | remove | N/A | archive | 
| get/:page/ | getPage | list | fetch | N/A | 
| get/s=? | search | filter | search | N/A | 


## FOR RESULT QUERY OR PROCESS USE
- response: for return into the function definition
- result: for assign returned function data
- result: for result in repository function
- example for definition function:

  repository:
  ```
  let response = {
    record: {},
    error: null,
  }
  let response = {
    records: {},
    error: null,
  }
  ```
  controller:
  ```
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  ```
- example for assign returned function data
  ```
    let result = await RESPOSITORY.get(...)
    let result = await dbConn.query(...)
    let result = await transaction.query(...)
  ```
validate the res and assign value to new var
