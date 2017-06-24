// YOUR CODE HERE:
//how to we get these messages into our page/index.html?
//these all need to be their own functions so that can be called 'onclick'

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  friendsList: {},
  roomsList: {}
};

app.init = function() {
  app.fetch();
  setInterval(app.fetch, 2000000);
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages', type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message retrieved');
      console.log(data);
      app.clearMessages();
      _.each(data.results, function(value) {
        var roomSelect = $('#roomSelect option:selected').val();
        if (value.roomname === roomSelect) {
          app.renderMessage(value);
        }
        app.renderRoom(value.roomname);
      });
      app.myFriends();
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });

};

app.renderMessage = function(message) {
  $('#chats').append(`
    <div class='chats'>
      <span class='username' data-username=${_.escape(message.username)}>
        ${_.escape(message.username)}
      </span>
    ${_.escape(message.text)}
    Create At: ${message.createdAt}
    Location: ${message.roomname}
    </div>`
    );

  $('.username').click(function(value) {
    app.addFriend(value.target);
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addFriend = function(event) {
  var friend = $(event).text();
  app.friendsList[friend] = true;
};

app.renderRoom = function(room) {
  if (app.roomsList[room] === undefined) {
    app.roomsList[room] = true;
    $('#roomSelect').append("<option value ='" + room + "'>" + room + "</option>");
  }
};
// app.submitHandler = function () {
//   var message = $('#messageToBeSent').val();
//   console.log(message);

//   var messageObj = {
//     username: 'shawndrost',
//     text: message,
//     roomname: '4chan'
//   };

//   app.send(messageObj);
// };

app.myFriends = function() {
  for (var key in app.friendsList) {
    $('[data-username=' + key + ']').css('font-weight', 'bold');
  }
};

$(document).ready(function() {
  app.init();

  $('#submit').click(function(event) {
    var message = $('#messageToBeSent').val();
    var username = window.location.search.slice(10);
    var room = $('#roomSelect').val();
    var messageObj = {};
    messageObj.username = username;
    messageObj.text = message;
    messageObj.roomname = room;

    console.log(messageObj);
    var test = JSON.stringify(messageObj);
    console.log(test);

    app.send(messageObj);
  });

  $('button').click(function() {
    app.fetch();
  });

  $('#newRoom').click(function() {
    var roomName = prompt('What should the room be called?');
    app.renderRoom(roomName);
  });
});





