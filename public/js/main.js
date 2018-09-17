//grab elements from page
const numberInput = document.getElementById('number')
      textInput = document.getElementById('msg')
      button = document.getElementById('button')
      response = document.querySelector('.response')

//event for button
button.addEventListener('click', send, false)

//socket
const socket = io();
socket.on('smsStatus', function(data){
  if(data.error){
    response.innerHTML = '<h5>Text message sent to ' + data.error + '</h5>';
  }else{
    response.innerHTML = '<h5>Text message sent to ' + data.number + '</h5>';
  }
})

//send function
function send() {
  //ensure there are no non-numeric characters
  const number = numberInput.value.replace(/\D/g, '')
  const text = textInput.value

  fetch('/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({number: number, text: text})
  })
  .then(function(res) {
    console.log(res)
  })
  .catch(function(err) {
    console.log(err)
  })
}
