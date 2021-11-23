const div = document.createElement('div');
const button1 = document.createElement('button');
const button2 = document.createElement('button');
const button3 = document.createElement('button');
const delEl = button1;
const changeEl = button2;
const tableElem = [
  'firstname',
  'lastname',
  'email',
  'number',
  'cost',
  'date',
  'status'];

let elemBef = document.createElement('tr');



tabOfElem.onmousedown = function (event) {
  correctForm();

  const divBef = document.querySelector('.currentEl');
  const buttonBef1 = document.querySelector('.delete');
  const buttonBef2 = document.querySelector('.change');
  if (divBef != null && buttonBef1 != null && buttonBef2 != null) { delElem(divBef, buttonBef1, buttonBef2); }

  if (event.which === 1) {
    for (let i = 1; i < tabOfElem.rows.length; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        if (event.target === tabOfElem.rows[i].cells[j]) {
          event.target.parentElement.className = 'selected';
          elemBef.classList.remove('selected');

          div.className = 'currentEl';
          div.innerHTML = `id = ${tabOfElem.rows[i].cells[0].innerHTML}`;
           document.body.append(div);

          button1.className = 'delete';
          button1.innerHTML = 'Удалить';
          document.body.append(button1);

          button2.className = 'change';
          button2.innerHTML = 'Изменить';
          document.body.append(button2);

          if (!(elemBef === event.target.parentElement)) { elemBef = event.target.parentElement; } else { event.target.parentElement.className = 'selected'; }
        }
      }
    }
  }
  correctForm();
};

delEl.onclick = function () {
  const result = confirm(`Вы хотите удалить элемент ${div.innerHTML}?`);
  if (result === true) {
    const del = {
      id: div.innerHTML.slice(-1),
    };
    queryForDB(del, '/delete').then((result) => {
      alert(result);
    });
  }
};

changeEl.onclick = function () {
  const elements = document.querySelector('.selected').children;
  const popUp = document.createElement('div');
  popUp.className = 'b-popup';
  document.body.append(popUp);
  const divCont = document.createElement('div');
  divCont.className = 'b-popup-content';
  divCont.innerHTML = `id = ${div.innerHTML.slice(-1)}<br>`;
  popUp.append(divCont);
  for (let i = 0; i < 7; i += 1) {
    const label = document.createElement('label');
    label.innerHTML = tableElem[i];
    const input = document.createElement('input');
    input.value = elements[i + 1].innerHTML;
    divCont.append(label);
    label.append(input);
  }
  button3.innerHTML = 'Изменить';
  divCont.append(button3);
  popUp.onclick = function (event) {
    if (event.target === popUp) {
      popUp.remove();
      const divBef = document.querySelector('.currentEl');
      const buttonBef1 = document.querySelector('.delete');
      const buttonBef2 = document.querySelector('.change');
      if (divBef != null && buttonBef1 != null && buttonBef2 != null) { delElem(divBef, buttonBef1, buttonBef2); }
      elemBef.classList.remove('selected');
    }
  };
  button3.onclick = function () {
    const elems = divCont.querySelectorAll('input');
    const id = document.querySelector('.currentEl').innerHTML.slice(-1);

    const elemToChange = {
      id,
      firstname: elems[0].value,
      lastname: elems[1].value,
      email: elems[2].value,
      number: elems[3].value,
      cost: elems[4].value,
      date: elems[5].value,
      status: elems[6].value,
    };
    queryForDB(elemToChange, '/editor').then((result) => {
      alert(result);
      popUp.click();
    });
  };
};
