import { default as default_2 } from 'eventemitter3';

/**
 * 定义一个远程插件接口，允许插件向RemoteDom注册命令处理程序，并响应连接器事件
 */
export declare interface IRemoteAddon {
    /**
     * 返回一组命令处理程序
     * @returns 返回一组命令处理程序
     */
    use(remote: Remote): IRemoteCommandHandler[];
    /**
     * 可选地处理连接打开事件
     * @param arg - 事件的具体信息
     */
    handleOpen?(arg: IRemoteConnectorEventMap["open"]): void;
    /**
     * 可选地处理错误事件
     * @param arg - 事件的具体信息
     */
    handleError?(arg: IRemoteConnectorEventMap["error"]): void;
    /**
     * 可选地处理连接关闭事件
     * @param arg - 事件的具体信息
     */
    handleClose?(arg: IRemoteConnectorEventMap["close"]): void;
}

/**
 * 定义一个远程命令接口，用于指定命令的类型
 * @template Type - 命令的类型，默认为字符串
 */
export declare interface IRemoteCommand<Type extends string = string> {
    type: Type;
}

/**
 * 定义一个远程命令处理程序接口，用于处理特定类型的远程命令
 * @template CmdType - 命令的类型，默认为字符串
 */
export declare interface IRemoteCommandHandler<CmdType extends string = string> {
    readonly for: CmdType;
    /**
     * 处理特定类型的远程命令
     * @param cmd - 要处理的远程命令
     */
    handle(cmd: IRemoteCommand<CmdType>): void;
}

/**
 * 定义一个用来回复远程命令的接口
 */
export declare interface IRemoteCommandReplay {
    replyId: string;
    data: string;
}

/**
 * 定义一个可以收到远程命令回复的接口
 * @template Type - 命令的类型，默认为字符串
 */
export declare interface IRemoteCommandReplyable<Type extends string = string> extends IRemoteCommand<Type> {
    replyId: string;
}

/**
 * 定义远程连接器接口，用于与远程服务进行通信
 */
export declare interface IRemoteConnector {
    /**
     * 发送数据到远程服务
     * @param data 要发送的数据
     */
    send(data: string): void;
    /**
     * 关闭与远程服务的连接
     */
    close(): void;
    /**
     * 添加事件监听器，以处理特定类型的事件
     * @param type 事件类型，必须是RemoteConnectorEventMap中的键之一
     * @param listener 事件处理函数，接收特定事件类型对应的数据
     */
    addEventListener<E extends keyof IRemoteConnectorEventMap>(type: E, listener: (arg: IRemoteConnectorEventMap[E]) => void): void;
    /**
     * 删除事件监听器
     * @param type 事件类型，必须是RemoteConnectorEventMap中的键之一
     * @param listener 事件处理函数，接收特定事件类型对应的数据
     */
    removeEventListener<E extends keyof IRemoteConnectorEventMap>(type: E, listener: (arg: IRemoteConnectorEventMap[E]) => void): void;
}

/**
 * 定义远程连接器的事件映射，用于描述支持的事件类型及其对应的事件数据
 */
export declare interface IRemoteConnectorEventMap {
    /** 表示接收到的消息 */
    message: string;
    /** 表示连接关闭 */
    close: void;
    /** 表示发生错误 */
    error: Event;
    /** 表示连接已打开 */
    open: void;
}

/**
 * 定义一个用于主动发送消息接口，用于描述消息的主题和数据
 */
export declare interface IRemoteMessage {
    subject: string;
    data: string;
}

/**
 * Remote 类负责通过一个远程连接器（IRemoteConnector）来处理远程操作网页。
 * 它可以添加插件（IRemoteAddon）来扩展其功能，并通过监听连接器的事件来响应各种情况，
 * 如消息接收、连接打开、关闭和错误。
 */
export declare class Remote {
    readonly connector: IRemoteConnector;
    private readonly _commandHandleMap;
    private readonly _addons;
    /**
     * 构造函数，初始化Remote实例。
     * @param connector 用于远程通信的连接器实例。
     */
    constructor(connector: IRemoteConnector);
    /**
     * 添加一个或多个插件到Remote实例中。
     * @param addons 要添加的插件数组。
     */
    addAddon(...addons: IRemoteAddon[]): void;
    /**
     * 回复一个命令。
     */
    reply(data: IRemoteCommandReplay): void;
    /**
     * 主动发送消息给服务器。
     */
    sendMessage(msg: IRemoteMessage): void;
    /**
     * 发送错误消息。
     */
    sendError(reason: string): void;
    /**
     * 清理Remote实例，移除所有事件监听器和插件。
     */
    dispose(): void;
    /**
     * 处理连接打开事件。
     * @param arg 事件参数。
     */
    private _handleOpen;
    /**
     * 处理错误事件。
     * @param e 错误事件。
     */
    private _handleError;
    /**
     * 处理消息事件。
     * @param data 接收到的消息数据。
     */
    private _handleMessage;
    /**
     * 处理连接关闭事件。
     * @param arg 事件参数。
     */
    private _handleClose;
}

export declare class TestRemoteConnector extends default_2 implements IRemoteConnector {
    addEventListener<E extends keyof IRemoteConnectorEventMap>(type: E, listener: (arg: IRemoteConnectorEventMap[E]) => void): void;
    close(): void;
    removeEventListener<E extends keyof IRemoteConnectorEventMap>(type: E, listener: (arg: IRemoteConnectorEventMap[E]) => void): void;
    send(data: string): void;
    open(): void;
    sendFromClient(data: string): void;
}

export { }
