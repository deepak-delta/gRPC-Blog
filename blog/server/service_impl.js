const grpc = require('@grpc/grpc-js')
const { ObjectId } = require('mongodb')
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

const checkOID = (id, callback) => {
  try {
    return new ObjectId(id)
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Invalid OID',
    })
  }
}

const checkNotFound = (res, callback) => {
  if (!res || res.matchedCount === 0) {
    callback({
      code: grpc.status.NOT_FOUND,
      message: 'Not found',
    })
  }
}

const documentToBlog = (doc) => {
  return new Blog()
    .setId(doc._id.toString())
    .setAuthorId(doc.author_id)
    .setTitle(doc.title)
    .setContent(doc.content)
}

exports.createBlog = async (call, callback) => {
  const data = blogToDocument(call.request)

  await collection
    .insertOne(data)
    .then((res) => {
      checkNotAcknowledged(res, callback)
      const id = res.insertedId.toString()
      const blogId = new BlogId().setId(id)

      callback(null, blogId)
    })
    .catch((err) => internal(err, callback))
}

exports.readBlog = async (call, callback) => {
  const oid = checkOID(call.request.getId(), callback)

  await collection
    .findOne({ _id: oid })
    .then((res) => {
      checkNotFound(res, callback)
      callback(null, documentToBlog(res))
    })
    .catch((err) => internal(err, callback))
}
