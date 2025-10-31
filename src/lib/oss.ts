import OSS from 'ali-oss'

export function createOssClient() {
  if (
    process.env.OSS_ACCESS_KEY_ID === undefined ||
    process.env.OSS_ACCESS_KEY_SECRET === undefined
  ) {
    return new OSS({
      accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
      region: 'oss-cn-hongkong',
      bucket: 'fish-web-dev',
    })
  }
  return null
}
