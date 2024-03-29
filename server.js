var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io'); // 加入 Socket.IO

var server = http.createServer(function(request,response){
	console.log('Connection');
	var path = url.parse(request.url).pathname;
	
	switch(path){
	case '/':
		response.writeHead(200,{'Content-Type':'text/html'});
		response.write('Hello,world');
		response.end();
		break;
	default:
		fs.readFile(__dirname + path,function(error,data){
			if(error){
				response.writeHead(404);
				response.write("opps this doesn't exist - 404");
			} else {
				response.writeHead(200,{"Content-Type":"text/html"});
				response.write(data,"utf8");
			}
			response.end();
		});
	}	
});

server.listen(8001);
//io.listen(server); // 開啟 Socket.IO 的 listener
var serv_io = io.listen(server);


serv_io.sockets.on('connection', function(socket) {
   setInterval(function() {
    socket.emit('date', {'date': new Date()});
  }, 1000);
   // 接收來自於瀏覽器的資料
  socket.on('client_data', function(data) {
    process.stdout.write(data.letter);
  });
});