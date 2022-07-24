const fs = require('fs')
const grpc = require('@grpc/grpc-js')
const { BlogServiceClient } = require('../proto/blog_grpc_pb.js')
const { Blog, BlogId } = require('../proto/blog_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
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

const updateBlog = (client, id) => {
  console.log('updateBlog was invoked')
  return new Promise((resolve, reject) => {
    const req = new Blog()
      .setId(id)
      .setAuthorId('not Clement')
      .setTitle('My First Blog (edited)')
      .setContent('Content of the first blog, with some awesome additions!')

    client.updateBlog(req, (err, _) => {
      if (err) {
        reject(err)
      }

      console.log('Blog was updated!')
      resolve()
    })
  })
}

const listBlogs = (client) => {
  console.log('listBlog was invoked')
  return new Promise((resolve, reject) => {
    const req = new Empty()

    const call = client.listBlogs(req)

    call.on('data', (res) => {
      console.log(res)
    })

    call.on('error', (err) => {
      reject(err)
    })

    call.on('end', () => {
      resolve()
    })
  })
}

const deleteBlog = (client, id) => {
  console.log('deleteBlog was invoked')

  return new Promise((resolve, reject) => {
    const req = new BlogId().setId(id)

    client.deleteBlog(req, (err, _) => {
      if (err) {
        reject(err)
      }

      console.log(`Blog was deleted!`)
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
  await updateBlog(client, id)
  await listBlogs(client)
  await deleteBlog(client, id)

  client.close()
}

main()
