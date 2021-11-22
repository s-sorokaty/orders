correctForm();

const message = document.createElement('div');
function delElem(...args) {
  for (const key in args) {
    const elem = args[key];
    elem.remove();
  }
}
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
  const elem2 = document.querySelectorAll('#userInf label input');
  if (elem2.length !== 0) {
    for (let i = 0; i < 8; i += 1) {
      elem2[i].style.width = `${elem[i].clientWidth - 7}px`;
      elem2[i].style.height = `${elem[i].clientHeight - 7}px`;
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
      status: child[7].querySelector('input').value,
    };
    queryForDB(elemToAdd, '/create').then((result) => {
      alert(result);
      getElem.click();
    });
  };
}

getElem.onclick = function (event) {
  message.remove();
  const elemBef = document.querySelectorAll('table tr td');
  if (elemBef.length > 0) { delElemBef(elemBef); }
  const child = event.target.parentElement.querySelectorAll('input');
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
    status: child[10].value,
  };
  queryForDB(elemToAdd, '/main/select').then((result) => {
    const table = document.getElementById('tabOfElem');
    if (typeof result === 'object') {
      for (let i = 0; i < result.length; i += 1) {
        const tr = document.createElement('tr');
        table.append(tr);
        for (const key in result[i]) {
          const td = document.createElement('td');
          if (key == 'date') { td.innerHTML = new Date(result[i][key]); } else { td.innerHTML = result[i][key]; }
          tr.append(td);
        }
      }
    } else {
      message.innerHTML = result;
      selectorElem.append(message);
    }

    correctForm();
  });
};
