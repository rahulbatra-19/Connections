// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleReaction {
    constructor(toggleElement) {
        // console.log($(toggleElement).children('.toggle-reaction-button'));
        this.writingCount = $(toggleElement).children('.reaction-count');
        console.log(this.writingCount);
        this.toggler = $(toggleElement).children('.toggle-reaction-button');
        // console.log(this.toggler[0]);
        this.toggleReaction();
    }


    toggleReaction() {
        let selfO = this;
        console.log(selfO);
        for (let toggle of this.toggler) {
            $(toggle).click(function (e) {
                e.preventDefault();
                let self = this;
                console.log(self);
                // this is a new way of writing ajax which you might've studied, it looks like the same as promises
                $.ajax({
                    type: 'POST',
                    url: $(self).attr('href'),
                })
                    .done(function (data) {
                        let likesCount = 0;
                        if ($(self).hasClass('delete')) {

                            likesCount = parseInt($(selfO.writingCount).attr('data-likes'));

                            if (data.data.deleted == true) {
                                likesCount -= 1;
                            } else {
                                likesCount += 1;
                            }

                            $(selfO.writingCount).attr('data-likes', likesCount);
                            $(self).css('display', 'none');
                            $(self).removeClass('delete');
                            // console.log($(self))
                            $(selfO.writingCount).html(`
                            <div class="reactions-container 1">
                            <span class="reaction-count" data-likes="${data.data.comment.reactions.length}">
                            ${likesCount} 
                             </span>
                            <a class="toggle-reaction-button like" data-likes="${data.data.comment.reactions.length}" data-type="👍🏻"
                            href="/reactions/toggle/?id=${data.data.comment._id}&type=${data.data.onModel}&reactiontype=👍🏻">
                            👍🏻
                          </a>
                          <a class="toggle-reaction-button love" data-likes="${data.data.comment.reactions.length}" data-type="❤️"
                            href="/reactions/toggle/?id=${data.data.comment._id}&type=${data.data.onModel}&reactiontype=❤️">
                            ❤️
                          </a>
                          <a class="toggle-reaction-button funny" data-likes="${data.data.comment.reactions.length}" data-type="🤣"
                            href="/reactions/toggle/?id=${data.data.comment._id}&type=${data.data.onModel}&reactiontype=🤣">
                            🤣
                          </a>
                          <a class="toggle-reaction-button wow" data-likes="${data.data.comment.reactions.length}" data-type="🤩"
                            href="/reactions/toggle/?id=${data.data.comment._id}&type=${data.data.onModel}&reactiontype=🤩">
                            🤩
                          </a>
                          <a class="toggle-reaction-button sad" data-likes="${data.data.comment.reactions.length}" data-type="😢"
                            href="/reactions/toggle/?id=${data.data.comment._id}}&type=${data.data.onModel}&reactiontype=😢">
                            😢
                          </a>
                          <a class="toggle-reaction-button angry" data-likes="$${data.data.comment.reactions.length}" data-type="😡"
                            href="/reactions/toggle/?id=${data.data.comment._id}&type=${data.data.onModel}&reactiontype=😡">
                            😡
                          </a>
                          </div>
                          <script>
                          $('.1').each(function(){
                                    let self = this;
                                      console.log(this);
                                    let toggleReaction= new ToggleReaction(self);
                          });
                            </script>
                          
                          `);
                        }
                        else {
                            likesCount = parseInt($(selfO.writingCount).attr('data-likes'));

                            if (data.data.deleted == true) {
                                likesCount -= 1;
                            } else {
                                likesCount += 1;
                            }

                            if (data.data.deleted == false) {
                                $(selfO.toggler).css('display', 'none');
                                $(self).css('display', 'inline-block');
                            }
                            else {
                                $(selfO.toggler).css('display', 'inline-block');
                            }
                            $(selfO.writingCount).attr('data-likes', likesCount);
                            $(selfO.writingCount).html(`${likesCount} `);
                        }


                    })
                    .fail(function (errData) {
                        console.log('error in completing the request');
                    });


            });
        }
    }
}
