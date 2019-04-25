var admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://iot-backend-2a737.firebaseio.com"
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.json({ message: "welcome" });
});

app.get('/sectors', function (req, res) {
    var datas = [];

    db.collection('sectors').get()
        .then((snapshot) => {
            console.log(snapshot);
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


app.post('/sectors', function (req, res) {
    const postBody = req.body ? req.body : null;
    console.log(postBody);
    if (postBody) {
        db.collection('sectors').add({
            name: postBody.name
        }).then(ref => {
            res.json({ id: ref.id });
        });
    }
});

app.delete('/sectors', function (req, res) {
    const postBody = req.body ? req.body : null;
    console.log(postBody);
    if (postBody) {
        db.collection('sectors').doc(postBody.id).delete().then(ref => {
            res.json({ message: 'success' });
        });
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address = 'localhost';
    var port = server.address().port;
    console.log("Example app listening at localhost:%s", port);
})