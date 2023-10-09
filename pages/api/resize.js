// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import sharp from "sharp";
import url from "url";

export default async function handler(req, res) {
  const { url: imageUrl, width, quality } = req.query;
  const hosts = process.env.IMAGE_HOSTS.split(",");

  try {
    let buffer;
    if (imageUrl.startsWith("http")) {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      buffer = Buffer.from(response.data, "binary");
    } else {
      for (const host of hosts) {
        const fullUrl = url.resolve(host, imageUrl);
        console.log("Trying ", fullUrl);
        const response = await axios
          .get(fullUrl, { responseType: "arraybuffer" })
          .catch(() => null);
        if (response) {
          buffer = Buffer.from(response.data, "binary");
          break;
        }
      }
    }

    if (!buffer) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    const resizedBuffer = await sharp(buffer)
      .resize(parseInt(width))
      .jpeg({ quality: parseInt(quality) })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.status(200).end(resizedBuffer);
  } catch (error) {
    res.status(500).json({ error: "Error resizing the image" });
  }
}
