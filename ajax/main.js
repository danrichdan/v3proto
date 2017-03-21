//Create GLOBAL variable below here on line 2
var global_result;

$(document).ready(function(){
    $('button').click(function(){
        console.log('click initiated');
        $.ajax({
            dataType: 'json',
            url: 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topMovies/json',
            success: function(result) {
                console.log('AJAX Success function called, with the following result:', result);
                global_result = result;
                var first_movie = global_result.feed.entry[0];
                console.log('Here is the first movie : ', first_movie);
                var first_movie_image = global_result.feed.entry[0]['im:image'][2];
                console.log('Here is the first movie\'s image : ', first_movie_image);
                var first_movie_image_url = global_result.feed.entry[0]['im:image'][2].label;
                console.log('Here is the first movie\'s image : ', first_movie_image_url);
                for(var i = 0; i < global_result.feed.entry.length; i++) {
                    var movie_image_url = global_result.feed.entry[i]['im:image'][2].label;
                    var movie_title = global_result.feed.entry[i]['im:name'].label;
                    var movie_director = global_result.feed.entry[i]['im:artist'].label;
                    var $figure = $('<figure>');
                    var $figcaption1 = $('<figcaption>').text(movie_title);
                    var $figcaption2 = $('<figcaption>').text(movie_director);
                    var $img = $('<img>').attr('src', movie_image_url);
                    $figure.append($img, $figcaption1, $figcaption2).addClass('movies');
                    $('#main').append($figure);
                }
            }


        });
        console.log('End of click function');
    });
});