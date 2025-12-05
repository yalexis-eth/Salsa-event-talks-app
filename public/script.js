document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('scheduleContainer');
  const searchInput = document.getElementById('searchInput');
  let talks = [];

  // Fetch talk data
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
    });

  // Search functionality
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk => 
      talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  // Render schedule
  function renderSchedule(talksToRender) {
    scheduleContainer.innerHTML = '';
    let startTime = new Date();
    startTime.setHours(10, 0, 0, 0);

    const renderTalk = (talk) => {
      const talkElement = document.createElement('div');
      talkElement.classList.add('schedule-slot');
      
      const timeElement = document.createElement('div');
      timeElement.classList.add('time');
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      timeElement.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      
      const detailsElement = document.createElement('div');
      detailsElement.classList.add('talk-details');
      
      const titleElement = document.createElement('h2');
      titleElement.textContent = talk.title;
      
      const speakersElement = document.createElement('div');
      speakersElement.classList.add('speakers');
      speakersElement.textContent = `by ${talk.speakers.join(', ')}`;
      
      const categoryElement = document.createElement('div');
      categoryElement.classList.add('category');
      talk.category.forEach(cat => {
        const span = document.createElement('span');
        span.textContent = cat;
        categoryElement.appendChild(span);
      });

      const descriptionElement = document.createElement('div');
      descriptionElement.classList.add('description');
      descriptionElement.textContent = talk.description;

      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(speakersElement);
      detailsElement.appendChild(categoryElement);
      detailsElement.appendChild(descriptionElement);
      
      talkElement.appendChild(timeElement);
      talkElement.appendChild(detailsElement);
      
      scheduleContainer.appendChild(talkElement);

      startTime = new Date(endTime.getTime() + 10 * 60 * 1000); // 10 minute break
    };

    const renderBreak = (duration, label) => {
        const breakElement = document.createElement('div');
        breakElement.classList.add('schedule-slot', 'break');

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
        timeElement.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;

        const labelElement = document.createElement('div');
        labelElement.textContent = label;

        breakElement.appendChild(timeElement);
        breakElement.appendChild(labelElement);
        scheduleContainer.appendChild(breakElement);

        startTime = endTime;
    }

    talksToRender.forEach((talk, index) => {
        if (index === 3) { // Lunch break after the 3rd talk
            renderBreak(60, 'Lunch Break');
            if (index > 0) { // Add 10 minute transition after break
                startTime = new Date(startTime.getTime() + 10 * 60 * 1000);
            }
        }
        renderTalk(talk);
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});
