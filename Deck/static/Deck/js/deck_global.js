function uploadDeck() {
    swal({
        title: 'Sure?',
        type: 'info',
        html: 'Are you sure to publish it?',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            '<i class="flaticon-checked-1"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
            '<i class="flaticon-cancel-circle"></i> Cancel',
        cancelButtonAriaLabel: 'Thumbs down',
        padding: '2em'
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                url: "/PublishDeck",
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (result) {
                    swal("Good job!", "Successfully add!", "success");
                },
                error: function () {
                    Oops("");
                }
            })
        }
    })
}