const grpc = require('@grpc/grpc-js')
const { Collection } = require('mongodb')
const { Blog, BlogId } = require('../proto/blog_pb')

const blogToDocument = (blog) => {
  return {
    author_id: blog.getAuthorId(),
    title: blog.getTitle(),
    content: blog.getContent(),
  }
}

const internal = (err, callback) =>
  callback({
    code: grpc.status.INTERNAL,
    message: err.toString(),
  })

const checkNotAcknowledged = (res, callback) => {
  if (!res.acknowledged) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Not acknowledged',
    })
  }
}

exports.createBlog = async (call, callback) => {
  const data = blogToDocument(call.request)

  await collection.insertOne(data).then((res) => {
    checkNotAcknowledged(res, callback)
    const id = res.insertedId.toString()
    const blogId = new Blog().setId(id)
  })
}
