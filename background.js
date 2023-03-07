import { defaultActions } from "./defaultActions.js";

// Create the initial context menu items,
chrome.runtime.onInstalled.addListener(async () => {
  const initialActions = defaultActions.map((action) => {
    return {
      id: Math.random().toString(36).substring(2, 15),
      option: action.option,
      action: action.action,
      enabled: action.enabled,
    };
  });
  await chrome.storage.local.set({
    allActions: initialActions,
  });

  for (const action of initialActions) {
    chrome.contextMenus.create({
      id: action.id,
      title: action.option,
      type: "normal",
      contexts: ["selection"],
    });
  }
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  const { allActions } = await chrome.storage.local.get("allActions");
  const action = allActions.find(
    (action) => action.id === item.menuItemId
  )?.action;

  if (!action) return;

  const selectText = item.selectionText;

  chrome.storage.local.set({
    tempText: `${action}

    "${selectText}"`,
  });

  const url = new URL(`https://chat.openai.com/chat`);
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

chrome.storage.onChanged.addListener(async ({ allActions }) => {
  if (typeof allActions === "undefined") return;

  chrome.contextMenus.removeAll();

  for (const action of allActions.newValue) {
    if (!action.enabled) continue;
    chrome.contextMenus.create({
      id: action.id,
      title: action.option,
      type: "normal",
      contexts: ["selection"],
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "ChatGPT_On") {
    sendResponse("OK");
  }
});
