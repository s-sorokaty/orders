const express = require('express');
const { Client } = require('pg');

const urlencodedParser = express.urlencoded({ extended: false });
const app = express();


app.use(express.urlencoded({ extended: true }))
app.use(express.json());

const order = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '1',
  database: 'order',
});
app.set('views', './views');
app.set('view engine', 'pug');

async function startApp() {
  try {
    order.connect();
    app.listen(5000, () => console.log('Сервер запущен...'));
  } catch (err) {
    order.end();
  }
}

startApp();


// запрос к базе данных
async function selectForDB(select) {
  const date = new Promise((resolve, reject) => {
    order.query(select, (err, res) => {
      if (!err) {
        resolve(res.rows);
      } else {
        reject(err.message);
      }
    });
  });
  return date;
}

// Метод для вставки элементов в бд
async function insertOne(elem) {
  const insertText = 'INSERT INTO employee(id, firstname, lastname, email, number, cost, date, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
  const ans = new Promise((resolve, reject) => {
    order.query(insertText, [elem.id, elem.firstname, elem.lastname, elem.email, elem.number, elem.cost, elem.date, elem.status], (err, res) => {
      if (!err) {
        resolve('Запись добавлена');
      } else {
        reject(err.where);
      }
    });
  });
  return ans;
}

app.get('/', (req, res) => {
  console.log('user is connecting');
  res.render('login', { message: '' });
});



// запрос на обращение к бд
app.post('/main/select', urlencodedParser, (req, res) => {
  let select = 'select * FROM employee';
  select += ' where ';
  if ((!req.body.idFrom > -1) && (req.body.idFrom == '')) {
    req.body.idFrom = 0;
  }
  select += `${req.body.idFrom}<=id`;

  if ((req.body.idTo > -1) && (req.body.idTo != '')) {
    select += ` and id<=${req.body.idTo}`;
  }
  if (req.body.firstname != '') {
    select += ` and firstname= '${req.body.firstname}'`;
  }
  if (req.body.lastname != '') {
    select += ` and lastname= '${req.body.lastname}'`;
  }
  if (req.body.email != '') {
    select += ` and email= '${req.body.email}'`;
  }
  if (req.body.number != '') {
    select += ` and number= '${req.body.number}'`;
  }
  if ((req.body.costFrom > -1) && (req.body.costFrom != '')) {
    select += ` and cost<=${req.body.costFrom}`;
  }
  if ((req.body.costTo > -1) && (req.body.costTo != '')) {
    select += ` and cost<=${req.body.costTo}`;
  }
  if (req.body.dateFrom != '') {
    select += ` and date<='${req.body.dateFrom}'`;
  }
  if (req.body.dateTo != '') {
    select += ` and date<='${req.body.dateTo}'`;
  }
  if (req.body.status != '') {
    select += ` and status= '${req.body.status}'`;
  }
  selectForDB(select).then(
    (result) => {
      res.json(result);
    },
    (error) => {
      res.json(error);
    },
  );
});

// запрос на создание элемента
app.post('/create', urlencodedParser, (req, res) => {
  selectForDB('select id FROM employee').then(
    (result) => {
      for (const array of result) if (!(array.id != req.body.id)) throw 'haveOrder';
      insertOne(req.body).then(
        (result) => {
          res.json(''+result);
        },
        (error) => {
          res.json(''+error);
        },
      );
    },
    (error) => {
      res.json(`Ошибка сервера: ${error}`);
    },
  );
});

// запрос на изменение существующего элемента
app.post('/editor', (req, res) => {
  selectForDB(`select * FROM employee where id = ${req.body.id}`).then(
    (result) => {
      for (const key in result[0]) {
        if (req.body[key] == 0) req.body[key] = result[0][key];
      }
      selectForDB(`DELETE FROM employee where id = ${req.body.id}`);
      insertOne(req.body);
      res.json('Элемент изменён');
    },
    (error) => {
      res.send(error);
    },
  );
});

app.post('/delete', urlencodedParser, (req, res) => {
  selectForDB(`DELETE FROM employee where id = ${req.body.id}`);
  res.json('элемент удален');
});

app.post('/main', urlencodedParser, (req, res) => {
  selectForDB('select * FROM users').then(
    (result) => {
      for (const array of result) {
        if ((array.name == req.body.userName) && (array.password == req.body.userPassword)) {
          selectForDB('select * FROM employee where id = 0').then(
            (result) => {
              res.render('main', { elem: result,user:req.body.userName});
            },
          );
          return 1;
        }
      }
      res.render('login', { message: 'Неверный логин или пароль'});
    },
    (error) => {
      res.send(error);
    },
  );
});
