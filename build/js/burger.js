$(document).ready(function() {
    $('.header__burger').click(function(e) {
        $('.header__burger,.mobile').toggleClass('active');
        $('body').toggleClass('lock ');
    });
});