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

const readBlog = (client, id) => {
  console.log('readBlog was invoked')

  return new Promise((resolve, reject) => {
    const req = new BlogId().setId(id)

    client.readBlog(req, (err, res) => {
      if (err) {
        reject(err)
      }

      console.log(`Blog was read: ${res}`)
      resolve()
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
  console.log('Client started, listening on %s', process.env.HOST)

  const id = await createBlog(client)
  await readBlog(client, id)

  client.close()
}

main()
