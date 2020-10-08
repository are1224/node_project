
////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();

////////////////////////////////////////////////////////////////////////////////

//const http = require('http');
var fs = require('fs');
var https = require('https');
const socketIO = require('socket.io')
//////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 8000;

const options = {
	key: fs.readFileSync('./keys/private.pem'),
	cert: fs.readFileSync('./keys/public.pem')
};

app.set("port", PORT);
app.use(express.static(__dirname + "/public"));
app.get('/', function(req,res) {
        res.send('index');
});

/////////////////////////////////////////////////////////////////////////////

//var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

/////////////////////////////////////////////////////////////////////////////

var io = socketIO.listen(httpsServer);

let clients = 0;

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer');
            }
        }
        else
            this.emit('SessionActive');
        clients++;
    });
    socket.on('Offer', SendOffer);
    socket.on('Answer', SendAnswer);
    socket.on('disconnect', Disconnect);
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2);
            this.broadcast.emit("Disconnect");
        clients--;
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer);
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data);
}

httpsServer.listen(app.get('port'),function(){
    console.log('익스프레스 서버를 시작했습니다. : '+app.get('port'));
});
