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