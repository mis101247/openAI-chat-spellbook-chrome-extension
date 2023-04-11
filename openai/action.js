"use strict";

const AutoFill = async () => {
  const { tempText } = await chrome.storage.local.get("tempText");
  if (tempText) {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      let query = tempText;

      if (query > 3000) {
        query = query.substring(0, 3000);
      }

      textarea.focus();
      textarea.value = query;
      textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      textarea.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));

      await chrome.storage.local.remove("tempText");
    }
  }
};

chrome.runtime.sendMessage("ChatGPT_On", (response) => {
  if (response === "OK") {
    setTimeout(() => {
      AutoFill();
    }, 2000);
  }
});
