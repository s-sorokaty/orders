

let div = document.createElement('div');
let button1 = document.createElement('button');
let button2 = document.createElement('button');
let delEl=button1;

tabOfElem.onmousedown = function(event){
 
    let divBef = document.querySelector(".currentEl");
    let buttonBef1 = document.querySelector(".delete");
    let buttonBef2 = document.querySelector(".change");
    if(divBef!=null&&buttonBef1!=null&&buttonBef2!=null)
    delElem(divBef,buttonBef1,buttonBef2);
    
    if(event.which == 1){
      for(let i =1;i<tabOfElem.rows.length;i++){
        for(let j =0;j<8;j++){
          if(event.target==tabOfElem.rows[i].cells[j])
          {
            
            div.className = "currentEl";
            div.innerHTML = 'id = '+tabOfElem.rows[i].cells[0].innerHTML;
            document.body.append(div);
            
            button1.className = "delete";
            button1.innerHTML = 'Удалить';
            document.body.append(button1);
            
            button2.className = "change";
            button2.innerHTML = 'Изменить';
            document.body.append(button2);
          }
        }
      }
  }
  };
  
  
  delEl.onclick = function(){
        let result = confirm("Вы хотите удалить элемент "+div.innerHTML+'?');
        console.log();
        if(result==true){
          let del = {
            id: div.innerHTML.slice(-1)
          };
          queryForDB(del,'/delete').then(result => {
            alert(result);
            location.reload();
          });
          
      }
  }