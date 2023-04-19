
(function () {
  var chat = {
    messageToSend: "",
    messageResponses: [

    ],
    context: '',
    init: function () {
      this.cacheDOM();
      this.bindEvents();
      this.render();
    },
    cacheDOM: function () {
      this.$chatHistory = $(".chat-history");
      this.$button = $("button");
      this.$textarea = $("#message-to-send");
      this.$chatHistoryList = this.$chatHistory.find("ul");
    },
    bindEvents: function () {
      this.$button.on("click", this.addMessage.bind(this));
      this.$textarea.on("keyup", this.addMessageEnter.bind(this));
    },
    render: async function () {
      this.scrollToBottom();
      if (this.messageToSend.trim() !== "") {
        var template = Handlebars.compile($("#message-template").html());
        var context = {
          messageOutput: this.messageToSend,
          time: this.getCurrentTime()
        };

        this.$chatHistoryList.append(template(context));
        this.scrollToBottom();
        this.$textarea.val("");

        // responses
        var templateResponse = Handlebars.compile(
          $("#message-response-template").html()
        );

        var contextResponse = {
          response: await this.chat(),
          time: this.getCurrentTime()
        };

        setTimeout(
          function () {
            this.$chatHistoryList.append(templateResponse(contextResponse));
            this.scrollToBottom();
          }.bind(this),
          1500
        );
      }
    },

    addMessage: function () {
      this.messageToSend = this.$textarea.val();
      this.render();

    },
    addMessageEnter: function (event) {
      // enter was pressed
      if (event.keyCode === 13) {
        this.addMessage();
      }
    },
    scrollToBottom: function () {
      this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function () {
      return new Date()
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getRandomItem: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    chat: async function() {
      contexto = this.context + "\nYou: " + this.messageToSend + "\nJavaScript chatbot: "
      var response = ''
      await $.ajax({
        url: "https://api.openai.com/v1/completions",
        method: 'POST',
        contentType:"application/json; charset=utf-8",
        beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Bearer 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");
        },
        data: JSON.stringify({
          model: 'text-davinci-003',
          prompt: contexto,
          temperature: 0,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0,
          stop: ["You:"]
        })
      }).done(function( data ) {
        // console.log(data.choices[0].text)
        response = data.choices[0].text

        // if ( console && console.log ) {
        //   console.log( "Sample of data:", data.slice( 0, 100 ) );
        // }
      });

      this.context = contexto + response;

      console.log('context', contexto + response)
      return response
    }
  };

  chat.init();

  var searchFilter = {
    options: { valueNames: ["name"] },
    init: function () {
      var userList = new List("people-list", this.options);
      var noItems = $('<li id="no-items-found">No items found</li>');

      userList.on("updated", function (list) {
        if (list.matchingItems.length === 0) {
          $(list.list).append(noItems);
        } else {
          noItems.detach();
        }
      });
    }
  };

  searchFilter.init();
})();
