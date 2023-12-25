// Timeline Canvas and Context
const canvas = document.getElementById('timeline');
const ctx = canvas.getContext('2d');

// Control Buttons
const stopButton = document.getElementById('stopButton');
const startButton = document.getElementById('startButton');
const fastForwardButton = document.getElementById('fastForwardButton');
const slowForwardButton = document.getElementById('slowForwardButton');
const normalSpeedButton = document.getElementById('normalSpeedButton');
const video = document.getElementById('myVideo');

// Timeline Configuration
let isShowingPreviewLine = false;
let previewLineX = 0;

canvas.width = window.innerWidth - 60;
canvas.height = 80; // Adjusted height to accommodate the ruler

// Set initial timeline duration based on the video duration after metadata is loaded
let totalTime = 60 * 60 * 24;

// Event listener for video metadata loaded event
video.addEventListener('loadedmetadata', () => {
  // totalTime = Math.ceil(video.duration); // Round up to the nearest second
  console.log(video.duration); // Check the total time
  drawTimeline();
});
const pixelsPerSecond = canvas.width / totalTime;

// Animation State and Speed
let isAnimating = false;
let currentTimeInSeconds = 0; // Starting at 00:00:00
let indicatorHeight = 40; // Adjusted indicator height
let animationSpeed = 1; // Default speed (1 second per frame)

// Array of Point of Interest Markers
const pointOfInterestMarkers = [
  { title: 'Fire', time: 1800, color: '#FF5733' },  // Example: Marker at 00:30:00
  { title: 'Humidity', time: 7200, color: '#cd0cca' }   // Example: Marker at 02:00:00
  // Add more markers as needed
];

// Draw horizontal line based on video duration
function drawVideoDurationLine() {
  const lineY = canvas.height / 1.2; // Adjust the Y position of the line
  const videoLineX = (video.duration / totalTime) * canvas.width;

  // Create a gradient for the line
  const gradient = ctx.createLinearGradient(0, 0, videoLineX, 0);
  gradient.addColorStop(0, '#3498db'); // Start color
  gradient.addColorStop(1, '#2ecc71'); // End color

  ctx.lineWidth = 8;
  ctx.strokeStyle = gradient; // Use the gradient for the line color

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(0, lineY);
  ctx.lineTo(videoLineX, lineY);
  ctx.stroke();
}

// Function to draw the timeline
function drawTimeline() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Increase the timeline height to accommodate the horizontal line
  const timelineHeight = 110;
  canvas.height = timelineHeight;

  // Draw ruler graduation steps for hours
  drawGraduationStepsHours(3600, '|', 18, '#ce1b24', 16);

  // Draw larger vertical bars for every 30 minutes of every hour
  drawGraduationStepsHalfHours(1800, 10, '#34a853');

  // Draw smaller graduation steps for minutes
  drawGraduationStepsMinutes(300, '|', 18, '#fbbc05', 8);

  // Draw timeline background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 20, canvas.width, timelineHeight - 20);

  // Draw horizontal line based on video duration
  drawVideoDurationLine();

  // Draw time labels
  drawTimeLabels(3600, 40);

  // Draw markers on the timeline
  drawMarkers(pointOfInterestMarkers);

  // Draw timeline indicator with time at the bottom
  const indicatorX = (currentTimeInSeconds / totalTime) * canvas.width;
  drawCustomIndicator(indicatorX);

  // Draw the preview line when hovering over the timeline
  drawPreviewLine();

  // Continue animation if it's running
  if (isAnimating) {
    requestAnimationFrame(drawTimeline);
    updateTimeline();
  }
}

// Function to draw markers on the timeline
function drawMarkers(markers) {
  markers.forEach(marker => {
    const markerX = (marker.time / totalTime) * canvas.width;
    const markerY = 10; // Adjust the Y position above the graduation steps

    ctx.fillStyle = marker.color;
    ctx.beginPath();
    ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw title next to the marker
    ctx.fillStyle = marker.color;
    ctx.textAlign = 'center';
    ctx.fillText(marker.title, markerX, markerY + 45);
  });
}

// Function to draw a custom-shaped indicator
function drawCustomIndicator(x) {
  const indicatorColor = '#4CAF50';
  const shadowColor = 'rgba(0, 0, 0, 0.3)';
  const shadowBlur = 5;

  // Draw shadow
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;

// Draw indicator shape with background color
  ctx.fillStyle = indicatorColor;
    ctx.beginPath();
  ctx.moveTo(x, 20);
  ctx.lineTo(x, 20 + indicatorHeight);
  ctx.arc(x, 20 + indicatorHeight, 5, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Draw time at the bottom in hh:mm:ss format
  const currentTimeFormatted = formatTime(currentTimeInSeconds, true);
  ctx.fillStyle = '#000';
  ctx.textAlign = 'start';
  ctx.fillText(currentTimeFormatted, x, 20 + indicatorHeight + 15);
}

// Function to draw ruler graduation steps
function drawGraduationStepsHours(interval, symbol, y, color, fontSize) {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
for (let i = 0; i <= totalTime; i += interval) {
    const x = (i / totalTime) * canvas.width;
    ctx.fillText(symbol, x - 2, y);
  }
}

// Function to draw ruler graduation steps
function drawGraduationStepsMinutes(interval, symbol, y, color, fontSize) {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
for (let i = 0; i <= totalTime; i += interval) {
    if (i % 1800 !== 0) {
      const x = (i / totalTime) * canvas.width;
      ctx.fillText(symbol, x, y);
    }
  }
}

// Function to draw larger vertical bars
function drawGraduationStepsHalfHours(interval, height, color) {
  ctx.fillStyle = color;
  ctx.font = '8px Arial';
  for (let i = 0; i <= totalTime; i += interval) {
if (i % 3600) {
    const x = (i / totalTime) * canvas.width;
    ctx.fillRect(x - 1, 10, 3, height);
  }
}
}

// Function to draw time labels in timeline
function drawTimeLabels(interval, y) {
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
for (let i = 0; i <= totalTime; i += interval) {
    const x = (i / totalTime) * canvas.width;
    const formattedTime = formatTime(i);
    ctx.fillText(formattedTime, x, y);
  }
}

// Function to update timeline state
function updateTimeline() {
  const now = new Date();
  const elapsedMilliseconds = now - lastTimestamp;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  currentTimeInSeconds += elapsedSeconds * animationSpeed;

  if (currentTimeInSeconds >= totalTime) {
    currentTimeInSeconds = 0; // Reset the counter when it reaches 23:59:59
    stopButton.click(); // Stop the video and reset the timeline when it completes
  }

  lastTimestamp = now;
}

// Function to format time in HH:mm:ss format
function formatTime(seconds, isIndicator = false) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (isIndicator) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  } else if (canvas.width < 1200) {
    return `${padZero(hours)}:${padZero(minutes)}`;
  } else {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  }
}

