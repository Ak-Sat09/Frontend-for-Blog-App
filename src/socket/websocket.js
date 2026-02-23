import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL = "https://demo-cicd-latest-6p2b.onrender.com";

let stompClient = null;

export const connectSocket = (onConnected) => {
  const socket = new SockJS(`${BASE_URL}/ws`);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
  });

  stompClient.onConnect = () => {
    console.log("WebSocket Connected");
    onConnected();
  };

  stompClient.activate();
};

export const subscribeToBlog = (blogId, callback) => {
  if (!stompClient) return;

  return stompClient.subscribe(
    `/topic/blog/${blogId}`,
    (message) => {
      const updatedBlog = JSON.parse(message.body);
      callback(updatedBlog);
    }
  );
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};