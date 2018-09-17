//================dependencies================//
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const Nexmo = require('nexmo')
const socketio = require('socket.io')
require('dotenv').config()
//============================================//

//init nexmo
const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
}, {debug: true})

//==============init app and middleware========//
//express
const app = express()

//middleware for templating
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)

//set up public folder
app.use(express.static(__dirname + '/public'))

//body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//===============================================//

//===================Routes======================//
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  //submit form fields
  const number = req.body.number
  const text = req.body.text

  nexmo.message.sendSms(
    '17372200528', number, text, { type: 'unicode'},
    (err, responseData) => {
      if(err) {
        console.log(err)
      } else {
        console.dir(responseData)
        //get res data
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to'],
          error: responseData.messages[0]['error-text']
        }
        //socket to emit data to client
        io.emit('smsStatus', data)
      }
    }
  )
})
//=============================================//

//==================Server========================//
const PORT = 3001
const server = app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))
//===============================================//

//===================connect to socket.io=======================//
const io = socketio(server)
io.on('connection', (socket) => {
  console.log('Connected')
  io.on('disconnect', () => {
    console.log('Disconnected')
  })
})
//===============================================//
