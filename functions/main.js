function myMessage() {
    console.log('This is the myMessage Function');
}

function add(x,y) {
    var result;
    result = x + y;
    console.log(result);
}

function add2(x, y) {
    var total = x + y;
    return total;
}

add2result = add2(10, 36);

function cardFlip(element) {
    $(element).hide();
}

var result = add2(add2(5, 10), add2(20, 30));