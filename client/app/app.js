/// JAVASCRIPT ///


/// CONSTANTS ///
const dialogueBox = document.getElementById('dia-container');
const form = document.getElementById('prompt-form');
const input = document.getElementById('prompt-input');
const button = document.getElementById('prompt-button');
const promptLibrary = document.getElementById('prompt-library-container');
const promptList = document.getElementById('prompt-library-list');
const promptListItems = promptList.querySelectorAll('li');
const wammyLogo = document.getElementById('wammyLogo');
const screensaverContainer = document.getElementById('screensaver-container');
const wammyTimeStamp = document.getElementById('timestamp');

// TimeStamp //
  function setChatDateAndTime() {
    const dateObject = new Date();
    const todayDate = dateObject.toDateString()
    const localTime = dateObject.toLocaleTimeString()
    const chatTime = todayDate + ' ' + localTime
    wammyTimeStamp.innerText = chatTime
  }

// Copy Text Function //
  function addTextToClipboard () {
    // Adds every bot response into a list
    var botResponses =  dialogueBox.querySelectorAll('.wammy-response-text');
    // console.log('Logging botresponses: ')
    // console.log(botResponses)

    botResponses.forEach((item) => {

      item.addEventListener('click', (e) => {
        let timer;
        // console.log('Logging Wammy Response: ');
        // console.log(item.innerText);
        var copyText = e.target.innerText;

        navigator.clipboard.writeText(copyText);
        var popup_container = document.getElementById('popup-container');
        var popup = document.getElementById('copy-popup');

        popup.style.display = 'block';
        popup_container.style.display = 'flex';
        timer = setTimeout(() => {
          popup.style.opacity = '0%';
        }, 100);
        timer = setTimeout(() => {
          popup.style.display = 'none';
          popup_container.style.display = 'none';
          popup.style.opacity = '100%';
        }, 5000);
      });

    });
  }

// Screen Saver Function //
  document.addEventListener('DOMContentLoaded', (event) => {

    let timer;

    function resetTimer() {

      // clear time
      clearTimeout(timer);

      // set the new timer
      timer = setTimeout(() => {
        dialogueBox.classList.add('screenSaverActive');
        dialogueBox.style.display ='none';
        screensaverContainer.style.display ='flex';
        wammyLogo.style.display = 'block';
        wammyLogo.style.opacity = '100%';
      }, 240000);
    }

    // Listens for mouse movement
    document.addEventListener('mousemove', (e) => {
      dialogueBox.style.display ='block';
      wammyLogo.style.opacity = '0%';
      wammyLogo.style.display = 'none';
      screensaverContainer.style.display ='none';
      resetTimer();
    });

    // Listens for key presses
    document.addEventListener('keydown', (e) => {
      dialogueBox.style.display ='block';
      wammyLogo.style.opacity = '0%';
      wammyLogo.style.display = 'none';
      screensaverContainer.style.display ='none';
      resetTimer();
    });

    resetTimer();
  });

// Auto Scroll Dialogue Box Function//
  function scrollToBottom() {
    dialogueBox.scrollTop = dialogueBox.scrollHeight;
  }

// Resize Input Box Function //
  function autoResize() {
    this.style.height = '40px';
    this.style.height = this.scrollHeight + 'px';
    button.style.height = this.scrollHeight + 'px';
  }

  function resetSize() {
    input.style.height = '40px';
    button.style.height = '40px';
  }

// Get the prompt input element and resize it's height as the content grows
input.addEventListener('input', autoResize, false);

// Command Function //
  function activateCommands() {

    // listens for to the prompt input for '/'
    input.addEventListener("keydown", (e) => {

      // NEEDS: to only run the 'if statment' when the prompt-input value equals '/'
      if (e.keyCode === 191 && input.value.length === 0) {
        e.preventDefault();
        displayPromptLibrary();

        selectPrompt();


      }
    });
  }

