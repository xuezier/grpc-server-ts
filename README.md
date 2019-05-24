[![NPM version][npm-image]][npm-url]
# Installation
```
npm install grpc-server-ts --save
```

## protobuf
hello.proto
```proto
syntax = "proto3";

option java_multiple_files = true;
option java_package = "io.grpc.service.test";
option objc_class_prefix ="RTG";

package hello;

service Hello {
  rpc say(stream Empty) returns (stream Word) {};
}

message Empty {

}

message Word {
  string word = 1;
}
```

## define a service
```ts
import { Route, Service } from "grpc-server-ts";

@Service('path_to_hello.proto')
export class HelloService {
  @Route
  public async say() {
    return 'hello world';
  }
}
```

## registry service grpc
```ts
import { RpcRegistry, Settings } from 'grpc-server-ts';

@Settings(settings)
class RPC extends RpcRegistry { }
RPC.start();
```

### settings
```js
{
  port: "3333",                     // listen port
  host: "localhost",                // listen host
  ca: "runtime/rpc/ca.crt",         // ca file path
  cert: "runtime/rpc/server.crt",   // cert file path
  key: "runtime/rpc/server.key"     // key file path
}
```

### Sponsor
![wechat](http://cdn-public.imxuezi.com/WX20190524-211855@2x.png?imageView2/0/w/200/q/100)

![alipay](http://cdn-public.imxuezi.com/WX20190524-212118@2x.png?imageView2/0/w/200/q/100)

[wechat-pay]: http://cdn-public.imxuezi.com/WX20190524-211855@2x.png
[npm-image]: https://img.shields.io/npm/v/grpc-server-ts.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/grpc-server-ts