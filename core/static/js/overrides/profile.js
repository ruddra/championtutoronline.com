function updateAbtMe() {
   $('.update_abt_me').hide();
   $('.abt_me_text').hide();
   $('.abt_me_form').show();
};

function changeMajor() {
   $('.change_major').hide();
   $('.change_major_text').hide();
   $('.change_major_form').show();
};

function changeTExp() {
   $('.change_texp').hide();
   $('.change_texp_text').hide();
   $('.change_texp_form').show();
};

function changeEInterest() {
   $('.change_einterest').hide();
   $('.change_einterest_text').hide();
   $('.change_einterest_form').show();
};

$(document).ready(function() {
    $('form').submit(function() {
    $(this).hide();
        $.ajax({
            data: $(this).serialize(),
            type: "post",
            url:  $(this).attr('action'),
            success: function(response) {
                var c = $(response.update_data_class);
                var b = $(response.update_btn_class);
                c.text(response.value);
                c.show();
                b.show();


            }
        });
        return false;
    });
});
