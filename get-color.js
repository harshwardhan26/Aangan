const { Jimp } = require('jimp');

async function getColor() {
  const img = await Jimp.read('public/assets/images/logo-icon.png');
  // the icon is roughly in the center, let's just scan for the first non-transparent, non-white pixel
  for (let y = 0; y < img.bitmap.height; y++) {
    for (let x = 0; x < img.bitmap.width; x++) {
      const color = img.getPixelColor(x, y);
      // color is a 32-bit integer (RGBA). Convert to unsigned 32-bit hex
      const hex = (color >>> 0).toString(16).padStart(8, '0');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16);
      
      if (a > 0 && !(r > 240 && g > 240 && b > 240)) {
        console.log(`Found color: rgb(${r}, ${g}, ${b}) / hex: #${hex.slice(0, 6)}`);
        return;
      }
    }
  }
}
getColor();
