const net = require("net");
function startClient(){
  const client = net.connect({port:8080},()=>{
    console.log('已经连接到服务起了');
    client.write("你好服务器，我是客户端")
  })
  client.on("data",(data)=>{
    console.log("收到服务器发送来的消息",data.toString());
  });
  client.on("end",(err)=>{
    if(!err){
      console.log('客户端close')
    }else{
      console.log('客户端连接失败end:',err)
    }
  })
  client.on("error",(err)=>{
    if(err){
      console.log('连接发生错误',err.code);
      client.destroy();
    }
  })
}
startClient();
