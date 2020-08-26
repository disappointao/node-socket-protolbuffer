//简单聊天
const net = require('net');

//保存目前的连接数量
let clients = {};
//广播所有人的聊天消息，除了自己的
function broadcast (nickname,msg){
  if(Object.keys(clients).indexOf(nickname)!== -1){
    Object.keys(clients).forEach(key=>{
      if(key !== nickname) {
        clients[key].write(`${nickname}:${msg}`)
      }
    })
  }else{
    Object.keys(clients).forEach(key=>{
      clients[key].write(`用户${nickname}下线了`)
    })
  }
}
const server = net.createServer(socket => {
  let nickname = '';
  server.getConnections((error, count)=>{
    socket.write(`欢迎大家来到聊天室,当前聊天室在线人数为${count},请大家输入自己的名字 \r\n`);
  })
  socket.on('data',(msg)=>{
    if(!nickname){
      nickname = msg.toString();
      clients[nickname] = socket;
      socket.write(`设置成功，您的用户名为${nickname}`);
    }else{
      broadcast(nickname,msg.toString());
    }
   socket.on('end',()=>{
     clients[nickname] && clients[nickname].destroy();
     delete clients[nickname];
     broadcast(nickname);
   })
  })
})
server.listen(8080,()=>{
  console.log('服务端启动')
})
