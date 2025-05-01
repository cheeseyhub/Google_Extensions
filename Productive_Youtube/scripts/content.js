chrome.storage.local.get(["extensionState"], (result) => {
  chrome.storage.local.get(["number_of_tasks"], (result) => {
    //Retreving extension state
    let extensionState = result.extensionState;
    let number_of_tasks = result.number_of_tasks;

    function cleanUpUi() {
      let extensionBodies = document.querySelectorAll(".extension-body");
      extensionBodies.forEach((body) => body.remove());
    }
    //Clean up immediately on load of script
    cleanUpUi();

    document.addEventListener("yt-navigate-finish", async function () {
      if (extensionState === "Disabled") return;
      //Clean Up the UI again after navigation
      cleanUpUi();
      if (window.location.pathname !== "/watch") return;
      function addingTask() {
        let taskInput = document.querySelector(".task-input");
        if (taskInput.value === "") {
          taskInput.classList.add("input-error");
          setTimeout(() => {
            taskInput.classList.remove("input-error");
          }, 2000);
          return;
        }

        let taskList = document.querySelector(".task-list");
        taskList.append(
          createTask(taskInput.value, taskList.childElementCount)
        );
        taskInput.value = "";
        checkingTasks(); //Checks if there is at least one task
      }

      function deleteTask(id) {
        let taskList = document.querySelector(".task-list");
        let task = taskList.children[id];
        task.remove();
        checkingTasks(); //Checks if there is at least one task
      }
      function createTask(task, taskid) {
        const li = document.createElement("li");
        li.classList.add("task");
        let listFragment = document.createDocumentFragment();
        //Making checkbox
        const checkBox = document.createElement("input");
        checkBox.classList.add("check-box");
        checkBox.id = `task-check-box-${taskid}`;
        checkBox.type = "checkbox";
        listFragment.prepend(checkBox);
        //Making Label
        const label = document.createElement("label");
        label.setAttribute("for", `task-check-box-${taskid}`);
        label.classList.add("task-label");
        label.textContent = task;
        listFragment.append(label);

        //Making Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("task-delete-button");
        deleteButton.classList.add(`task-delete-button-${taskid}`);
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", () => {
          deleteTask(taskid);
        });
        listFragment.append(deleteButton);
        li.append(listFragment);
        return li;
      }
      function mainFunction() {
        //Creates the extension body.
        const extensionBody = document.createElement("section");
        extensionBody.classList.add("extension-body");
        //Creating task list at start of the content Body section
        const taskList = document.createElement("ul");
        taskList.style.listStyle = "none";
        taskList.classList.add("task-list");
        extensionBody.prepend(taskList);

        //Adding input for the task and the button
        const inputAndButton = document.createElement("section");
        inputAndButton.classList.add("input-and-button");
        const taskInput = document.createElement("input");
        taskInput.setAttribute("type", "text");
        taskInput.setAttribute("placeholder", "Add a reason");
        taskInput.classList.add("task-input");
        //Creating add button
        const addButton = document.createElement("button");
        addButton.classList.add("add-button");
        addButton.textContent = "Add Task";
        //If enter is pressed the task is added
        taskInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            addingTask();
          }
        });
        inputAndButton.append(taskInput, addButton);
        taskList.after(inputAndButton);

        //Easy way to focus
        document.addEventListener("keydown", (e) => {
          if (e.key === "`") {
            let taskInput = document.querySelector(".task-input");
            taskInput && taskInput.focus();
          }
        });
        return extensionBody;
      }

      //Finding video by observing the dom
      let video = document.querySelector(
        "#movie_player > div.html5-video-container > video"
      );
      let videoObserver = new MutationObserver((mutations) => {
        video = document.querySelector(
          "#movie_player > div.html5-video-container > video"
        );
        if (video) videoObserver.disconnect();
      });
      videoObserver.observe(document.body, { childList: true, subtree: true });
      //Prevent playing eventListener
      const preventPlaying = (e) => {
        e.preventDefault();
        video && video.pause();
      };
      function disableVideo() {
        if (video) {
          video.pause();
          //Taking away controls
          video.controls = false;
          video.disablePictureInPicture = true;
          video.disableRemotePlayback = true;
          video.addEventListener("play", preventPlaying);
        }
      }
      function enableVideo() {
        if (video) {
          //Giving Back controls
          video.controls = true;
          video.disablePictureInPicture = false;
          video.disableRemotePlayback = false;
          video.removeEventListener("play", preventPlaying);
          video.play();
        }
      }
      function checkingTasks() {
        //Checking for tasks
        //Video won't start until one task is added.
        const taskList = document.querySelector(".task-list");
        let message = document.querySelector(".message");
        if (taskList && taskList.childElementCount < number_of_tasks) {
          const extensionBody = document.querySelector(".extension-body");
          if (!message) {
            let message = document.createElement("p");
            extensionBody.prepend(message);
            message.classList.add("message");
            message.textContent = `Why do you want to watch this video? (Focus with Backtick \` key on taskInput area.)\n Write at least ${number_of_tasks} tasks.`;

            disableVideo();
          }
        }
        if (taskList && taskList.childElementCount >= number_of_tasks) {
          message && message.remove(); //short circuiting
          enableVideo();
        }
      }
      function pageContentObserver() {
        const contentBody = document.querySelector("#below");
        //Mutaion observer for the dom so that the extension works when the dom is fully loaded.
        const observer = new MutationObserver((mutations) => {
          const contentBody = document.querySelector("#below");
          if (contentBody) {
            contentBody.prepend(mainFunction());
            checkingTasks();

            //Adding task functionality.
            const addButton = document.querySelector(".add-button");
            addButton && addButton.addEventListener("click", addingTask);

            //Adding  focus to task input
            const taskInput = document.querySelector(".task-input");
            setTimeout(() => taskInput.focus(), 1000);
            observer.disconnect();
          }
        });
        observer.observe(contentBody || document.body, {
          childList: true,
          subtree: true,
        });
      }

      pageContentObserver();
    });

    document.addEventListener("yt-navigate-finish", () => {
      if (extensionState === "Disabled") return;
      function PreviewDisabler() {
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/results"
        )
          return;
        //If video is cached
        let videoContainer = document.querySelector("#inline-preview-player");

        let videoContainerObserver = new MutationObserver((mutations) => {
          //Keeps on updating to new preview video
          let video = document.querySelector(
            "#inline-preview-player > div.html5-video-container > video"
          );
          //Just removes the video so it doesn't have to look at stuff over and over again.
          if (video) video.remove();
        });
        //Observers Dom once then sets the videoContainer varable
        let domObserver = new MutationObserver((mutations) => {
          videoContainer = document.querySelector("#inline-preview-player");
          if (videoContainer)
            videoContainerObserver.observe(videoContainer, {
              childList: true,
              subtree: true,
            });
          videoContainer && domObserver.disconnect();
        });

        //Observe dom once then keep on observing videoContainer
        domObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }

      PreviewDisabler();
    });
  });
});
