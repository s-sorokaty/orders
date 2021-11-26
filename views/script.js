correctForm();

function showMessage(value) {
  const elemBef = document.querySelectorAll('.message');
  console.log(elemBef);
  if (elemBef.length !== 0) {
    delElem(elemBef[0]);
  }
  const serverMessage = document.createElement('div');
  serverMessage.className = 'message';
  // serverMessage.innerHTML=value;
  document.body.append(serverMessage);
  const p = document.createElement('p');
  p.innerHTML = value[0].toUpperCase() + value.slice(1);
  serverMessage.append(p);
  setTimeout(() => { serverMessage.remove(); }, 5000);
}

// Для вставки даты в input
function parseDate(val) {
  val = new Date(val);
  let month = val.getMonth();
  if (month < 10) {
    month = `0${month}`;
  }
  let day = val.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let hours = val.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let min = val.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }
  const date = `${val.getFullYear()}-${month}-${day}T${hours}:${min}`;
  return date;
}
function parseStat(val) {
  if (val === 'Любой') return '';
  if (val === 'Выполняется') return 1;
  if (val === 'Выполнен') return 2;
}
function delElem(...args) {
  for (const key in args) {
    const elem = args[key];
    elem.remove();
  }
}

const message = document.createElement('div');
message.className = 'message';
function delElemBef(...args) {
  for (let i = 0; i < args[0].length; i += 1) {
    args[0][i].remove();
  }
}
async function queryForDB(elemInJSON, queryToServer) {
  const response = await fetch(queryToServer, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(elemInJSON),
  });

  const result = await response.json();
  return result;
}

function correctForm() {
  const elem = document.querySelectorAll('table tr th');
  const elem2 = document.querySelectorAll('#userInf label>*');
  if (elem2.length !== 0) {
    for (let i = 0; i < 9; i += 1) {
      elem2[i].style.width = `${elem[i].clientWidth - 6}px`;
      elem2[i].style.height = `${elem[i].clientHeight - 6}px`;
    }
  }
}

const addedPanel = document.getElementById('addElem');
if (addedPanel != null) {
  addedPanel.onclick = function (event) {
    const child = event.target.parentElement.children;
    const elemToAdd = {
      id: child[0].querySelector('input').value,
      firstname: child[1].querySelector('input').value,
      lastname: child[2].querySelector('input').value,
      email: child[3].querySelector('input').value,
      number: child[4].querySelector('input').value,
      cost: child[5].querySelector('input').value,
      date: child[6].querySelector('input').value,
      status: child[7].querySelector('select').value,
      desription: child[8].querySelector('input').value,
    };
    queryForDB(elemToAdd, '/create').then((result) => {
      getElem.click();
      correctForm();
      showMessage(result);
    });
  };
}

getElem.onclick = function (event) {
  const elemBef = document.querySelectorAll('table tbody tr ');
  if (elemBef.length > 0) { delElemBef(elemBef); }
  const child = event.target.parentElement.querySelectorAll('label>input');
  const stat = document.getElementById('stat');
  const elemToAdd = {
    idFrom: child[0].value,
    idTo: child[1].value,
    firstname: child[2].value,
    lastname: child[3].value,
    email: child[4].value,
    number: child[5].value,
    costFrom: child[6].value,
    costTo: child[7].value,
    dateFrom: child[8].value,
    dateTo: child[9].value,
    status: stat.value,
  };
  queryForDB(elemToAdd, '/main/select').then((result) => {
    let table = document.getElementById('tabOfElem');
    table = table.children;
    table = table[1];
    if (typeof result === 'object') {
      for (let i = 0; i < result.length; i += 1) {
        const tr = document.createElement('tr');
        table.append(tr);
        for (const key in result[i]) {
          const td = document.createElement('td');
          if (key === 'date') td.innerHTML = parseDate(result[i][key]).replace('T', ' ');
          else
          if (key === 'status') {
            if (result[i][key] === 1) {
              td.innerHTML = 'Выполняется';
            }
            if (result[i][key] === 2) td.innerHTML = 'Выполнен';
          } else
          if (key === 'date') { td.innerHTML = new Date(result[i][key]); } else { td.innerHTML = result[i][key]; }
          tr.append(td);
        }
      }
    } else {
      showMessage(result);
    }
    correctForm();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const getSort = ({ target }) => {
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
    const comparator = (index, order) => (a, b) => order * collator.compare(
      a.children[index].innerHTML,
      b.children[index].innerHTML,
    );

    for (const tBody of target.closest('table').tBodies) { tBody.append(...[...tBody.rows].sort(comparator(index, order))); }

    for (const cell of target.parentNode.cells) { cell.classList.toggle('sorted', cell === target); }
  };

  document.querySelectorAll('table th').forEach((tableTH) => tableTH.addEventListener('click', () => getSort(event)));
});
