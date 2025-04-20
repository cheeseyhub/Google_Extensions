const extension_state_button = document.querySelector(
  ".extension_state_button"
);
const click_number = document.querySelector(".click_number");
const extension_state = document.querySelector(".extension_state");

let click_Counter = 1;
extension_state_button.addEventListener("click", () => {
  //Enables the extension and sets the click counter to 0 and enables the extension.
  click_number.textContent = `Counter : ${click_Counter}`;
  if (click_Counter === 1 && extension_state_button.textContent === "Enable") {
    click_Counter = 0;
    extension_state_button.textContent = "Disable";
  }
  //Checks if the clicks are equal or greater than 30 and then disables the extension.
  if (extension_state_button.textContent === "Disable" && click_Counter >= 30) {
    click_Counter = 0;
    extension_state_button.textContent = "Enable";
  }

  //Message of extension state enabled or disabled.
  if (extension_state_button.textContent === "Disable") {
    extension_state.textContent = "Extension is Enabled.";
  } else {
    extension_state.textContent = "Extension is disabled.";
  }
  click_Counter++;
});
