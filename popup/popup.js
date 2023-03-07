createForm().catch(console.error);

async function createForm() {
  const { allActions } = await chrome.storage.local.get("allActions");

  const spellTable = document.getElementById("spell-table-tbody");
  for (const action of allActions) {
    const checkbox = document.createElement("input");
    checkbox.id = action.id;
    checkbox.type = "checkbox";
    checkbox.checked = action.enabled;
    checkbox.name = action.option;
    checkbox.addEventListener("click", (event) => {
      handleCheckboxClick(event).catch(console.error);
    });

    const tr = document.createElement("tr");

    tr.dataset.id = action.id;

    const inputForDisplay = document.createElement("input");
    inputForDisplay.readOnly = true;
    inputForDisplay.value = action.option;
    inputForDisplay.classList.value = "form-control";

    const inputForContent = document.createElement("input");
    inputForContent.value = action.action;
    inputForContent.classList.value = "form-control";
    inputForDisplay.readOnly = true;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.style.display = "inline";
    editButton.classList.value = "btn btn-primary";
    editButton.innerHTML = `<i class="fa fa-pencil"></i>`;
    editButton.addEventListener("click", () => {
      handleEditClick(editButton).catch(console.error);
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.style.display = "inline";
    deleteButton.classList.value = "btn btn-danger";
    deleteButton.innerHTML = `<i class="fa fa-trash"></i>`;
    deleteButton.addEventListener("click", () => {
      handleDeleteClick(deleteButton).catch(console.error);
    });

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.style.display = "none";
    saveButton.classList.value = "btn btn-success";
    saveButton.innerHTML = `<i class="fa fa-save"></i>`;
    saveButton.addEventListener("click", async () => {
      await handleSaveClick(saveButton).catch(console.error);
    });

    tr.appendChild(document.createElement("td")).appendChild(checkbox);
    tr.appendChild(document.createElement("td")).appendChild(inputForDisplay);
    tr.appendChild(document.createElement("td")).appendChild(inputForContent);

    const td = document.createElement("td");
    td.appendChild(editButton);
    td.appendChild(saveButton);
    tr.appendChild(td);

    tr.appendChild(document.createElement("td")).appendChild(deleteButton);

    spellTable.appendChild(tr);
  }
}

async function handleCheckboxClick(event) {
  const checkbox = event.target;
  const id = checkbox.id;
  const enabled = checkbox.checked;
  const { allActions } = await chrome.storage.local.get("allActions");

  // Find the action with the same id
  const action = allActions.find((action) => action.id === id);
  action.enabled = enabled;

  // Update the storage
  await chrome.storage.local.set({ allActions });
}

function handleEditClick(editButtonElement) {
  editButtonElement.style.display = "none";

  const saveButton =
    editButtonElement.parentElement.querySelector("button.btn-success");
  saveButton.style.display = "inline";

  const tr = editButtonElement.parentElement.parentElement;

  const inputs = tr.querySelectorAll("input.form-control");
  inputs.forEach((input) => {
    input.readOnly = false;
  });
}

async function handleSaveClick(saveButtonElement) {
  saveButtonElement.style.display = "none";

  const editButton =
    saveButtonElement.parentElement.querySelector("button.btn-primary");
  editButton.style.display = "inline";

  const tr = saveButtonElement.parentElement.parentElement;

  const inputs = tr.querySelectorAll("input.form-control");
  inputs.forEach((input) => {
    input.readOnly = true;
  });

  const enabled = tr.querySelector("input[type=checkbox]").checked;

  const id = tr.dataset.id;
  if (id) {
    const option = inputs[0].value;
    const action = inputs[1].value;

    await updateAction(id, option, action, enabled).catch(console.error);
  }
}

async function updateAction(id, option, action, enabled) {
  const { allActions } = await chrome.storage.local.get("allActions");

  // Find the action with the same id
  const actionToUpdate = allActions.find((action) => action.id === id);
  if (actionToUpdate) {
    // Update the action
    actionToUpdate.option = option;
    actionToUpdate.action = action;
  } else {
    // Insert new action into allActions
    const newAction = {
      id,
      option,
      action,
      enabled,
    };
    allActions.push(newAction);
  }
  await chrome.storage.local.set({ allActions });
}

document
  .querySelector("#add-new-spell")
  .addEventListener("click", async (event) => {
    const buttonElement = event.target;
    buttonElement.style.display = "none";
    await addNewSpell().catch(console.error);
  });

async function addNewSpell() {
  const actionId = Math.random().toString(36).substring(2, 15);
  const checkbox = document.createElement("input");
  checkbox.id = actionId;
  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.name = "";

  const tr = document.createElement("tr");

  tr.dataset.id = actionId;

  const inputForDisplay = document.createElement("input");
  inputForDisplay.value = "";
  inputForDisplay.classList.value = "form-control";

  const inputForContent = document.createElement("input");
  inputForContent.value = "";
  inputForContent.classList.value = "form-control";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.style.display = "inline";
  deleteButton.classList.value = "btn btn-danger";
  deleteButton.innerHTML = `<i class="fa fa-trash"></i>`;
  deleteButton.addEventListener("click", () => {
    handleDeleteClick(deleteButton).catch(console.error);
    document.querySelector("#add-new-spell").style.display = "inline";
  });

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.style.display = "none";
  editButton.classList.value = "btn btn-primary";
  editButton.innerHTML = `<i class="fa fa-pencil"></i>`;
  editButton.addEventListener("click", () => {
    handleEditClick(editButton).catch(console.error);
  });

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.classList.value = "btn btn-success";
  saveButton.innerHTML = `<i class="fa fa-save"></i>`;
  saveButton.addEventListener("click", async () => {
    document.querySelector("#add-new-spell").style.display = "inline";
    await handleSaveClick(saveButton).catch(console.error);
  });

  tr.appendChild(document.createElement("td")).appendChild(checkbox);
  tr.appendChild(document.createElement("td")).appendChild(inputForDisplay);
  tr.appendChild(document.createElement("td")).appendChild(inputForContent);

  const td = document.createElement("td");
  td.appendChild(editButton);
  td.appendChild(saveButton);
  tr.appendChild(td);

  tr.appendChild(document.createElement("td")).appendChild(deleteButton);

  const spellTable = document.getElementById("spell-table-tbody");
  spellTable.appendChild(tr);
}

async function handleDeleteClick(deleteButtonElement) {
  const tr = deleteButtonElement.parentElement.parentElement;
  const id = tr.dataset.id;
  const { allActions } = await chrome.storage.local.get("allActions");

  // Find the action with the same id
  const action = allActions.find((action) => action.id === id);
  allActions.splice(allActions.indexOf(action), 1);

  // Update the storage
  await chrome.storage.local.set({ allActions });

  tr.remove();
}
