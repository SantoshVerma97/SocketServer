const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const _ = require("lodash");
const { UpdateLocationController } = require("./controller/UpdateLocationController");
const { GetLocationController } = require("./controller/getLocationController");
const { GetVehicleLocationHistoryController } = require("./controller/getVehicleLocationHistory");
const { GetAllCabLocationService } = require("./service/getAllCabLocationService");
const { GetTripMemberController } = require("./controller/GetTripMemberController");
const bodyParser = require("body-parser");
const { GetCalculateDistanceController } = require("./controller/GetCalculateDistanceController");
var jsonParser = bodyParser.json();

app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let connectedUsers = new Set();

// Mock token verification function
const verifyToken = (token) => {
  // Replace with real token verification logic
  return token === "json-web-token";
};

// Middleware for token authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (verifyToken(token)) {
    return next();
  }
  return next(new Error("Authentication error"));
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Add the user to the connectedUsers object
  connectedUsers.add(socket.id);

  // Throttled function to emit the user count
  const throttleUserCount = _.throttle(() => {
    io.emit('userCount', connectedUsers.size);
  }, 5000); // 5-second interval

  // Emit the initial user count
  throttleUserCount();

  // Get the total number of connected users
  io.emit('userCount', connectedUsers.size);
  console.log('Total connected users:', connectedUsers.size);

  socket.on('getLocation',async()=>{
    const res = await GetAllCabLocationService();
    io.to('adminRoom').emit('AllVehicleLocation', res);
  })

  // Handle location updates from cabs
  socket.on('locationUpdate', (data) => {
    UpdateLocationController(data,"res");
    // Emit location update to all clients
    io.emit('locationUpdate', data);

    // Additionally, emit location update to the admin panel
    io.to('adminRoom').emit('locationUpdate', data);
  });

  // Handle admin connection
  socket.on('adminJoin', () => {
    socket.join('adminRoom');
    console.log('Admin joined the room');
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);

    // Remove the socket ID from the set
    connectedUsers.delete(socket.id);

    // Emit the updated total number of connected users
    io.emit('userCount', connectedUsers.size);
    console.log('Total connected users:', connectedUsers.size);
  });

  socket.on('message_from_client',(data)=>{
    console.log(data);
  })

  socket.on('close', () => {
    console.log('Socket closed', socket.listenerCount());
    // Additional cleanup logic
  });
});

// Error handling
io.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  io.close(() => {
    console.log('Server shutting down gracefully');
    process.exit(0);
  });
});

app.get('/getLocation',GetLocationController);
app.get('/getLocationHistory', GetVehicleLocationHistoryController);
app.get('/getTripMemberDetails', GetTripMemberController);
app.post('/distance', jsonParser, GetCalculateDistanceController);

server.listen(3001, () => {
  console.log("SERVER IS RUNNING 3001");
});
