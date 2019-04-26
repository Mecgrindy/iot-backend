var admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://iot-backend-2a737.firebaseio.com"
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });
const FieldValue = require('firebase-admin').firestore.FieldValue;

var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', function (req, res) {
    res.json({ message: "welcome" });
});

app.get('/sectors', function (req, res) {
    var datas = [];

    db.collection('sectors').get()
        .then((snapshot) => {
            // console.log(snapshot);
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                datas.push({ id: doc.id, data: doc.data() });
            });
            res.json(datas);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            res.json(err);
        });
});

app.get('/sectors/getById', function (req, res) {
    var postBody = req.query ? req.query : null;
    console.log(postBody);
    if (postBody) {
        db.collection('sectors').doc(postBody.id).get().then(doc => {
            res.json(doc.data());
        });
    }
});


app.post('/sectors', function (req, res) {
    var postBody = req.body ? req.body : null;
    console.log(postBody);
    if (postBody) {
        var data = {
            name: postBody.name
        };
        db.collection('sectors').add(data).then(ref => {
            res.json({ id: ref.id, data: data });
        });
    }
});

app.put('/sectors', function (req, res) {
    var postBody = req.body ? req.body : null;
    console.log(postBody);
    if (postBody) {
        var data = {
            name: postBody.data.name
        };
        db.collection('sectors').doc(postBody.id).update(data).then(ref => {
            res.json({ id: ref.id, data: data });
        });
    }
});

app.delete('/sectors', function (req, res) {
    var postBody = req.query ? req.query : null;
    console.log(postBody);
    if (postBody) {
        db.collection('sectors').doc(postBody.id).delete().then(() => {
            res.json({ message: 'success' });
        });
    }
});

app.post('/zones', function (req, res) {
    var postBody = req.body ? req.body : null;
    console.log(postBody);
    if (postBody) {
        var data = {
            zones: postBody.data
        };
        db.collection('sectors').doc(postBody.id).update(data).then(() => {
            res.json(postBody);
        });
    }
});

app.delete('/zones', function (req, res) {
    var postBody = req.query ? req.query : null;
    console.log(postBody);
    if (postBody) {
        db.collection('sectors').doc(postBody.id).update({
            zones: JSON.parse(postBody.data)
        }).then(() => {
            res.json({ message: 'success' });
        });
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address = 'localhost';
    var port = server.address().port;
    console.log("Example app listening at localhost:%s", port);
})