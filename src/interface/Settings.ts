export interface Settings {
  // grpc bind port
  port: string | number;

  // grpc bind host
  host?: string;

  // ca file path string
  ca?: string;

  // cert file path string
  cert?: string;

  // key file path string
  key?: string;
}
