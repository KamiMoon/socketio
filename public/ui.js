function UserTypingUI(socket) {
    var that = this;
    var $isTypingDisplayEl = $("#isTyping");
    var $inputEl = null;

    this.usersTyping = {};
    this.userName = '';

    this.render = function() {
        var html = "";

        for (var user in this.usersTyping) {
            html += "<li>" + user + " is typing...</li>";
        }

        $isTypingDisplayEl.html(html);
    };

    this.stopTyping = function() {
        socket.emit('stopped typing', this.userName);
    };

    this.monitorMyTyping = function(userName) {
        this.userName = userName;

        $inputEl = $("#m");

        $inputEl.on('keyup', function() {
            var msg = $inputEl.val();

            if (msg.length) {
                socket.emit('is typing', that.userName);
            } else {
                that.stopTyping();
            }
        });
    };

    socket.on('is typing', function(user) {
        that.usersTyping[user] = true;
        that.render();
    });

    socket.on('stopped typing', function(user) {
        delete that.usersTyping[user];
        that.render();
    });

}

$(document).ready(function() {
    var socket = io();

    var userName = '';
    var userTypingUI = new UserTypingUI(socket);

    function appendMessage(msg) {
        $('#messages').append($('<li>').text(msg));
    }

    $('#userForm').submit(function() {

        userName = $('#user_name').val();

        socket.emit('user joined', userName);

        userTypingUI.monitorMyTyping(userName);

        $('#user_name').val('');

        $('#userForm').hide();
        $('#chatForm').show();

        return false;
    });


    $('#chatForm').submit(function() {
        var msg = $('#m').val();
        appendMessage(msg);

        userTypingUI.stopTyping();

        socket.emit('chat message', userName + ": " + msg);
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        appendMessage(msg);
    });



});
