window.app = window.app || {};
window.jQuery = window.jQuery || {};
(function(app, $) {
    var addMessage = function(container, direction, body) {
        var message = "<div class=\"chat-message " + direction + "\"><div class=\"alert alert-" + (direction === "outbound" ? "success" : "info") + "\">" + body + "</div></div>";
        $(".chat-messages", container).append(message).animate({ scrollTop: 10000 }, "slow");
    };
    
    $(document).ready(function() {
        $(".chat form").submit(function(e) {
            e.preventDefault();
            var input = e.currentTarget.input
                ,body = input.value
                ,container = $(e.currentTarget).parents(".chat")
                ,module = container.data("module");
            if( ! body) {
                $(input).focus();
                return;
            }
            
            addMessage(container, "outbound", body);
            $(input).val("");
            
            $.getJSON("/api/" + encodeURIComponent(module) + "/" + encodeURIComponent(body), function(response) {
                if(response.data !== undefined) {
                    var i;
                    for(i in response.data) {
                        addMessage(container, "inbound", response.data[i]);
                    }
                }
            });
        });
    });
})(window.app, window.jQuery);