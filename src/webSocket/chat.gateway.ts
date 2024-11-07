// src/chat.gateway.ts
import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { create } from 'domain';
import { disconnect } from 'process';
import { Subscriber } from 'rxjs';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway(3001, { cors: true }) // El puerto 3001 puede ser ajustado según tu configuración
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      // Puedes emitir un evento personalizado como 'userConnect'
      this.server.emit('userConnect', { message: 'A new user has connected', userId: client.id });
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.server.emit('userDisconnect', { message: 'A user has disconnected', userId: client.id });

    }
  
    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, payload: { message: string, username: string }) {
      // Emitir el mensaje a todos los clientes conectados
      this.server.emit('receiveMessage', payload);
    }

    @SubscribeMessage('cortarHule')
    HandleCortarHule(client: Socket, payload: {message: string}){
      console.log(payload);
      this.server.emit('corteRecibido')
    }

    @SubscribeMessage('joinRoom')
    HandleRoomName(client: Socket, data){
      const [username, salaname]  = data 
      console.log(username);
      client.join(salaname);
      this.server.to(salaname).emit('joinedRoom', username) 
    }

    @SubscribeMessage('joinRoomMessage')
    HandleRoomMessage(client: Socket, data){
      const [mensaje, salaname, username] = data;
      console.log(mensaje, salaname)
      this.server.to(salaname).emit('receiveMessage', {message:mensaje, username} )
    }

    @SubscribeMessage('UsuarioDesconectado')
    HandleRoomOutgoing(client: Socket, data){
      const [salaname, username] = data;
      console.log("DESCONECTAR", username, salaname)
      this.server.to(salaname).emit('UserOut', username)
    }
  }
  
  //crear un metodo para enviar mensajes para los que estan en las sala 