const express = require('express')
const app = express()
const port = 3000
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')

// Connect to the database
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// Define the User, Group, GroupMembers and Message model
const User = sequelize.define('user', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  given_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone_number: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  display_pic: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

const Group = sequelize.define('group', {
  group_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  phone_number: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false
  }
})

const GroupMembers = sequelize.define('group_members', {
  added_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  removed_at: {
    type: Sequelize.DATE
  }
})

const Message = sequelize.define('message', {
  message_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sent_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

// Defining the relationships between the models
User.hasMany(GroupMembers, { foreignKey: 'user_id' })
Group.hasMany(GroupMembers, { foreignKey: 'group_id' })
Group.hasMany(Message, { foreignKey: 'group_id' })
User.hasMany(Message, { foreignKey: 'user_id' })

// Use body-parser middleware to parse the request body
app.use(bodyParser.json())

// API to load all the group messages in a paginated manner
app.get('/messages', async (req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const offset = (page - 1) * limit
    
    // Find all the messages with group_id and include the user details
    const messages = await Message.findAll({
      offset,
      limit,
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: Group,
          as: 'group'
        }
      ],
      order: [['sent_at', 'DESC']]
    })
  
    res.json({ messages })
  })

// API to send a message in a group
app.post('/messages', async (req, res) => {
    // Get the group_id, user_id and content from the request body
    const { group_id, user_id, content } = req.body
    
    // Check if the group and user exists
    const groupExists = await Group.findByPk(group_id)
    if (!groupExists) {
      return res.status(400).json({ error: 'Group does not exist' })
    }
    
    const userExists = await User.findByPk(user_id)
    if (!userExists) {
      return res.status(400).json({ error: 'User does not exist' })
    }
  
    // Create a new message in the group
    const message = await Message.create({
      group_id,
      user_id,
      content,
      sent_at: new Date()
    })
  
    res.json(message)
  })
  