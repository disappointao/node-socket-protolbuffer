let net = require('net');
let clients  = {};
// 改名 r命令
function rename(key,data,socket){
  clients[key].nickname = data;
  socket.write(`您当前的用户名是${data}\r\n`);
}
// 展示用户列表 l命令
function list(socket){
  let str = `当前用户列表是:\r\n`
  let ls = Object.keys(clients).map(key=>{
    return clients[key].nickname;
  }).join('\r\n');
  socket.write(str+ls+'\r\n');
}
// 私聊 nickname：用户名 content：发送的内容 key
function privateChat(nickname,content,key){
  let user;
  Object.keys(clients).forEach(function(key){
    if(clients[key].nickname === nickname){
      user = clients[key].socket;
    }
  });
  user.write(clients[key].nickname+":"+content+'\r\n');
}
//广播
function broadcast(nickname,content){
  Object.keys(clients).forEach(item=>{
    if(clients[item].nickname!= nickname){
      clients[item].socket.write(content+'\r\n')
    }
  })
}

let server = net.createServer(function (socket) {
//用户默认是匿名的，所以用socket.remoteAddress + socket.remotePort来标识一个用户
  let key = socket.remoteAddress + socket.remotePort; // 唯一
  clients[key] = {nickname:'匿名',socket}//默认用户名

  server.getConnections((err, count) => {
    socket.write(`欢迎来到聊天室 当前用户${count}个\r\n`);
  });
  socket.setEncoding('utf8');
  socket.on('data', function (chunk) {
    chunk = chunk.replace(/\r\n/, '');
    let chars = chunk.split(':');
    switch (chars[0]) {
      case 'r': // r:zhangsan
        rename(key,chars[1],socket);
        break;
      case 'l':
        list(socket);
        break;
      case 'b': // b:content
        broadcast(key,chars[1]);
        break;
      case 's': // s:用户名:content
        privateChat(chars[1],chars[2],key);
        break;
      default:
        socket.write('当前命令无法解析，重新输入\r\n')
    }
  });

});
server.listen(8080, function () {
  console.log(`server start 8080`);
})
