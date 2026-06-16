import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:5000";

class SocketService {

  private socket: Socket;
  private replyHandler: any;

  constructor() {

    this.socket = io(
      SOCKET_URL,
      {
        autoConnect: false,

        transports: [
          "websocket",
          "polling",
        ],

        reconnection: true,

        reconnectionAttempts: 20,

        reconnectionDelay: 1000,

        withCredentials: true,
      }
    );
  }

  connect(userId?: string) {
    if (!this.socket.connected) {

      this.socket.connect();

      this.socket.off("connect");

      this.socket.on(
        "connect",
        () => {

          console.log(
            "SOCKET CONNECTED:",
            this.socket.id
          );

          if (userId) {
            this.socket.emit(
              "register-user",
              userId
            );
          }
        }
      );
    }
  }

  /* ================= GENERIC EMIT ================= */
  emit(
    event: string,
    data?: any
  ) {

    this.socket.emit(
      event,
      data
    );
  }

  /* ================= ABOUT ADMIN ROOM ================= */
joinAboutAdmin() {
  this.socket.emit("join-about-admin");
}

leaveAboutAdmin() {
  this.socket.emit("leave-about-admin");
}

onAboutUpdate(callback: (data: any) => void) {
  this.socket.on("about-updated", callback);
}

onAboutDeleted(callback: () => void) {
  this.socket.on("about-deleted", callback);
}

offAboutUpdate() {
  this.socket.off("about-updated");
}

offAboutDeleted() {
  this.socket.off("about-deleted");
}

  /* ================= GENERIC ON ================= */
  on(
    event: string,
    callback: (...args: any[]) => void
  ) {

    this.socket.on(
      event,
      callback
    );
  }

  joinAdminMessages() {

    this.socket.emit(
      "join-messages"
    );
  }

  joinUserRoom(userId: string) {

    this.socket.emit(
      "join-user-room",
      userId
    );
  }

  onMessage(
    callback: (data: any) => void
  ) {

    this.socket.on(
      "message",
      (
        data: any,
        ack?: (response: any) => void
      ) => {

        callback(data);

        if (ack) {
          ack({
            received: true,
          });
        }
      }
    );
  }

  onReply(callback: (data: any) => void) {

    this.replyHandler = (
      event: string,
      data: any
    ) => {

      if (
        event.startsWith(
          "message-reply:"
        )
      ) {
        callback(data);
      }
    };

    this.socket.onAny(this.replyHandler);
  }

  offReply() {
    if (this.replyHandler) {
      this.socket.offAny(
        this.replyHandler
      );
    }
  }

  /* ================= GENERIC OFF ================= */
  off(
    event: string,
    callback?: (...args: any[]) => void
  ) {

    this.socket.off(
      event,
      callback
    );
  }

  disconnect() {

    if (this.socket.connected) {

      this.socket.disconnect();
    }
  }

  get instance() {

    return this.socket;
  }
}

export const socketService =
  new SocketService();

export const socket =
  socketService.instance;