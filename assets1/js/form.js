var sendSnackbar = false;
var successSnackbar = false;
var failSnackbar = false;
var btn = $('input[type="submit"]');

$('input[type="reset"]').click(() => { // enable the button if form resetted
    if(btn.hasClass('disabled')) {
        btn.removeClass('disabled');   
    }
    btn.val('送出');
});

$('#reg_form').submit((e) => {
    e.preventDefault();
    var id = $('input[name="id"]');
    if (!idVerify($(id).val())) {
        id[0].setCustomValidity('請輸入正確的身份證字號！'); // invalid
        $(id).change((e) => {
            if ( idVerify($(id).val()) ) {
                id[0].setCustomValidity('');
            }
        })
        console.log('id error'+$(id).val());
        return null;
    }
    var time = new Date().toString();
    $('input[name="time"]').val(time);
    var form = $('#reg_form');
    var data = false;
    if (window.FormData) {
        data = new FormData(form[0]);
    }

    if(!sendSnackbar){ // sending snackbar
        sendSnackbar = $.snackbar({
            content: "傳送中...",
            timeout: 1500
        });
    } else {
        $(sendSnackbar).snackbar('show');
    }

    if(!btn.hasClass('disabled')){
        btn.addClass('disabled'); // disable the button if sending
    }

    $.ajax({
        url: '/register',
        type: 'put',
        data: data ? data : form.serialize(),
        cache: false,
        contentType: false,
        processData: false
    }).done(() => {
        if(!successSnackbar){ // success snackbar
            successSnackbar = $.snackbar({
                content: "傳送成功!",
                timeout: 3000
            });
        } else {
            $(successSnackbar).snackbar('show');
        }

        btn.val('已報名'); // disabled button
        $('input[type="reset"]').hide();
    }).fail((jqXHR) => {
        if(jqXHR.status == 403) {
            if(!failSnackbar){ // fail snackbar
                failSnackbar = $.snackbar({
                    content: "未在報名期間!",
                    timeout: 3000
                });
            } else {
                $(failSnackbar).snackbar('show');
            }
        } else {
            if(!failSnackbar){ // fail snackbar
                failSnackbar = $.snackbar({
                    content: "傳送失敗 QWQ 請再試一次，或是洽詢粉專。",
                    timeout: 3000
                });
            } else {
                $(failSnackbar).snackbar('show');
            }
    
            if(btn.hasClass('disabled')) { // enable the button
                btn.removeClass('disabled');   
            } 
        }
    });
});