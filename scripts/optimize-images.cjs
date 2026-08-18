const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'public', 'images')

async function convert(file, maxWidth) {
  const src = path.join(dir, file)
  const out = path.join(dir, file.replace(/\.(jpe?g|png)$/i, '.webp'))
  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(out)
  const before = fs.statSync(src).size
  const after = fs.statSync(out).size
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`)
}

;(async () => {
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f))
  for (const f of files) {
    const max = f === 'earth-texture.png' ? 2560 : 2000
    await convert(f, max)
  }
  console.log(`Done: ${files.length} files converted`)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})