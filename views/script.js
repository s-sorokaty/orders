correctForm();
let message= document.createElement('div');
function delElem(...args){
  for(let key in args){
    let elem =args[key];
    elem.remove();
}
}
function delElemBef(...args){
  for(let i=0;i<args[0].length;i++){
    args[0][i].remove();
}
}
async function queryForDB(elemInJSON,queryToServer){
    let response = await fetch(queryToServer,{method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(elemInJSON)})

    let result = await response.json();
    return result;
    }



function correctForm(){
let elem = document.querySelectorAll("table tr th");
let elem2 = document.querySelectorAll("#userInf label input");
for(let i=0;i<8;i++){
  elem2[i].style.width=elem[i].clientWidth-7+"px";
  elem2[i].style.height=elem[i].clientHeight-7+"px";
}}


addElem.onclick = function(event){
  let child = event.target.parentElement.children;
  let elemToAdd = {
    "firstname": child[1].querySelector('input').value,
      "id": child[0].querySelector('input').value,
      "lastname": child[2].querySelector('input').value,
      "email": child[3].querySelector('input').value,
      "number": child[4].querySelector('input').value,
      "cost": child[5].querySelector('input').value,
      "date":child[6].querySelector('input').value,
      "status":child[7].querySelector('input').value
  }
  queryForDB(elemToAdd,'/create').then(result => {
    alert(result);
    getElem.click();
  });
  }

  getElem.onclick=function(event){

    message.remove();
   let elemBef =document.querySelectorAll('table tr td');
   if(elemBef.length>0)
   delElemBef(elemBef);
    let child = event.target.parentElement.querySelectorAll('input');
      let elemToAdd = {
          "idFrom": child[0].value,
          "idTo": child[1].value,
          "firstname": child[2].value,
          "lastname": child[3].value,
          "email": child[4].value,
          "number": child[5].value,
          "costFrom": child[6].value,
          "costTo": child[7].value,
          "dateFrom":child[8].value,
          "dateTo":child[9].value,
          "status":child[10].value
      }
      queryForDB(elemToAdd,'/main/select').then(result => {
        let table = document.getElementById('tabOfElem');
        if (typeof result == 'object'){
        for(let i=0;i<result.length;i++){
        let tr = document.createElement('tr');
        table.append(tr);
        for(let key in result[i]){
          let td = document.createElement('td');
        if(key=='date') 
        td.innerHTML = new Date(result[i][key]);
        else 
        td.innerHTML = result[i][key];
        tr.append(td);
      }
      }}else{
        message.innerHTML =result;
        selectorElem.append(message);
        
      }
      
      correctForm();
      });

  }

 