class ChatEngine{
    constructor(chatBoxId, userEmail, userEmail2, user1, user2 , user1Name ){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userEmail2 = userEmail2;
        this.user1Id = user1 ;
        this.user2Id = user2;
        this.senderName = user1Name;
        this.socket = io.connect('http://localhost:4000');
        this.room = this.generateChatroomName(userEmail, userEmail2);
        console.log(this.room);

        if (this.userEmail){
            this.connectionHandler();
        }
    }


    connectionHandler(){
        let self = this;
        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');

            // console.log(self.room);
        self.socket.emit('join_room', {
            user_email : self.userEmail,
            second_user_email : self.userEmail2,
            chatroom: self.room
        });

        self.socket.on('user_joined', function(data){
            console.log('A user joined', data);
        });
    });

    $('#send-message').click(function(){
        let msg = $('#chat-message-input').val();
        
        if(msg!=''){
        console.log(msg);

            self.socket.emit('send_message', {
                message:  msg,
                sender : self.userEmail,
                senderName : self.senderName,
                senderId:  self.user1Id,
                receiverId : self.user2Id,
                chatroom: self.room
            });
        }
        $('#chat-message-input').val('');
    });
    

    function scrollToBottom(){
        var chatBox = $('#chat-messages-list');
        chatBox.scrollTop(chatBox.prop("scrollHeight"));
    }

    self.socket.on('receive_message', function(data){

        console.log("message received", data.message);

        let newMessage = $('<li>');
        let messageType = 'other-message';

        if(data.sender == self.userEmail){
            messageType = 'self-message';
        }

        newMessage.append($('<span>',{
            'html': data.message
        }));

        newMessage.append($('<sub>',{
            'html': data.sender
        }));
        newMessage.addClass(messageType);

        $('#chat-messages-list').append(newMessage);
        scrollToBottom();
    });

    }

     generateChatroomName(user1Email, user2Email) {
        // Sort the emails alphabetically to ensure consistency in the chatroom name
        const sortedEmails = [user1Email, user2Email].sort();
        console.log(sortedEmails)
        const chatroomName = `${sortedEmails[0]}_${sortedEmails[1]}`; // Concatenate the sorted emails with an underscore
      
        return chatroomName;
      }
}