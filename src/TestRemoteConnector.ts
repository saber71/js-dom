import EventEmitter from "eventemitter3"
import type { IRemoteConnector, IRemoteConnectorEventMap } from "./types.ts"

export class TestRemoteConnector extends EventEmitter implements IRemoteConnector {
  addEventListener<E extends keyof IRemoteConnectorEventMap>(
    type: E,
    listener: (arg: IRemoteConnectorEventMap[E]) => void
  ): void {
    this.on(type, listener)
  }

  close(): void {
    this.emit("close")
  }

  removeEventListener<E extends keyof IRemoteConnectorEventMap>(
    type: E,
    listener: (arg: IRemoteConnectorEventMap[E]) => void
  ): void {
    this.off(type, listener)
  }

  send(data: string): void {
    const obj = JSON.parse(data)
    this.emit(obj.type, obj)
  }

  open() {
    this.emit("open")
  }

  sendFromClient(data: string) {
    this.emit("message", data)
  }
}
