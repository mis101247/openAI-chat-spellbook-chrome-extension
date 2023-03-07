"use strict";

const AutoFill = async () => {
  const { tempText } = await chrome.storage.local.get("tempText");
  await chrome.storage.local.remove("tempText");
  if (tempText) {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      let query = tempText;

      if (query > 3000) {
        query = query.substring(0, 3000);
      }

      textarea.value = query;
      const button = textarea.nextElementSibling;
      if (textarea.nextElementSibling.tagName === "BUTTON") {
        button.click();
      }
    }
  }
};

chrome.runtime.sendMessage("ChatGPT_On", (response) => {
  if (response === "OK") {
    AutoFill();
  }
});