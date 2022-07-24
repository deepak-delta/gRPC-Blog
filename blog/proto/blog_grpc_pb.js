// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var blog_pb = require('./blog_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_blog_Blog(arg) {
  if (!(arg instanceof blog_pb.Blog)) {
    throw new Error('Expected argument of type blog.Blog');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_Blog(buffer_arg) {
  return blog_pb.Blog.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blog_BlogId(arg) {
  if (!(arg instanceof blog_pb.BlogId)) {
    throw new Error('Expected argument of type blog.BlogId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_BlogId(buffer_arg) {
  return blog_pb.BlogId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var BlogServiceService = exports.BlogServiceService = {
  createBlog: {
    path: '/blog.BlogService/CreateBlog',
    requestStream: false,
    responseStream: false,
    requestType: blog_pb.Blog,
    responseType: blog_pb.BlogId,
    requestSerialize: serialize_blog_Blog,
    requestDeserialize: deserialize_blog_Blog,
    responseSerialize: serialize_blog_BlogId,
    responseDeserialize: deserialize_blog_BlogId,
  },
  readBlog: {
    path: '/blog.BlogService/ReadBlog',
    requestStream: false,
    responseStream: false,
    requestType: blog_pb.BlogId,
    responseType: blog_pb.Blog,
    requestSerialize: serialize_blog_BlogId,
    requestDeserialize: deserialize_blog_BlogId,
    responseSerialize: serialize_blog_Blog,
    responseDeserialize: deserialize_blog_Blog,
  },
  updateBlog: {
    path: '/blog.BlogService/UpdateBlog',
    requestStream: false,
    responseStream: false,
    requestType: blog_pb.Blog,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_blog_Blog,
    requestDeserialize: deserialize_blog_Blog,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  deleteBlog: {
    path: '/blog.BlogService/DeleteBlog',
    requestStream: false,
    responseStream: false,
    requestType: blog_pb.BlogId,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_blog_BlogId,
    requestDeserialize: deserialize_blog_BlogId,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  listBlogs: {
    path: '/blog.BlogService/ListBlogs',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: blog_pb.Blog,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_blog_Blog,
    responseDeserialize: deserialize_blog_Blog,
  },
};

exports.BlogServiceClient = grpc.makeGenericClientConstructor(BlogServiceService);
