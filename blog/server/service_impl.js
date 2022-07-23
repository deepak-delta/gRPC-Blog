const { GreetResponse } = require('../proto/greet_pb.js')

//Unary RPC
exports.greet = (call, callback) => {
  console.log('Greet was called')
  //   const req = call.request
  const res = new GreetResponse().setResult(
    `Hello ${call.request.getFirstname()}`
  )
  callback(null, res)
}

// Server Streaming RPC
exports.greetManyTimes = (call, _) => {
  console.log('GreetManyTimes was invoked')
  const res = new GreetResponse()

  for (let i = 0; i < 10; ++i) {
    res.setResult(`Hello ${call.request.getFirstname()} - number ${i}`)
    call.write(res)
  }

  call.end()
}

// Client Streaming RPC
exports.longGreet = (call, callback) => {
  console.log('LongGreet was called')

  let greet = ''

  call.on('data', (req) => {
    greet += `Hello ${req.getFirstname()} \n`
  })

  call.on('end', () => {
    const res = new GreetResponse().setResult(greet)
    callback(null, res)
  })
}

// Bidirectional Streaming RPC
exports.greetEveryone = (call, _) => {
  console.log('GreetEveryone was called')

  call.on('data', (req) => {
    console.log(`Received: ${req}`)
    const res = new GreetResponse().setResult(`Hello ${req.getFirstname()}`)
    console.log(`Sending: ${res}`)
    call.write(res)
  })
  call.on('end', () => {
    call.end()
  })
}
