const grpc = require('@grpc/grpc-js')
const { ObjectId } = require('mongodb')
const { Blog, BlogId } = require('../proto/blog_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')

const blogToDocument = (blog) => {
  return {
    author_id: blog.getAuthorId(),
    title: blog.getTitle(),
    content: blog.getContent(),
  }
}

const documentToBlog = (doc) => {
  return new Blog()
    .setId(doc._id.toString())
    .setAuthorId(doc.author_id)
    .setTitle(doc.title)
    .setContent(doc.content)
}

const internal = (err, callback) =>
  callback({
    code: grpc.status.INTERNAL,
    message: err.toString(),
  })

const checkOID = (id, callback) => {
  try {
    return new ObjectId(id)
  } catch (err) {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Invalid OID',
    })
  }
}

const checkNotAcknowledged = (res, callback) => {
  if (!res.acknowledged) {
    callback({
      code: grpc.status.INTERNAL,
      message: `Operation wasn\'t acknowledged`,
    })
  }
}

const checkNotFound = (res, callback) => {
  if (!res || res.matchedCount == 0 || res.deletedCount == 0) {
    callback({
      code: grpc.status.NOT_FOUND,
      message: 'Could not find blog',
    })
  }
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

exports.updateBlog = async (call, callback) => {
  const oid = checkOID(call.request.getId(), callback)

  await collection
    .updateOne({ _id: oid }, { $set: blogToDocument(call.request) })
    .then((res) => {
      checkNotFound(res, callback)
      checkNotAcknowledged(res, callback)
      callback(null, new Empty())
    })
    .catch((err) => internal(err, callback))
}

exports.listBlogs = async (call, _) =>
  await collection
    .find()
    .map((doc) => documentToBlog(doc))
    .forEach((blog) => call.write(blog))
    .then(() => call.end())
    .catch((err) =>
      call.destroy({
        code: grpc.status.INTERNAL,
        message: 'Not list the blogs',
      })
    )

exports.deleteBlog = async (call, callback) => {
  const oid = checkOID(call.request.getId(), callback)

  await collection
    .deleteOne({ _id: oid })
    .then((res) => {
      checkNotFound(res, callback)
      checkNotAcknowledged(res, callback)
      callback(null, new Empty())
    })
    .catch((err) => internal(err, callback))
}
