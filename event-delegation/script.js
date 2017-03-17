
var $li1 = $('<li>');
var $button1 = $('<button>').css('margin-top','10px').text('Delegated Button#5 Handler');
$li1.append($button1);
$('#list').append($li1);

var $li2 = $('<li>');
var $button2 = $('<button>').css('margin-top','10px').attr('data-coolness','high').text('Button#6');
$li2.append($button2);
$('#list').append($li2);

$('#list').on('click', 'button', function() {
    if(this.hasAttribute('data-coolness')) {
        window.open('http://www.google.com','_blank');
    } else {
        var output = $(this).text();
        console.log(output);
    };
});