// Function to pad zeros
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

// Function to select a time when clicking on the timeline
function selectTime(event) {
  const mouseX = event.clientX;

  // Calculate the clicked time based on the mouse position
  const selectedTimeInSeconds = (mouseX / canvas.width) * totalTime;

  // Update the current time and redraw the timeline
  currentTimeInSeconds = selectedTimeInSeconds;
  drawTimeline();
}

// Function to show time preview when hovering over the timeline
function showTimePreview(event) {
  const mouseX = event.clientX;

  // Calculate the previewed time and line position based on the mouse position
  const previewedTimeInSeconds = (mouseX / canvas.width) * totalTime;
  previewLineX = mouseX;
  isShowingPreviewLine = true;

    // Display the previewed time in a tooltip or any other UI element
    // For simplicity, let's log it to the console
    // console.log("Previewed Time: " + formatTime(previewedTimeInSeconds));
  
  // Redraw the timeline to update the preview line
  drawTimeline();
}

// Function to draw the preview line
function drawPreviewLine() {
  if (isShowingPreviewLine) {
    // Draw the red vertical line
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(previewLineX, 20);
    ctx.lineTo(previewLineX, canvas.height);
    ctx.stroke();

    // Draw the time below the line
    const previewedTimeInSeconds = (previewLineX / canvas.width) * totalTime;
    const previewedTimeFormatted = formatTime(previewedTimeInSeconds);
    ctx.fillStyle = 'red';
    ctx.textAlign = 'start';
    ctx.fillText(previewedTimeFormatted, previewLineX, canvas.height - 5);
  }
}

// Function to hide the time preview when leaving the timeline
function hideTimePreview() {
  isShowingPreviewLine = false;
  drawTimeline();
}

// Event listeners

// Event listener for start button click event
startButton.addEventListener('click', () => {
  if (!isAnimating) {
    isAnimating = true;
    lastTimestamp = new Date();
    drawTimeline();
    video.play(); // Start the video when the timeline starts
  }
});

// Event listener for stop button click event
stopButton.addEventListener('click', () => {
  isAnimating = false; // Stop the animation
  video.pause(); // Pause the video when the timeline stops
  video.currentTime = 0; // Reset video to the beginning
  currentTimeInSeconds = 0; // Reset the timeline to the beginning
  drawTimeline(); // Redraw the timeline at the beginning
});

// Start button click event
startButton.addEventListener('click', () => {
  if (!isAnimating) {
    isAnimating = true;
    lastTimestamp = new Date();
    drawTimeline();
  }
});

// Fast forward button click event
fastForwardButton.addEventListener('click', () => {
  // Increase the animation speed by a factor (e.g., doubling it)
  animationSpeed *= 4;

  // Limit the maximum speed to avoid excessive acceleration
  const maxSpeed = 2000; // You can adjust this value as needed
  if (animationSpeed > maxSpeed) {
    animationSpeed = maxSpeed;
  }

  if (isAnimating) {
    lastTimestamp = new Date();
    requestAnimationFrame(drawTimeline);
  }
});

// Slow forward button click event
slowForwardButton.addEventListener('click', () => {
  animationSpeed = 0.5; // Change speed to slow forward (0.5 seconds per frame)
  if (isAnimating) {
    lastTimestamp = new Date();
    requestAnimationFrame(drawTimeline);
  }
});

// Normal speed button click event
normalSpeedButton.addEventListener('click', () => {
  animationSpeed = 1; // Change speed to normal (1 second per frame)
  if (isAnimating) {
    lastTimestamp = new Date();
    requestAnimationFrame(drawTimeline);
  }
});

// Event listener for window resize
window.addEventListener('resize', () => {
  canvas.width =  window.innerWidth - 60;
  drawTimeline();
});

// Event listener for selecting a time when clicking on the timeline
canvas.addEventListener('click', selectTime);
// Event listener for clicking on the timeline to seek
canvas.addEventListener('click', seekVideo);

// Event listeners for time preview
canvas.addEventListener('mousemove', showTimePreview);
canvas.addEventListener('mouseleave', hideTimePreview);

// Function to handle seeking the video
function seekVideo(event) {
  const mouseX = event.clientX;

  // Calculate the clicked time based on the mouse position
  const clickedTimeInSeconds = (mouseX / canvas.width) * totalTime;

  // Update the current time and redraw the timeline
  currentTimeInSeconds = clickedTimeInSeconds;
  // Update the video's current time
  video.currentTime = clickedTimeInSeconds;
  drawTimeline();
}

  // Initial draw
  let lastTimestamp = new Date();
  //drawTimeline();
