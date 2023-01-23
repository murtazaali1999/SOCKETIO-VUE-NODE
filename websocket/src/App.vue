<template>
  <div>
    <input type="text" v-model="text" />
    <input type="number" v-model="room" />
    <button @click="sendMessageToServer">Send Message</button>
    <button @click="checkMessages">Receive All Messages</button>

    <button @click="joinRoom">Join Room</button>
    <button @click="sendMessageToRoom">Send Message To Room</button>

    <div class="broadcasted">
      <p v-for="(message, index) in broadCasted" :key="index">{{ message }}</p>
    </div>

    <div class="room">
      <p></p>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { ref } from "vue";

export default {
  name: "App",
  setup() {
    const text = ref("");
    const room = ref(0);
    const socket = io("http://localhost:4004"); /* connect to that port */
    const broadCasted = ref([]);
    const roomMessages = ref([]);

    const sendMessageToServer = () => {
      /* sending to server */
      socket.emit("send_message", { message: text.value });
    };

    const joinRoom = () => {
      socket.emit("join_room", room.value);
    };

    const sendMessageToRoom = () => {
      socket.emit("send_message_to_room", {
        room: room.value,
        message: text.value,
      });
    };

    socket.on("yall", (message) => {
      /* The client that sent it will not receive this message only the others will */
      broadCasted.value.push(message.message);
    });

    socket.on("receive_message_to_room", (data) => {
      roomMessages.value = data;
      console.log(data);
    });

    const checkMessages = () => {
      console.log(broadCasted.value);
    };

    return {
      socket,
      sendMessageToServer,
      text,
      broadCasted,
      checkMessages,
      room,
      joinRoom,
      sendMessageToRoom,
    };
  },
};
</script>

<style>
input {
  display: block-inline;
}

.broadcasted {
  color: white;
  width: 500px;
  height: 500px;
  background-color: purple;
  margin-top: 20px;
}

.room {
  color: white;
  width: 500px;
  height: 500px;
  background-color: lawngreen;
  margin-top: 20px;
}

button {
  margin: 20px;
}
</style>
