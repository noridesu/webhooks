const express = require('express')
const app = express()
//const port = 3000
const port = 80

const wsio = require("ws").Server;
//const s = new wsio({ port: 8080 });
const wsclient = new wsio({ port: 8080, path: "/a-zlkD*L.p)D_tez&,!S6a(eAzv2G3" });

let parsed = {}

app.use(express.json())

app.post('/', (req, res) => {

  console.log("post url: " + req.url);
  console.log("post headers: " + req.headers);

  console.log("get ip: " + req.ip);
  console.log("get path: " + req.path);
  console.log("get protocol: " + req.protocol);

  parsed = req.body

  if (!(parsed.event)) {

    return res.json({
      "ret": false,
      "error": "invalid parameter"
    })

  }

  //phone.callee_ringing
  console.log("parsed.event: " + parsed.event);

  //1639816421362
  console.log("parsed.event_ts: " + parsed.event_ts);

  //P3JINJZXTfWCTuSQC4ZtUg
  console.log("parsed.payload.account_id: " + parsed.payload.account_id);

  //7042957882494858735  call_id
  console.log("parsed.payload.object.call_id: " + parsed.payload.object.call_id);

  //　callee.user_id
  console.log("parsed.payload.object.callee.user_id: " + parsed.payload.object.callee.user_id);

  //+815017911078　着信050番号
  console.log("parsed.payload.object.callee.phone_number: " + parsed.payload.object.callee.phone_number);

  //800 callee.extension_number
  console.log("parsed.payload.object.callee.extension_number: " + parsed.payload.object.callee.extension_number);

  //Asia/Tokyo
  console.log("parsed.payload.object.callee.timezone: " + parsed.payload.object.callee.timezone);

  //Windows_Client(5.8.4.1736)
  console.log("parsed.payload.object.callee.device_type: " + parsed.payload.object.callee.device_type);

  //+819052997667 発信者番号
  console.log("parsed.payload.object.caller.phone_number: " + parsed.payload.object.caller.phone_number);

  // caller.extension_number)
  console.log("parsed.payload.object.caller.extension_number: " + parsed.payload.object.caller.extension_number);

  //
  //console.log("parsed.payload.object.forwarded_by.name: " + parsed.payload.object.forwarded_by.name);

  //
  //console.log("parsed.payload.object.forwarded_by.extension_number: " + parsed.payload.object.forwarded_by.extension_number);

  //
  //console.log("parsed.payload.object.forwarded_by.extension_type: " + parsed.payload.object.forwarded_by.extension_type);

  //2021-12-18T09:04:08Z
  console.log("parsed.payload.object.ringing_start_time: " + parsed.payload.object.ringing_start_time);

  wsclient.clients.forEach(client => {
    client.send('func=incom&from_tel=' + parsed.payload.object.caller.phone_number + '&to_tel=' + parsed.payload.object.callee.phone_number); //接続しているクライアント全てに送信
  });

  res.json({
    "ret": true,
    "json": parsed
  })

})


//app.get('/', (req, res) => res.send('Hello World!'));

app.get('/', (req, res) => {

  console.log("get url: " + req.url);
  console.log("get headers: " + req.headers);

  console.log("get ip: " + req.ip);
  console.log("get path: " + req.path);
  console.log("get protocol: " + req.protocol);
  console.log("get query.name: " + req.query.name);

  res.json({
    "ret": true,
    "json": parsed
  })

})

app.listen(port, () => {

  console.log('listening on port: ' + port);

});

////////////////////////////////////////

//クライアント接続時
wsclient.on("connection", ws => {

    console.log('client connection!');

    //メッセージ受信時
    ws.on("message", message => {

        console.log("Received: " + message);

        ws.send("send client only"); //送信してきたクライアントのみに返す

        wsclient.clients.forEach(client => {
            client.send('send all client'); //接続しているクライアント全てに送信
        });

        wsclient.clients.forEach(client => {
            if (client !== ws)
                client.send('send other client'); //接続している自分以外のクライアント全てに送信
        });

    });

    // クライアント切断時
    ws.on('close', () => {
        console.log('I lost a client');
    });

});
