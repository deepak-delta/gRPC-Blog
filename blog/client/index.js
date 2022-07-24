const fs = require('fs')
const grpc = require('@grpc/grpc-js')
const { BlogServiceClient } = require('../proto/blog_grpc_pb.js')
const { Blog, BlogId } = require('../proto/blog_pb')
require('dotenv').config()

const createBlog = (client) => {
  console.log('createBlog was invoked')
  return new Promise((resolve, reject) => {
    const req = new Blog()
      .setAuthorId('Clement')
      .setTitle('My First Blog')
      .setContent('Content of the first blog')

    client.createBlog(req, (err, res) => {
      if (err) {
        reject(err)
      }

      console.log(`Blog was created: ${res}`)
      resolve(res.getId())
    })
  })
}

async function main() {
  const tls = true
  if (tls) {
    const rootCert = fs.readFileSync('./ssl/ca.crt')

    creds = grpc.credentials.createSsl(rootCert)
  } else {
    creds = grpc.ChannelCredentials.createInsecure()
  }
  const client = new BlogServiceClient(process.env.HOST, creds)

  const id = await createBlog(client)

  client.close()
}

main()
