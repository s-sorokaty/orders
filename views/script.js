async function selectForDB(elemInJSON,queryToServer){
    let response = await fetch('http://localhost:5000/'+queryToServer,{method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(elemInJSON)})

    let result = await response.json();
    return result;
    }


// dateFromBD.onclick = function(){
// let selectToBD = {
//     select:"select * FROM employee"
// }
// let queryToServer="select";
// selectForDB(selectToBD, queryToServer).then(
//     result=>{ alert(result);}
// );

// }

addToBD.onclick = function(){
    let queryToServer="create";
    let elementToSent = {
        "id": 101,
        "firstname": "123",
        "lastname": "24141",
        "email": "412",
        "number": 35,
        "cost": 3,
        "status":1
    };

    selectForDB(elementToSent,queryToServer).then(
        result=>{ alert(result);});
}




