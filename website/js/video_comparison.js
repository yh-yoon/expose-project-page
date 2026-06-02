// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var position = 0.5;
    // Use canvas dimensions instead of video dimensions
    var vidWidth = videoMerge.width;
    var vidHeight = videoMerge.height;

    var mergeContext = videoMerge.getContext("2d");

    if (vid.readyState > 3) {
        vid.play();

        function trackLocation(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
        }
        function trackLocationTouch(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        }

        videoMerge.addEventListener("mousemove",  trackLocation, false);
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove",  trackLocationTouch, false);


        function drawLoop() {
            // The source video is side-by-side: left half is baseline, right half is ours
            // Draw left side (baseline method) - takes from left half of source video
            mergeContext.drawImage(vid, 
                0, 0, vid.videoWidth/2, vid.videoHeight,  // source: left half of video
                0, 0, vidWidth, vidHeight);                // destination: full canvas
            
            // Calculate overlay position
            var colStart = (vidWidth * position).clamp(0.0, vidWidth);
            var colWidth = (vidWidth - (vidWidth * position)).clamp(0.0, vidWidth);
            
            // Draw right side (ours) overlaid on left - takes from right half of source video
            var sourceColStart = (vid.videoWidth/2) * position;
            var sourceColWidth = (vid.videoWidth/2) - sourceColStart;
            mergeContext.drawImage(vid,
                vid.videoWidth/2 + sourceColStart, 0, sourceColWidth, vid.videoHeight,  // source: portion of right half
                colStart, 0, colWidth, vidHeight);                                       // destination: overlay portion
            requestAnimationFrame(drawLoop);

            var arrowLength = 0.09 * vidHeight;
            var arrowheadWidth = 0.025 * vidHeight;
            var arrowheadLength = 0.04 * vidHeight;
            var arrowPosY = vidHeight / 2;
            var arrowWidth = 0.007 * vidHeight;
            var currX = vidWidth * position;

            // Draw circle
            mergeContext.arc(currX, arrowPosY, arrowLength*0.7, 0, Math.PI * 2, false);
            mergeContext.fillStyle = "#FFD79340";
            mergeContext.fill()
            //mergeContext.strokeStyle = "#444444";
            //mergeContext.stroke()

            // Draw border
            mergeContext.beginPath();
            mergeContext.moveTo(vidWidth*position, 0);
            mergeContext.lineTo(vidWidth*position, vidHeight);
            mergeContext.closePath()
            mergeContext.strokeStyle = "#444444";
            mergeContext.lineWidth = 5;
            mergeContext.stroke();

            // Draw arrow
            mergeContext.beginPath();
            mergeContext.moveTo(currX, arrowPosY - arrowWidth/2);

            // Move right until meeting arrow head
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowWidth/2);

            // Draw right arrow head
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowheadWidth/2);
            mergeContext.lineTo(currX + arrowLength/2, arrowPosY);
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowheadWidth/2);
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowWidth/2);

            // Go back to the left until meeting left arrow head
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowWidth/2);

            // Draw left arrow head
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowheadWidth/2);
            mergeContext.lineTo(currX - arrowLength/2, arrowPosY);
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY  - arrowheadWidth/2);
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY);

            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY - arrowWidth/2);
            mergeContext.lineTo(currX, arrowPosY - arrowWidth/2);

            mergeContext.closePath();

            mergeContext.fillStyle = "#444444";
            mergeContext.fill();
        }
        requestAnimationFrame(drawLoop);
    }
}


Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};


function resizeAndPlay(element)
{
  var cv = document.getElementById(element.id + "Merge");
  const container = element.closest('.video-compare-container');
  
  // Get the container's maximum width (800px from CSS or window width)
  const maxWidth = Math.min(container.offsetWidth, 800);
  
  // Calculate the scaled dimensions to fit within container
  const videoWidth = element.videoWidth / 2;
  const videoHeight = element.videoHeight;
  const aspectRatio = videoHeight / videoWidth;
  
  // Scale down if video is too wide
  let displayWidth = videoWidth;
  let displayHeight = videoHeight;
  
  if (displayWidth > maxWidth) {
    displayWidth = maxWidth;
    displayHeight = displayWidth * aspectRatio;
  }
  
  cv.width = displayWidth;
  cv.height = displayHeight;
  element.play();
  element.style.height = "0px";  // Hide video without stopping it

  playVids(element.id);
}
