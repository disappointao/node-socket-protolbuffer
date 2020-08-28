//TCP封包与解包

const net = require('net');
const Transcode = require('../lib/transcode');
const transcode = new Transcode();
const host = '127.0.0.1';
let port = 8080;

const server = net.createServer(socket => {
  console.log('客户端连接上了')
  let overageBuffer=null; // 上一次 Buffer 剩余数据
  socket.on('data',buffer =>{
    if(overageBuffer){
      buffer = Buffer.concat([overageBuffer,buffer]);
    }
    let packageLength = 0;
    while (packageLength = transcode.getPackageLength(buffer)){
      const package = buffer.slice(0,packageLength);
      buffer = buffer.slice(packageLength);

      const result = transcode.decode(package);
      console.log(result);
      socket.write(transcode.encode(result.body,result.serialNumber));
    }
    overageBuffer = buffer;
  })
  socket.on('error',()=>{
    console.log('客户端异常')
  })
})
server.listen(port,host,()=>{
  console.log(`服务器已启动${host}${port}`)
})
server.on('close',()=>{
  console.log('服务器已关闭')
})
server.on('error',(err)=>{
  if(err.code ==='EADDRINUSE'){
    console.log('端口已被占用，重启中');
    port++;
    server.close();
    server.listen(port, host);
  }else {
    console.error('服务器异常：', err);
  }
})
