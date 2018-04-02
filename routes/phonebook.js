const express = require('express');
const pg = require('pg');
const router = express.Router();

// "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";
const conString = "postgres://postgres:root@localhost:5432/postgres";

router.get('/', (req, res) => {
    const client = new pg.Client(conString);
    client.connect();

    client.query('SELECT * FROM directory', (err, results) => {
        if (err) throw err;
        res.json(results.rows);
        client.end();
    });
});

router.post('/add', (req, res) => {
    if(checkData(req.body)) {
        const client = new pg.Client(conString);
        client.connect();

        const data = {
            fio: req.body.fio,
            city: req.body.city,
            country: req.body.country,
            phone_number: req.body.phone_number
        };

        client.query('INSERT INTO directory (fio, city, country, phone_number) values($1, $2, $3, $4)',
            [data.fio, data.city, data.country, data.phone_number], (err, results) => {
                if (err) {
                    return res.send('Ошибка. Введенный номер занят');
                }
                else return res.send('Запись успешно добавлена');
                client.end();
            });
    }
    else {
        res.send('Ошибка. Не были заполнены все поля');
    }
});

router.post('/update', (req, res) => {
    if(checkData(req.body)) {
        const client = new pg.Client(conString);
        client.connect();

        const id = req.body.id;
        const data = {
            fio: req.body.fio,
            city: req.body.city,
            country: req.body.country,
            phone_number: req.body.phone_number
        };

        client.query('UPDATE directory SET fio=($1), city=($2), country=($3), phone_number=($4) WHERE directory.id = ($5)',
            [data.fio, data.city, data.country, data.phone_number, id], (err, results) => {
                if (err) {
                    return res.send('Ошибка. Введенный номер занят');
                }
                else return res.send('Запись успешно обновлена');
                client.end();
            });
    }
    else {
        res.send('Ошибка. Не были заполнены все поля');
    }
});

router.post('/delete', (req, res) => {
    const client = new pg.Client(conString);
    client.connect();

    const id = req.body.id;
    client.query('DELETE FROM directory WHERE id=($1)', [id], (err, results) => {
            if (err) { console.log(err); return res.send(err);}
            else return res.send('Запись успешно удалена');
            client.end();
        });
});

const checkData = data => {
  for(const key in data){
      if(data[key] == ''){
          return false;
      }
  }

  return true;
};

module.exports = router;
