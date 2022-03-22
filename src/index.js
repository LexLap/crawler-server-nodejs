const cors = require('cors');
const appRouter = require('./routes/appRouter');
const { app, server } = require('./sockets/socket-server');

const port = process.env.PORT;

app.use(cors());
app.use(appRouter);

server.listen(port, () => console.log("Server connected, port:", port));

