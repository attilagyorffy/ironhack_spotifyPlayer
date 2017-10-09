$(document).on('ready', function(){
  var request = $.get('https://y8iewpw0de.execute-api.us-east-2.amazonaws.com/beta');
  request.done(function(data){
    var token = data.data.access_token;

    $.ajaxSetup({
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
  })
})

$('.btn-play').on('click', function(e){
  if ($(this).hasClass('playing')) {
      $('.js-player').trigger('pause');
    } else {
      $('.js-player').trigger('play');
    }
    $(this).toggleClass('playing');
  });

$('.author').on('click', function(e){
  $('.js-modal').modal();
});

// Define a function to print the player's current time
function printTime () {
  var current = $('.js-player').prop('currentTime');
  $('progress').val(current);
  console.debug('Current time: ' + current);

}
// Have printTime be called when the time is updated
$('.js-player').on('timeupdate', printTime);

$('.js-submit').on('submit', function(e){
		e.preventDefault();
		if ($('input[name=query]').val()){
			trackName = $('input[name=query]').val();
			fetchTracks(trackName);
		}
	});

$('.js-artist-list').on('click', 'a',function(e){
	e.preventDefault();
	artistID = $(this).data('artistid');
	fetchAlbums(artistID);
});

function fetchTracks (trackName) {

  var request = $.get('https://api.spotify.com/v1/search?type=track&query='+trackName);

  request.done(handleTracks);
  request.fail(handleError);
}

function fetchAuthorData(authorid){
  var request = $.get('https://api.spotify.com/v1/artists/'+authorid);

  request.done(handleArtist);
  request.fail(handleError);
}

function handleArtist(artist){
  $('.modal-header h2').text(artist.name);
  var image = '<img src="' + artist.images[0].url +'" />';
  $('.modal-body').html(image);
}

function handleTracks (tracks) {

    var track = tracks.tracks.items[0];
    $('.title').text(track.name);
    $('audio').attr('src', track.preview_url);
    $('.author').text(track.artists[0].name);
    $('.cover img').attr('src', track.album.images[0].url);

    if ($('.btn-play').hasClass('playing')) {
      $('.btn-play').removeClass('playing');
    }

    $('progress').val(0);
    fetchAuthorData( track.artists[0].id);
  }
  function handleError (err1, err2, err3) {
    console.error('OH NO!!', err1, err2, err3);
  }
