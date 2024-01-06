$(function() {
  $('#calendar').fullCalendar({
    eventSources:
      [
        {
          url: '../figures/events.json'
        }
      ],
    defaultView: 'listYear',
  })
});
