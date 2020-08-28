class Transcode {
  constructor() {
    this.packageHeaderLen = 4;
    this.serialNumber = 0;
    this.packageSerialNumberLen = 2;
  }
  encode(data,serialNumber){
    const body = Buffer.from(data);
    const header = Buffer.alloc(this.packageHeaderLen);
    header.writeInt16BE(serialNumber || this.serialNumber);
    header.writeInt16BE(body.length,this.packageSerialNumberLen);

    if(serialNumber === undefined){
      this.serialNumber++
    }
    return Buffer.concat([header,body]);
  }
  decode(buffer){
    const header = buffer.slice(0,this.packageHeaderLen);
    const body = buffer.slice(this.packageHeaderLen);

    return {
      serialNumber:header.readInt16BE(),
      bodyLength:header.readInt16BE(this.packageSerialNumberLen),
      body:body.toString()
    }
  }
  getPackageLength(buffer){
    if(buffer.length<this.packageHeaderLen){
      return 0
    }
    return this.packageHeaderLen + buffer.readInt16BE(this.packageSerialNumberLen);
  }
}
module.exports = Transcode;
