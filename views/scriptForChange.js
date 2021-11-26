const div = document.createElement('div');
const button1 = document.createElement('button');
const button2 = document.createElement('button');
const button3 = document.createElement('button');
const panel = document.createElement('div');
const delEl = button1;
const changeEl = button2;
const tableElem = [
  'firstname',
  'lastname',
  'email',
  'number',
  'cost',
  'date',
  'status',
  'description'];
const stat = [
  'Любой',
  'Выполняется',
  'Выполнен',
];

let elemBef = document.createElement('tr');

tabOfElem.onmousedown = function (event) {
  correctForm();
  const panelBef = document.querySelector('.panel');
  if (panelBef != null) { delElem(panelBef); }
  if (event.which === 1) {
    for (let i = 1; i < tabOfElem.rows.length; i += 1) {
      for (let j = 0; j < 9; j += 1) {
        if (event.target === tabOfElem.rows[i].cells[j]) {
          event.target.parentElement.className = 'selected';
          elemBef.classList.remove('selected');
          panel.className = 'panel';
          document.body.append(panel);
          div.className = 'currentEl';
          div.innerHTML = `Выбран элемент id = ${tabOfElem.rows[i].cells[0].innerHTML}`;
          panel.append(div);

          button1.className = 'delete';
          button1.innerHTML = 'Удалить';
          panel.append(button1);

          button2.className = 'change';
          button2.innerHTML = 'Изменить';
          panel.append(button2);

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
    const currentId = document.querySelector('.selected td');
    const del = {
      id: currentId.innerHTML,
    };
    queryForDB(del, '/delete').then((result) => {
      showMessage(result);
    });
  }
};

changeEl.onclick = function () {
  const panelBef = document.querySelector('.panel');
  if (panelBef != null) { delElem(panelBef); }

  const elements = document.querySelector('.selected').children;
  const popUp = document.createElement('div');
  popUp.className = 'b-popup';
  document.body.append(popUp);
  const divCont = document.createElement('div');
  divCont.className = 'b-popup-content';
  divCont.innerHTML = `id = ${div.innerHTML.slice(-1)}<br>`;
  popUp.append(divCont);
  for (let i = 0; i < 8; i += 1) {
    const br = document.createElement('br');
    const label = document.createElement('label');
    label.innerHTML = tableElem[i];
    const input = document.createElement('input');
    divCont.append(label);
    if (i === 5) {
      input.type = 'datetime-local';
      console.log(parseDate(elements[i + 1].innerHTML));
      input.value = parseDate(elements[i + 1].innerHTML);
      label.append(input);
    } else
    if (i === 6) {
      const select = document.createElement('select');
      label.append(select);
      console.log(elements[i + 1].innerHTML);
      for (let j = 1; j < 3; j += 1) {
        const option = document.createElement('option');
        option.value = j;
        option.text = stat[j];
        select.append(option);
      }
      select.value = parseStat(elements[i + 1].innerHTML);
    } else
    if (i === 7) {
      const textarea = document.createElement('textarea');
      textarea.value = elements[i + 1].innerHTML;
      label.append(textarea);
      textarea.className = 'description';
    } else {
      input.value = elements[i + 1].innerHTML;
      label.append(input);
    }
    label.append(br);
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
    correctForm();
  };
  button3.onclick = function () {
    const elems = divCont.querySelectorAll('input');
    const currentId = document.querySelector('.selected td').innerHTML;
    console.log(divCont.querySelector('select').value);
    const elemToChange = {
      id: currentId,
      firstname: elems[0].value,
      lastname: elems[1].value,
      email: elems[2].value,
      number: elems[3].value,
      cost: elems[4].value,
      date: elems[5].value,
      status: divCont.querySelector('select').value,
      desription: divCont.querySelector('textarea').value,
    };
    queryForDB(elemToChange, '/editor').then((result) => {
      showMessage(result);
      popUp.click();
      getElem.click();
      correctForm();
    });
  };
};
