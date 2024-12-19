const express = require('express');
const app = express();
const db = require('./models'); 
const userGroupRoutes = require('./routes/userGroupRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use(express.json()); 

const userRoutes = require('./routes/userRoutes'); 
const groupRoutes = require('./routes/groupRoutes');

app.use('/api/users', userRoutes); 
app.use('/api/groups', groupRoutes); 
app.use('/api', userGroupRoutes);
app.use('/api/tasks', taskRoutes);

db.sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => console.log('Error syncing database:', err));

module.exports = app;  