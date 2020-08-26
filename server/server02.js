const net = require('net');
let port = 8080;
let address = '127.0.0.1'
const server = net.createServer(socket => {
  console.log(`${socket.remoteAddress}:${socket.remotePort}客户端连上了`)
  server.getConnections((error, count)=>{
    socket.write(`当前在线连接数为${count}`)
  })
  socket.setEncoding('utf8');
  socket.on('data',(data)=>{
    console.log('接收到消息',data);
    socket.end();
    server.close();
    server.unref();
  });
  socket.on('end',function(){
    console.log(`客户端关闭`);
  });
})
server.listen(port,address,()=>{
  console.log(`服务器启动：${server.address().address} ${server.address().port}`)
});
server.on('error',(err)=>{
  //EADDRINUSE 当前端口号被调用
  if(err.code === 'EADDRINUSE'){
    server.listen(++port)
  }
})
server.on('close',()=>{
  console.log('服务器关闭了');
})
