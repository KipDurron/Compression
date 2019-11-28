$( document ).ready(function() {
    var $myGroup = $('#accordion');
    $myGroup.on('show.bs.collapse','.collapse', function() {
        $myGroup.find('.collapse.in').collapse('hide');
    });});

