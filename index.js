Linkedin = {
  config: {
    scrollDelay: 3000,
    actionDelay: 5000,
    nextPageDelay: 5000,
    // set to -1 for no limit
    maxRequests: -1,
    totalRequestsSent: 0,
    // setting this to false to skip adding note in invites, and send connection request without note
    addNote: false,
    note: "Hey {{name}}, I'm eager to contribute my skills in the team. I'd love the opportunity to connect and learn more about potential openings.",
  },
  init: function (data, config) {
    console.info("INFO: script initialized on the page...");
    console.debug(
      "DEBUG: scrolling to bottom in " + config.scrollDelay + " ms"
    );
    setTimeout(() => this.scrollBottom(data, config), config.actionDelay);
  },
  scrollBottom: function (data, config) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    console.debug("DEBUG: scrolling to top in " + config.scrollDelay + " ms");
    setTimeout(() => this.scrollTop(data, config), config.scrollDelay);
  },
  scrollTop: function (data, config) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.debug(
      "DEBUG: inspecting elements in " + config.scrollDelay + " ms"
    );
    setTimeout(() => this.inspect(data, config), config.scrollDelay);
  },
  inspect: function (data, config) {
    var totalRows = this.totalRows();
    console.debug("DEBUG: total search results found on page are " + totalRows);
    if (totalRows >= 0) {
      this.compile(data, config);
    } else {
      console.warn("WARN: end of search results!");
      this.complete(config);
    }
  },
  compile: function (data, config) {
    // Find connect buttons using the specific class and text content
    var elements = document.querySelectorAll("button.artdeco-button--secondary");
    data.pageButtons = [...elements].filter(function (element) {
      return element.textContent.trim() === "Connect" &&
             element.getAttribute("aria-label")?.includes("connect");
    });

    if (!data.pageButtons || data.pageButtons.length === 0) {
      console.warn("ERROR: no connect buttons found on page!");
      console.info("INFO: moving to next page...");
      setTimeout(() => {
        this.nextPage(config);
      }, config.nextPageDelay);
    } else {
      data.pageButtonTotal = data.pageButtons.length;
      console.info("INFO: " + data.pageButtonTotal + " connect buttons found");
      data.pageButtonIndex = 0;
      
      var names = document.getElementsByClassName("entity-result__title-line");
      console.debug("DEBUG: Found " + names.length + " title line elements");
      
      names = [...names].filter(function (element) {
        const hasConnect = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.textContent.includes(
          "Connect\n"
        );
        return hasConnect;
      });
      
      data.connectNames = [...names].map(function (element) {
        const fullName = element.innerText;
        const firstName = fullName.split(" ")[0];
        return firstName;
      });
      
      setTimeout(() => {
        this.sendInvites(data, config);
      }, config.actionDelay);
    }
  },
  sendInvites: function (data, config) {
    if (config.maxRequests == 0) {
      console.info("INFO: max requests reached for the script run!");
      this.complete(config);
    } else {
      console.debug(
        "DEBUG: sending invite to " +
          (data.pageButtonIndex + 1) +
          " out of " +
          data.pageButtonTotal
      );
      var button = data.pageButtons[data.pageButtonIndex];
      button.click();
      
      setTimeout(() => {
        if (config.addNote) {
          // Find and click "Add a note" button
          var addNoteButton = document.querySelector('button[aria-label="Add a note"]');
          if (addNoteButton) {
            console.debug("DEBUG: Clicking Add a note button");
            addNoteButton.click();
            setTimeout(() => this.pasteNote(data, config), config.actionDelay);
          } else {
            console.debug("DEBUG: Add note button not found, trying send without note");
            this.clickSendWithoutNote(data, config);
          }
        } else {
          // Click "Send without a note" button
          this.clickSendWithoutNote(data, config);
        }
      }, config.actionDelay);
    }
  },
  clickSendWithoutNote: function(data, config) {
    var sendWithoutNoteButton = document.querySelector('button[aria-label="Send without a note"]');
    if (sendWithoutNoteButton) {
      console.debug("DEBUG: Clicking Send without note button");
      sendWithoutNoteButton.click();
      setTimeout(() => this.handlePostSend(data, config), config.actionDelay);
    } else {
      console.warn("WARN: Send without note button not found");
      this.handlePostSend(data, config);
    }
  },
  pasteNote: function (data, config) {
    var noteTextBox = document.getElementById("custom-message");
    if (noteTextBox) {
      noteTextBox.value = config.note.replace(
        "{{name}}",
        data.connectNames[data.pageButtonIndex]
      );
      noteTextBox.dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );
      
      // Find and click the Send button
      setTimeout(() => {
        var sendButton = document.querySelector('button[aria-label="Send now"]');
        if (sendButton) {
          console.debug("DEBUG: Clicking Send now button");
          sendButton.click();
          setTimeout(() => this.handlePostSend(data, config), config.actionDelay);
        } else {
          console.warn("WARN: Send now button not found");
          this.handlePostSend(data, config);
        }
      }, config.actionDelay);
    } else {
      console.warn("WARN: Note textbox not found");
      this.handlePostSend(data, config);
    }
  },
  handlePostSend: function (data, config) {
    // Try to close any remaining modal
    var closeButton = document.getElementsByClassName(
      "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
    );
    if (closeButton && closeButton[0]) {
      closeButton[0].click();
    }
    
    console.info(
      "INFO: invite sent to " +
        (data.pageButtonIndex + 1) +
        " out of " +
        data.pageButtonTotal
    );
    config.maxRequests--;
    config.totalRequestsSent++;
    
    if (data.pageButtonIndex === data.pageButtonTotal - 1) {
      console.debug("DEBUG: all connections for the page done, going to next page");
      setTimeout(() => this.nextPage(config), config.actionDelay);
    } else {
      data.pageButtonIndex++;
      setTimeout(() => this.sendInvites(data, config), config.actionDelay);
    }
  },
  nextPage: function (config) {
    var pagerButton = document.getElementsByClassName(
      "artdeco-pagination__button--next"
    );
    if (
      !pagerButton ||
      pagerButton.length === 0 ||
      pagerButton[0].hasAttribute("disabled")
    ) {
      console.info("INFO: no next page button found!");
      return this.complete(config);
    }
    console.info("INFO: Going to next page...");
    pagerButton[0].click();
    setTimeout(() => this.init({}, config), config.nextPageDelay);
  },
  complete: function (config) {
    console.info(
      "INFO: script completed after sending " +
        config.totalRequestsSent +
        " connection requests"
    );
  },
  totalRows: function () {
    var search_results = document.getElementsByClassName("search-result");
    if (search_results && search_results.length != 0) {
      return search_results.length;
    } else {
      return 0;
    }
  },
};

Linkedin.init({}, Linkedin.config);