// Prompt Library Function
  function displayPromptLibrary() {
    // displays prompt library
    promptLibrary.classList.add('open');
    promptLibrary.style.display = "grid";

    // Closes the prompt library and clears the text area
    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) {
        promptLibrary.style.display = 'none';
        input.value = '';
      }
    });
  }

// Prompt Library Function //
  function selectPrompt() {

   let focusedIndex = 0;

   //highlights the first element of the prompt list if the user presses the up arrow
   document.addEventListener("keydown", (e) => {
     if (e.keyCode === 38) {
      e.preventDefault();
      console.log(promptListItems);
      promptListItems.forEach(function (item) {
        console.log(item);
      });

      promptList.addEventListener("keydown", (e) => {
          if (e.keyCode === 40) {
            e.preventDefault();


          }
      });
     }
   });
  }

// User Question Function //
  function addUserQuestionToDialogueBox(question) {
      // create a new li and p element
      var userQuestionContainer = document.createElement('li');
      var userQuestionText = document.createElement('p');

      // add user prompt class to list element
      userQuestionContainer.classList.add('user-prompt-container');
      userQuestionText.classList.add('user-prompt-text');

      // add the user's text to the p element then add the p to the list element
      userQuestionText.innerText = question;
      userQuestionContainer.appendChild(userQuestionText);

      // add the li element to the DOM
      document.getElementById('dialogue').appendChild(userQuestionContainer);

      // scrolls to the bottom of the dialogue container
      scrollToBottom();

      // clear the prompt input text area for the next question
      input.value = '';

      // focus the input box
      input.focus();

  }

// Bot Response Function //
  function addBotResponseToDialogueBox(data) {
      // create a new li and p element
      var botResponseContainer = document.createElement('li');
      var botResponseText = document.createElement('p')

      // add user-specific styling to list element
      botResponseContainer.classList.add('wammy-response-container');
      botResponseText.classList.add('wammy-response-text');

      // add the bot's response to the paragraph element
      botResponseText.innerText = data;
      // add the paragraph to the list element
      botResponseContainer.appendChild(botResponseText);

      // add the list element to the dialogue box
      document.getElementById('dialogue').appendChild(botResponseContainer);

      // scrolls to the bottom of the dialogue container
      scrollToBottom();

      // Resets the copy text Function
      addTextToClipboard();

      // clear the input for the next response
      input.value = '';

      // focus the input box
      input.focus();
  }

// OpenAI Connection Function //
  async function handleSubmitQuestion(question) {
    // input validation
    if (!question) {
        return alert("Wammy doesn't respond blank prompts. Please type something, then try again.");
    }

    // Calls the User Question Function
    addUserQuestionToDialogueBox(question);

    // Sends the user's request to the OpenAI completions API
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({ question }),
    });

    // Parses the response as JSON
    const { content } = await response.json();
    return content;
  }

// Start Up Functions //
  window.onload = () => {

    // Sets Chat timestap
    setChatDateAndTime()

    //allows commands to run
    activateCommands();

    // copy text Function
    addTextToClipboard();

    form.addEventListener('submit', (e) => {
        // Prevents the 'submission' from refreshing the page
        e.preventDefault();

        // Selects the text inside of the prompt input bar
        const question = input.value;

        // Fetches the request
        handleSubmitQuestion(question).then((data) => {
            // Adds the bot's response to the dialogue box when the fetch request is complete
            addBotResponseToDialogueBox(data);

        });
        // Resets the prompt input bar to the defualt size
        resetSize();
    });

    form.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
         // Prevents the keypress from refreshing the page
        e.preventDefault();



         // Selects the text inside of the prompt input bar
        const question = input.value;

         // Fetches the user request
        handleSubmitQuestion(question).then((data) => {
            // Adds the bot's response to the dialogue box when the fetch request is complete
            addBotResponseToDialogueBox(data);


        });
      }
      // Resets to the prompt input bar to the defualt size
      resetSize();
    });
  };
