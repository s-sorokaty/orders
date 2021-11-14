async function queryForDB(elemInJSON,queryToServer){
    let response = await fetch(queryToServer,{method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(elemInJSON)})

    let result = await response.json();
    return result;
    }




let elem = document.querySelectorAll("table tr th");
let elem2 = document.querySelectorAll("#userInf label input");
for(let i=0;i<8;i++){
  elem2[i].style.width=elem[i].clientWidth-7+"px";
  elem2[i].style.height=elem[i].clientHeight-7+"px";
}



table.onmousedown = function(event){
  if(event.which == 2){
  for(let i =1;i<this.rows.length;i++){
    if((this.rows[i].cells[0]!=undefined)&&(event.target==this.rows[i].cells[0])){
      let result = confirm("Вы хотите удалить элемент id = "+event.target.innerHTML+'?');
      if(result==true){
        let del = {
          id: event.target.innerHTML
        };
        queryForDB(del,'/delete').then(result => alert(result));
        location.reload();
    }
  }
}
}
};