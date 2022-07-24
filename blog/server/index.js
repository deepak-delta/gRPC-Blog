const fs = require('fs')
const grpc = require('@grpc/grpc-js')
const serviceImpl = require('./service_impl.js')
const { BlogServiceService } = require('../proto/blog_grpc_pb.js')
const { MongoClient } = require('mongodb')

require('dotenv').config()
const mongoClient = new MongoClient(process.env.MONGO_URI, {
  connectTimeoutMS: 1000,
  serverSelectionTimeoutMS: 1000,
})

global.collection = undefined

async function cleanup(server) {
  console.log('Cleanup')

  if (server) {
    await mongoClient.close()
    server.forceShutdown()
  }
}

async function main() {
  process.on('SIGINT', () => {
    console.log('Caught interrupt signal')
    cleanup(server)
  })

  const server = new grpc.Server()
  const tls = true

  if (tls) {
    const rootCert = fs.readFileSync('./ssl/ca.crt')
    const certChain = fs.readFileSync('./ssl/server.crt')
    const privateKey = fs.readFileSync('./ssl/server.pem')

    creds = grpc.ServerCredentials.createSsl(rootCert, [
      {
        cert_chain: certChain,
        private_key: privateKey,
      },
    ])
  } else {
    creds = grpc.ServerCredentials.createInsecure()
  }

  // Connect to MongoDB
  await mongoClient.connect()

  const db = mongoClient.db('blog')
  collection = db.collection('posts')

  // Register the service
  server.addService(BlogServiceService, serviceImpl)
  server.bindAsync(process.env.HOST, creds, (err, _) => {
    if (err) {
      return cleanup(server)
    }

    server.start()
  })
  console.log('Server started, listening on %s', process.env.HOST)
}

main().catch(cleanup)
//main()
