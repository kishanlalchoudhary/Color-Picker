chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: "#FFFFFF" });
  console.log("Extension Installed: Default color set to white.");
});
