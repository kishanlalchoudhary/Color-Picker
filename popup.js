const btn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");

btn.addEventListener("click", async () => {
  try {
    const color = await pickColor();
    if (!color) {
      console.log("User canceled or an issue occurred.");
      return;
    }

    const hexColor = rgbaToHex(color).toUpperCase();
    colorGrid.style.backgroundColor = hexColor;
    colorValue.innerText = hexColor;

    await chrome.storage.sync.set({ color: hexColor });
    await navigator.clipboard.writeText(hexColor);
  } catch (err) {
    console.error("Error picking color:", err);
  }
});

async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    return result.sRGBHex || result;
  } catch (err) {
    if (err.name === "AbortError") {
      return null;
    }
    throw err;
  }
}

function rgbaToHex(rgba) {
  const match = rgba.match(/rgba?\((\d+), (\d+), (\d+),? ?([\d\.]+)?\)/);
  if (!match) return rgba;

  const r = parseInt(match[1]).toString(16).padStart(2, "0");
  const g = parseInt(match[2]).toString(16).padStart(2, "0");
  const b = parseInt(match[3]).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}

(async function loadSavedColor() {
  const { color } = await chrome.storage.sync.get("color");
  if (color) {
    colorGrid.style.backgroundColor = color;
    colorValue.innerText = color;
  }
})();
