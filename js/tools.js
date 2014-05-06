(function (window, $, undefined) {

  var tagRegex = /\btag-\S+\b/g;

  function getTagsList() {
    // Cycle through all the tool items and generate a hash of tags.
    var tagsHash = {};
    $('.tools-item').each(function () {
      var $this = $(this),
          classStr = $this.attr('class'),
          tags = classStr.match(tagRegex);

      if (tags == null) {
        return;
      }

      $.each(tags, function (index, tag) {
        if (typeof tagsHash[tag] === 'undefined') {
          tagsHash[tag] = tag.replace('tag-', '').replace('-', ' ');
        }
      });
    });

    // Generate a list of tags from the hash of tags.
    return $.map(tagsHash,
            function (value, key) {
              return {
                id: key,
                value: value
              };
            })
            .sort(function (a, b) {
              if (a.id > b.id) {
                return 1;
              } else if (a.id < b.id) {
                return -1;
              } else {
                return 0;
              }
            });
  }

  $(document).ready(function () {
    // Create Isotope layout.
    $('#tools-frame').isotope({
      itemSelector: '.tools-item',
      layoutMode: 'fitRows',
      sortBy: 'created_at',
      sortAscending: false
    });

    // Create tags list.
    $.templates("#tmpl-tags-list")
      .link(
        '#tools-sidebar',
        {
          tags: getTagsList()
        }
      );

    // Handle clicks on the tag list.
    var $currentActive = $('#tools-sidebar a[data-filter].active');
    $('#tools-sidebar a[data-filter]').click(function () {
      var $this = $(this),
          filterValue = $this.data('filter');

      $currentActive.removeClass('active');

      $currentActive = $this.addClass('active');

      $('#tools-frame').isotope({ filter: filterValue });

      return false;
    });

    Echo.init({
      offset: 100,
      throttle: 250
    });
  });

}(window, jQuery));
