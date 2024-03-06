var options = {
  valueNames: [ 'menu__item-inner' ]
};

var podcast_list = new List('menu__container', options);

document.getElementById('podcast_search').addEventListener('keyup', function() {
  var searchString = this.value;
  podcast_list.search(searchString);
  // if input field contains a character toggle filtered class (which hides the loop clones)
  var menu__container = document.getElementById('bng__list');
  if (searchString != '' ) {
    menu__container.classList.add('filtered');
  }
  else {
    menu__container.classList.remove('filtered');
  }
});

podcast_list.on('updated', function() {
  if (podcast_list.size() == 0) {
    console.log("empty");
  }
});

var search = document.getElementById('podcast_search');
search.onfocus = function () {
    search.parentNode.classList.add('filtering');
    window.scrollTo(0, 0);
}

search.onblur = function () {
    search.parentNode.classList.remove('filtering')
}