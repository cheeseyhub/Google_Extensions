const extension_state_button = document.querySelector(
  ".extension_state_button"
);
const number_of_tasks = document.querySelector("#number_of_tasks");

//Button and state text
let extension_state_text = document.querySelector(".extension_state_text");
const click_number = document.querySelector(".click_number");
let click_Counter = 0;

//Home page state
let home_page_disabler = document.querySelector("#home_page_disabler");
let home_page_status = document.querySelector(".home_page_status");
//Words for tasks
let task_letters = document.querySelector("#number_of_letters");
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    ["extensionState", "number_of_tasks", "home_page_redirect", "task_letters"],
    (result) => {
      if (!result.extensionState) {
        chrome.storage.local.set({ extensionState: "Enabled" });
        extension_state_button.textContent = "Disable";
      }
      if (result.extensionState === "Disabled") {
        extension_state_button.textContent = "Enable";
        extension_state_text.textContent = "Extension is Disabled.";
        click_Counter = 0;
      }
      //If no tasks are set the default amount is 1
      if (!result.number_of_tasks) {
        chrome.storage.local.set({ number_of_tasks: 1 });
      } else {
        number_of_tasks.value = result.number_of_tasks;
      }
      //Home page disabler
      if (!result.home_page_redirect) {
        chrome.storage.local.set({ home_page_redirect: false });
        home_page_disabler.checked = false;
        home_page_status.textContent = "Home page is enabled.";
      } else {
        home_page_disabler.checked = true;
        home_page_status.textContent = "You will be redirected to search page.";
      }
      if (!result.task_letters) {
        chrome.storage.local.set({ task_letters: 1 });
      } else {
        task_letters.value = result.task_letters;
      }
    }
  );
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
home_page_disabler.addEventListener("change", (event) => {
  chrome.storage.local.set({ home_page_redirect: event.target.checked });
  if (event.target.checked) {
    home_page_status.textContent = "You will be redirected to search page.";
  } else {
    home_page_status.textContent = "Home page is enabled.";
  }
});
task_letters.addEventListener("change", (event) => {
  chrome.storage.local.set({ task_letters: event.target.value });
  task_letters.value = event.target.value;
});
