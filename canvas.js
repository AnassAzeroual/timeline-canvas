const canvas = document.getElementById('timeline');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const fastForwardButton = document.getElementById('fastForwardButton');
const slowForwardButton = document.getElementById('slowForwardButton');
const normalSpeedButton = document.getElementById('normalSpeedButton');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = 120; // Adjusted height to accommodate the ruler

// Timeline data
const totalTime = 23 * 60 * 60; // Total seconds in a day
const pixelsPerSecond = canvas.width / totalTime;

// Variables to track animation state and speed
let isAnimating = false;
let wasPlayingBeforeDrag = false;
let currentTimeInSeconds = 600; // Starting at 00:10:00
let markerTimeInSeconds = 1800; // Example: Marker at 00:30:00
let indicatorHeight = 40; // Adjusted indicator height
let animationSpeed = 1; // Default speed (1 second per frame)

// Variables for dragging indicator
let isDragging = false;
let dragStartX = 0;

// Function to draw the timeline
function drawTimeline() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ruler graduation steps for hours
  drawGraduationSteps(3600, '|', 12, '#4285f4', 12);

  // Draw larger vertical bars for every 30 minutes of every hour
  drawVerticalBars(1800, 8, '#34a853');

  // Draw smaller graduation steps for minutes
  drawGraduationSteps(300, '|', 18, '#fbbc05', 8);

  // Draw timeline background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 20, canvas.width, canvas.height - 20);

  // Draw time labels
  drawTimeLabels(3600, 40);

  // Draw marker on the timeline
  drawMarker(markerTimeInSeconds);

  // Draw timeline indicator with time at the bottom
  const indicatorX = (currentTimeInSeconds / totalTime) * canvas.width;
  drawCustomIndicator(indicatorX);

  // Continue animation if it's running
  if (isAnimating && !isDragging) {
    requestAnimationFrame(drawTimeline);
    updateTimeline();
  }
}

// Function to draw a custom-shaped indicator
function drawCustomIndicator(x) {
  const indicatorColor = '#4CAF50';
  const shadowColor = 'rgba(0, 0, 0, 0.3)';
  const shadowBlur = 5;

  // Draw shadow
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;

  // Draw indicator shape
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

  // Draw time at the bottom
  const currentTimeFormatted = formatTime(currentTimeInSeconds);
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText(currentTimeFormatted, x, 20 + indicatorHeight + 15);
}

// Function to draw a smaller marker
function drawMarker(timeInSeconds) {
  const markerX = (timeInSeconds / totalTime) * canvas.width;
  const markerY = 10; // Adjust the Y position above the graduation steps
  const markerColor = '#ea4335';

  ctx.fillStyle = markerColor;
  ctx.beginPath();
  ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
  ctx.fill();
}

// Function to draw ruler graduation steps
function drawGraduationSteps(interval, symbol, y, color, fontSize) {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
  for (let i = 0; i <= totalTime; i += interval) {
    const x = (i / totalTime) * canvas.width;
    ctx.fillText(symbol, x, y);
  }
}

// Function to draw larger vertical bars
function drawVerticalBars(interval, height, color) {
  ctx.fillStyle = color;
  ctx.font = '8px Arial';
  for (let i = 0; i <= totalTime; i += interval) {
    const x = (i / totalTime) * canvas.width;
    ctx.fillRect(x - 1, 12, 2, height);
  }
}

// Function to draw smaller graduation steps for minutes
function drawTimeLabels(interval, y) {
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  for (let i = 0; i <= totalTime; i += interval) {
    const x = (i / totalTime) * canvas.width;
    ctx.fillText(formatTime(i), x, y);
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
  }

  lastTimestamp = now;
}

// Function to format time in HH:mm:ss format
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

// Function to pad zeros
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

let lastTimestamp;

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
  animationSpeed = 0.5; // Change speed to slow forward (0.5 second per frame)
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
  canvas.width = window.innerWidth;
  drawTimeline();
});

// Mouse event listeners for dragging the timeline indicator
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseleave', handleMouseUp);

function handleMouseDown(event) {
  isDragging = true;
  dragStartX = event.clientX;
  wasPlayingBeforeDrag = isAnimating;
  if (wasPlayingBeforeDrag) {
    isAnimating = false;
  }
}

function handleMouseMove(event) {
  if (isDragging) {
    const offsetX = event.clientX - dragStartX;
    const offsetSeconds = (offsetX / canvas.width) * totalTime;
    currentTimeInSeconds += offsetSeconds;

    // Ensure the timeline indicator stays within the valid range
    if (currentTimeInSeconds < 0) {
      currentTimeInSeconds = 0;
    } else if (currentTimeInSeconds > totalTime) {
      currentTimeInSeconds = totalTime;
    }

    dragStartX = event.clientX;
    drawTimeline();
  }
}

function handleMouseUp() {
  isDragging = false;
  if (wasPlayingBeforeDrag) {
    isAnimating = true;
    lastTimestamp = new Date();
    requestAnimationFrame(drawTimeline);
  }
}

// Initial draw
lastTimestamp = new Date();
drawTimeline();