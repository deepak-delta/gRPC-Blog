const fs = require('fs')
const grpc = require('@grpc/grpc-js')
const { BlogServiceClient } = require('../proto/blog_grpc_pb.js')

function main() {
  const tls = true
  if (tls) {
    const rootCert = fs.readFileSync('./ssl/ca.crt')

    creds = grpc.credentials.createSsl(rootCert)
  } else {
    creds = grpc.ChannelCredentials.createInsecure()
  }
  const client = new BlogServiceClient('localhost:50051', creds)

  client.close()
}

main()
