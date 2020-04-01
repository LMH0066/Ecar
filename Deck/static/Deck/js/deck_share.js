function shareDeck(deck_id) {
    let ev = window.event || arguments.callee.caller.arguments[0];
    if (window.event) ev.cancelBubble = true;
    else {
        ev.stopPropagation();
    }

    // let deck_id = $(svg).parent().attr("id");
    swal({
        title: "Share Deck",
        text: 'Please input the share password and we will return the share code, both of which will be used when sharing',
        input: 'text',
        padding: '2em',
        showCancelButton: true
    }).then(function (result) {
        if (result.value) {
            let form_data = new FormData();
            form_data.append('share_password', result.value);
            form_data.append('deck_id', deck_id);
            $.ajax({
                url: "/deck/SetShareCode",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    if (ret.status) {
                        swal("Good job!", "Successfully add!", "success");
                        swal({
                            title: "Share Info",
                            html: "share_code: " + ret['data']['share_code'] + "<br>" +
                                "share_password: " + ret['data']['share_password'],
                            padding: '2em',
                            showCancelButton: false,
                            confirmButtonText: "COPY~"
                        }).then(function (result) {
                            if (result.value) {
                                let content = "share_code: " + ret['data']['share_code'] + "\n" +
                                    "share_password: " + ret['data']['share_password'];
                                let clipboard = new ClipboardJS('.swal2-actions .swal2-confirm', {
                                    text: function () {
                                        return content;
                                    }
                                });
                                Snackbar.show({
                                    text: 'Copy Success',
                                    pos: 'bottom-left'
                                });
                            }
                        });
                    } else {
                        Oops(ret['data']);
                    }
                },
                error: function () {
                    Oops("");
                }
            })
        }
    });
}