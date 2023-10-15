# Custom sharp-powered image resizer lambda endpoint

- Powered by sharp and next.js
- Can host on Vercel with free or paid plans
- Can use as a custom resizer endpoint with static deployments of next.js
- Can use together with CDN such as BunnyCDN to cache resulting images
- Looks up and resizes remote images from URLs from multiple pre-defined hosts

## Configuration

Define IMAGE_HOSTS in environment variables (comma-separated multiple base URLs)

IMAGE_HOSTS=https://myimagehost.s3.us-west-2.amazonaws.com,https://myimagehost.b-cdn.net

Resizer will look up the source image by relative path one by one from each host until path matches.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmkrn%2Fnext-lambda-image-resizer&env=IMAGE_HOSTS&envDescription=Hosts%20to%20look%20up%20the%20images%20from)

## How to use

Example resizing:
`https://deployed-resizer.vercel.app/api/resizer/?url=%2Fsomeimage.png&width=1280&quality=75`

### Example next.config.js

For static site build:

```
...
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    loader: "custom",
    loaderFile: "./image.ts",
  },
  ...
```

image.ts:

```
export default function localImagesLoader({
  src,
  width,
  quality = 80,
}: {
  src: string
  width: number
  quality?: number
}) {
  const relativeSrc = new URL(src).pathname
  const encodedSrc = encodeURIComponent(relativeSrc)
  return (
    `https://deployed-resizer.vercel.app/api/resizer?url=${encodedSrc}&width=${width}&quality=${quality}`
  )
}
```
