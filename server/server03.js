//超时设置,暂停与恢复
const net = require('net');

const server = net.createServer(socket => {
  socket.pause();
  // socket.setTimeout(5000);
  setTimeout(()=>{
    socket.resume();
  },5000);
  socket.on('data',data => {
    console.log(data.toString())
  })
  socket.on('timeout',()=>{
    console.log('客户端连接超时')
    socket.end();
  })
  socket.on('end',()=>{
    console.log('客户端关闭')
  })
})
server.listen(8080,()=>{
  console.log('服务器启动')
});
