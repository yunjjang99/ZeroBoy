import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class PuppeteerGateway {
  @WebSocketServer()
  server: Server;

  emit(event: string, data: any) {
    this.server.emit(event, data);
  }
}
