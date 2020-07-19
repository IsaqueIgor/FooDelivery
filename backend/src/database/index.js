const mongoose = require('mongoose');

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ehilu.mongodb.net/<dbname>?retryWrites=true&w=majority`
  )
  .then((result) => {
    console.log('Connected to db');
    const server = app.listen(process.env.PORT || 3333);
    const io = require('../util/socket').init(server);
    io.on('connection', (socket) => {
      socket.on('add-user', (data) => {
        clients[data.userId] = {
          socket: socket.id,
        };
      });

      //Removing the socket on disconnect
      socket.on('disconnect', () => {
        for (const userId in clients) {
          if (clients[userId].socket === socket.id) {
            delete clients[userId];
            break;
          }
        }
      });
    });
  })
  .catch((err) => console.log(err));

module.exports = mongoose;
