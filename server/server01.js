const net = require('net');
let port = 8080;
let errTime = 0;
function startServer(){
  const server = net.createServer(socket => {
    console.log('有客户端连接上服务器了：',socket.remoteAddress,socket.remotePort);
    socket.write("你好，我是服务器")
    socket.on("data",(data)=>{
      console.log('收到客户端发来的消息：',data.toString());
    })
    // close事件只有调用close方法才会触发
    socket.on("close",(err)=>{
      if(!err){
        console.log('客户端成功断开连接close',socket.remoteAddress,socket.remotePort)
      }else{
        console.log('客户端断开连接失败close',socket.remoteAddress,socket.remotePort)
      }
    })
    socket.on("end",(err)=>{
      if(!err){
        console.log('客户端成功断开连接end',socket.remoteAddress,socket.remotePort)
      }else{
        console.log('客户端断开连接失败end',socket.remoteAddress,socket.remotePort)
      }
    })
  });
  server.listen(port,()=>{
    console.log('server服务已启动')
    errTime = 0;
  })
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.log('地址正被使用，重试中...');
      console.log(errTime);
      errTime++;
      if(errTime>=10){
        port++
      }
      setTimeout(() => {
        server.close();
        server.listen(port);
      }, 1000);
    } else {
      console.error('服务器异常：', err);
    }
  });
}
startServer();
