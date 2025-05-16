import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws-reminder';

function ReminderNotifier({ userId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/reminder/${userId}`, (message) => {
        const reminderText = message.body;
        setMessages((prev) => [...prev, reminderText]);

        // Show system notification
        if (Notification.permission === "granted") {
          new Notification("Reminder!", {
            body: reminderText,
            icon: "https://via.placeholder.com/64", // Optional icon
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("Reminder!", {
                body: reminderText,
              });
            }
          });
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    stompClient.activate();
    return () => stompClient.deactivate();
  }, [userId]);

  return (
    <div>
      <h3>Reminders</h3>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default ReminderNotifier;
