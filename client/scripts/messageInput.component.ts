class MessageInput {
  constructor(id, messageService)  {
    this.node = $(`#${id}`);
    this.room = 'general';
    this.node.append($('<div></div>').html(`
      <div class="form-group">
        <input type="text" class="inputForm form-control"></input>
        <button type="submit" class="submit btn btn-default">Send Message</button>
      </div>
    `));
      
    $('.submit').on('click', () => {
      this.message = $('.inputForm').val();
      messageService.postMessage({ 
        username: getUsername(), 
        text: this.message, 
        roomname: this.room
      });

      // erase message once sent
      $('.inputForm').val('');
    });
  }
  setRoom(room) {
    this.room = room;
  }
}
