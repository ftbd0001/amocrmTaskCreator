const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_FILE = './data.json';

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/classes', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send("Ошибка при чтении файла данных.");
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/enroll', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send("Ошибка при чтении файла данных.");
            return;
        }
        const classes = JSON.parse(data);
        const { classId } = req.body;
        const classToEnroll = classes.find(c => c.id === classId);
        if (classToEnroll && classToEnroll.currentParticipants < classToEnroll.maxParticipants) {
            classToEnroll.currentParticipants++;
            fs.writeFile(DATA_FILE, JSON.stringify(classes, null, 2), err => {
                if (err) {
                    res.status(500).send("Ошибка при записи в файл данных.");
                    return;
                }
                res.send({ success: true, message: "Вы успешно записаны." });
            });
        } else {
            res.status(400).send({ success: false, message: "Запись невозможна." });
        }
    });
});

app.post('/unenroll', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send("Ошибка при чтении файла данных.");
            return;
        }
        const classes = JSON.parse(data);
        const { classId } = req.body;
        const classToUnenroll = classes.find(c => c.id === classId);
        if (classToUnenroll && classToUnenroll.currentParticipants > 0) {
            classToUnenroll.currentParticipants--;
            fs.writeFile(DATA_FILE, JSON.stringify(classes, null, 2), err => {
                if (err) {
                    res.status(500).send("Ошибка при записи в файл данных.");
                    return;
                }
                res.send({ success: true, message: "Ваша запись отменена." });
            });
        } else {
            res.status(400).send({ success: false, message: "Отмена не выполнена." });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
