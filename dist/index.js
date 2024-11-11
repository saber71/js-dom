import EventEmitter from 'eventemitter3';

/**
 * Remote 类负责通过一个远程连接器（IRemoteConnector）来处理远程操作网页。
 * 它可以添加插件（IRemoteAddon）来扩展其功能，并通过监听连接器的事件来响应各种情况，
 * 如消息接收、连接打开、关闭和错误。
 */ class Remote {
    connector;
    // 存储命令处理器的映射表
    _commandHandleMap;
    // 存储插件的数组
    _addons;
    /**
   * 构造函数，初始化Remote实例。
   * @param connector 用于远程通信的连接器实例。
   */ constructor(connector){
        this.connector = connector;
        this._commandHandleMap = new Map();
        this._addons = [];
        // 绑定事件处理函数，确保其执行上下文正确
        this._handleClose = this._handleClose.bind(this);
        this._handleMessage = this._handleMessage.bind(this);
        this._handleError = this._handleError.bind(this);
        this._handleOpen = this._handleOpen.bind(this);
        // 添加事件监听器以响应连接器的各种事件
        connector.addEventListener("message", this._handleMessage);
        connector.addEventListener("open", this._handleOpen);
        connector.addEventListener("close", this._handleClose);
        connector.addEventListener("error", this._handleError);
    }
    /**
   * 添加一个或多个插件到Remote实例中。
   * @param addons 要添加的插件数组。
   */ addAddon(...addons) {
        for (let addon of addons){
            this._addons.push(addon);
            const cmdHandlers = addon.use(this);
            for (let handler of cmdHandlers){
                // 检查并添加命令处理器到映射表中
                if (!this._commandHandleMap.has(handler.for)) this._commandHandleMap.set(handler.for, handler);
                else throw new Error(`重复注册命令处理器：${handler.for}`);
            }
        }
    }
    /**
   * 回复一个命令。
   */ reply(data) {
        this.connector.send(JSON.stringify(data));
    }
    /**
   * 主动发送消息给服务器。
   */ sendMessage(msg) {
        this.connector.send(JSON.stringify(msg));
    }
    /**
   * 发送错误消息。
   */ sendError(reason) {
        this.sendMessage({
            subject: "error",
            data: reason
        });
    }
    /**
   * 清理Remote实例，移除所有事件监听器和插件。
   */ dispose() {
        // 移除所有事件监听器
        this.connector.removeEventListener("error", this._handleError);
        this.connector.removeEventListener("message", this._handleMessage);
        this.connector.removeEventListener("close", this._handleClose);
        this.connector.removeEventListener("open", this._handleOpen);
        // 清空插件数组和命令处理器映射表
        this._addons.length = 0;
        this._commandHandleMap.clear();
    }
    /**
   * 处理连接打开事件。
   * @param arg 事件参数。
   */ _handleOpen(arg) {
        // 通知所有插件连接已打开
        for (let addon of this._addons){
            if (addon.handleOpen) {
                addon.handleOpen(arg);
            }
        }
    }
    /**
   * 处理错误事件。
   * @param e 错误事件。
   */ _handleError(e) {
        // 通知所有插件发生错误
        for (let addon of this._addons){
            if (addon.handleError) addon.handleError(e);
        }
    }
    /**
   * 处理消息事件。
   * @param data 接收到的消息数据。
   */ _handleMessage(data) {
        // 解析消息数据并尝试找到相应的命令处理器
        const obj = JSON.parse(data);
        const cmdArray = [];
        if (obj instanceof Array) cmdArray.push(...obj);
        else cmdArray.push(obj);
        for (let cmd of cmdArray){
            if (this._commandHandleMap.has(cmd.type)) this._commandHandleMap.get(cmd.type).handle(cmd);
            else throw new Error(`没有注册的命令处理器：${cmd.type}`);
        }
    }
    /**
   * 处理连接关闭事件。
   * @param arg 事件参数。
   */ _handleClose(arg) {
        // 通知所有插件连接已关闭
        for (let addon of this._addons){
            if (addon.handleClose) addon.handleClose(arg);
        }
    }
}

class TestRemoteConnector extends EventEmitter {
    addEventListener(type, listener) {
        this.on(type, listener);
    }
    close() {
        this.emit("close");
    }
    removeEventListener(type, listener) {
        this.off(type, listener);
    }
    send(data) {
        const obj = JSON.parse(data);
        this.emit(obj.type, obj);
    }
    open() {
        this.emit("open");
    }
    sendFromClient(data) {
        this.emit("message", data);
    }
}

export { Remote, TestRemoteConnector };
