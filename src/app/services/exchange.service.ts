import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import DeviceDetector from "device-detector-js";
import { environment } from 'src/environments/environment';

export interface IDeviceInfo {
  type: string;
  name: string;
}

export interface IMessage {
  senderName: string;
  text: string;
  date: Date;
  received?: boolean;
}

declare var Peer: any;

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private readonly _peer: any = new Peer(this.uuidv4(), {
    host: environment.peerjsHost,
    port: environment.peerjsPort,
    path: environment.peerjsPath
  });

  private deviceDetector = new DeviceDetector();

  private connection: any = undefined;

  private _receiveEvent: EventEmitter<IMessage> = new EventEmitter();
  private _connectedEvent: EventEmitter<void> = new EventEmitter();
  private _errorEvent: EventEmitter<any> = new EventEmitter();

  private _isHost = false;
  private _allMessages: IMessage[] = [];


  constructor() {
    this._peer.on('connection', (conn: any) => {
      console.log("Incoming connection!");
      this.connection = conn;
      this._isHost = true;
      this.listen();
    });
    this._peer.on('close', () => {
      console.warn('Connection closed...');
    });
    this._peer.on('disconnected', () => {
      console.warn('Connection lost...');
    });
    this._peer.on('error', (err: any) => {
      this._errorEvent.emit(err);
    });
  }

  private listen() {
    this._connectedEvent.emit();
    console.log("Listening...");
    this.connection.on('data', (data: any) => {
      const msg = this.parseMessage(data);
      this.allMessages.push(msg);
      this._receiveEvent.emit(msg);
    });
  }

  private parseMessage(data: string): IMessage {
    const dataObj = JSON.parse(data);
    return { senderName: dataObj?.senderName, text: dataObj?.text, received: true, date: dataObj?.date }
  }

  public connect(connectionId: string) {
    this.connection = this.peer.connect(connectionId);
    console.log("Connecting...");
    this.connection.on('open', () => {
      this.listen();
    });
  }

  public send(message: string) {
    if(!this.connection) {
      throw new Error('Not connected yet.');
    }
    const msg = this.buildMessage(this.deviceInfo.name, message);
    this.allMessages.push(msg);
    this.connection.send(JSON.stringify(msg));
  }

  private buildMessage(senderName: string, message: string): IMessage {
    return { senderName: senderName, text: message, received: false, date: new Date() }
  }

  public resetState() {
    this._isHost = false;
    this._allMessages = [];
  }

  public get peer() {
    return this._peer;
  }

  public get receiveEvent(): EventEmitter<IMessage> {
    return this._receiveEvent;
  }

  public get connectedEvent(): EventEmitter<void> {
    return this._connectedEvent;
  }

  public get errorEvent(): EventEmitter<any> {
    return this._errorEvent;
  }

  public get isHost(): boolean {
    return this._isHost;
  }

  public get allMessages(): IMessage[] {
    return this._allMessages;
  }

  public get deviceInfo(): IDeviceInfo {
    const deviceData = this.deviceDetector.parse(navigator.userAgent);
    let deviceInfo: IDeviceInfo = { type: deviceData.device?.type || 'unkown', name: '' };
    if(deviceData.device?.type === 'desktop') {
      deviceInfo.name = (deviceData.os?.name + ' ' + deviceData.os?.version).trim();
    } else {
      deviceInfo.name = (deviceData.device?.brand + ' ' + deviceData.device?.model).trim();
    }
    return deviceInfo;
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
