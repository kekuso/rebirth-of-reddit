var httpRequest;

if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE 6 and older
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
}

httpRequest.open('GET', 'https://www.reddit.com/r/cigars.json', true);

httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var response = JSON.parse(httpRequest.responseText);
        display(response);
      } else {
        throw new Error('There was a problem with the request.');
      }
    }
};

httpRequest.send(null);

/**
  * Displays the reddit data in custom view.
  * @param response The parsed httpRequest responseText
  * @returns null
  */
function display(response) {
  var mainPage = document.getElementById("mainPage");
  var data;
  var heading;
  var thread;
  var postX;
  var titleX;
  var authorX;
  var scorex;
  var commentsX;
  var dateCreatedX;
  var showMoreX;
  var postDivX;

  var scoreImage;
  var commentLink;
  var numComments;
  var dateCreated;
  var thumbnailX;

  for(var i = 0; i < response.data.children.length; i++) {
    data = response.data.children[i].data;
    heading = document.createElement("div");
    thread = document.createElement("div");
    titleX = document.createElement("h1");
    authorX = document.createElement("h4");
    postX = document.createElement("div");
    scoreImage = document.createElement("img");
    scoreX = document.createElement("div");
    commentsX = document.createElement("div");
    dateCreatedX = document.createElement("div");
    showMoreX = document.createElement("button");
    postDivX = document.createElement("div");
    space = document.createElement("div");
    if(data.secure_media) {
      if(data.secure_media.oembed) {
        if(data.secure_media.oembed.thumbnail_url) {
          thumbnailX = document.createElement("div");
          thumbnailX.innerHTML = '<img src ="' + data.secure_media.oembed.thumbnail_url + '">';
        }
      }
    }

    space.innerHTML = "<br><br>";
    heading.className = "heading";
    heading.innerHTML = "/r/" + data.subreddit;
    thread.className = "thread";
    postDivX.className = "post";
    postDivX.id = "post" + i;
    scoreImage.src = "cigarImage.jpg";
    scoreImage.height = "25";
    scoreImage.width = "25";
    scoreX.className = "score";
    commentsX.className = "comments";
    commentLink = data.url;
    numComments = data.num_comments;
    dateCreated = getDate(data.created_utc);
    showMoreX.innerHTML = "show more";
    showMoreX.className = "btnShowMore";

    titleX.innerHTML = '<a href="' + commentLink + '">' + data.title + '</a>';
    authorX.innerHTML = "Author: <a href = 'https://www.reddit.com/user/" + data.author + "'>" + data.author + "</a>";
    postX.innerHTML = data.selftext;
    scoreX.innerHTML = 'score: ' +
                        '<img src = "cigar.png" ' +
                        'height = "25" width = "25">' +
                        'x' +
                        data.score;
    commentsX.innerHTML = '<a href = "' + commentLink + '">' + numComments + ' comments</a>';
    dateCreatedX.innerHTML = "created: " + dateCreated;
    postDivX.innerHTML = marked(data.selftext);

    showMoreX.onclick = togglePost;

    mainPage.appendChild(heading);
    mainPage.appendChild(space);
    mainPage.appendChild(thread);
    thread.appendChild(titleX);
    if(data.secure_media) {
      if(data.secure_media.oembed) {
        if(data.secure_media.oembed.thumbnail_url) {
          thread.appendChild(thumbnailX);
        }
      }
    }
    thread.appendChild(authorX);
    thread.appendChild(dateCreatedX);
    thread.appendChild(scoreX);
    thread.appendChild(showMoreX);
    thread.appendChild(postDivX);
    postDivX.appendChild(commentsX);
  }
}

/**
  * Converts the timestamp to simplified Date format
  * @param timestamp the Date in Unix timestamp form
  * @returns time the formatted Date and time
  */
function getDate(timestamp) {
  var date = new Date(timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = date.getFullYear();
  var month = months[date.getMonth()];
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var time;

  if(min < 10) {
    min = '0' + min.toString();
  }
  if(hour > 12) {
    if(hour < 13) {
      hour = 12;
    }
    else {
      hour = hour - 12;
    }
    time = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + 'PM (HST)';
  }
  else {
    time = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + 'AM (HST)';
  }
  return time;
}

/**
  * Toggles posts on/off
  */
function togglePost() {
  var posts = document.getElementsByClassName("post");
  for(var i = 0; i < posts.length; i++) {
    if(posts[i].style.display == 'block') {
    console.log("removing display");
    posts[i].style.display = 'none';
    }
    else {
      console.log("assigning block style.");
      posts[i].style.display = 'block';
    }
  }
  toggleText();
}

/**
  * Toggles button to 'show more' or 'show less'
  */
function toggleText() {
  var btns = document.getElementsByClassName("btnShowMore");
  for(var i = 0; i < btns.length; i++) {
    if(btns[i].textContent === "show more") {
    btns[i].textContent = "show less";
    }
    else {
      btns[i].textContent = "show more";
    }
  }

}