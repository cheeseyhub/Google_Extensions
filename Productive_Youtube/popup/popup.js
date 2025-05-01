const extension_state_button = document.querySelector(
  ".extension_state_button"
);
const number_of_tasks = document.querySelector("#number_of_tasks");
//Button and state text
let extension_state_text = document.querySelector(".extension_state_text");
const click_number = document.querySelector(".click_number");
let click_Counter = 0;
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["extensionState"], (result) => {
    if (!result.extensionState) {
      chrome.storage.local.set({ extensionState: "Enabled" });
      extension_state_button.textContent = "Disable";
    }
    if (result.extensionState === "Disabled") {
      extension_state_button.textContent = "Enable";
      extension_state_text.textContent = "Extension is Disabled.";
      click_Counter = 0;
    }
  });
  //If no tasks are set the default amount is 1
  chrome.storage.local.get("number_of_tasks", (result) => {
    if (!result.number_of_tasks) {
      chrome.storage.local.set({ number_of_tasks: 1 });
    } else {
      number_of_tasks.value = result.number_of_tasks;
    }
  });
});

extension_state_button.addEventListener("click", () => {
  click_Counter++;
  //Enables the extension and sets the click counter to 0 and enables the extension.
  click_number.textContent = `Counter : ${click_Counter}`;
  if (click_Counter === 1 && extension_state_button.textContent === "Enable") {
    //Updating click counter ui
    click_Counter = 0;
    click_number.textContent = `Counter : 0`;
    extension_state_button.textContent = "Disable";
    //On count start the extension state is enabled
    chrome.storage.local.set({ extensionState: "Enabled" });
  }
  //Checks if the clicks are equal to 30 and then disables the extension.
  if (
    extension_state_button.textContent === "Disable" &&
    click_Counter === 30
  ) {
    //Sets the counter sets it to zero 😊 at 30 clicks and sets the button text to enable. Setting the ui counter to 0
    click_Counter = 0;
    click_number.textContent = `Counter : 0`;
    extension_state_button.textContent = "Enable";
    //Setting the extension state to disabled
    chrome.storage.local.set({ extensionState: "Disabled" });
  }

  //Message of extension state enabled or disabled.
  extension_state_button.textContent === "Disable"
    ? (extension_state_text.textContent = "Extension is Enabled.")
    : (extension_state_text.textContent = `Extension is Disabled. `);
});

//Features modification
number_of_tasks.addEventListener("change", (event) => {
  chrome.storage.local.set({ number_of_tasks: event.target.value });
});
