// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import sharp from "sharp";

export default async function handler(req, res) {
  const { url, width, quality } = req.query;

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

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
