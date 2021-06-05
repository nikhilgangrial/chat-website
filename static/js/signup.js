
function startTimer() {
  let presentTime = document.getElementById('timer').innerText;
  let timeArray = presentTime.split(/[:]+/);
  let m = timeArray[0];
  let s = checkSecond((timeArray[1] - 1));
  if (s==59) {
      m=m-1;
  }
  if(m<0){
      document.getElementById("resend").disabled = false;
      document.getElementById("timer").hidden = true;
      return
  }

  document.getElementById('timer').innerText =
    m + ":" + s;
  setTimeout(startTimer, 1000);
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}

function firstcall(){
    $.ajax({
        type:"POST",
        url: "/account/register/",
        data: {'email': document.getElementById('email').value,
                'otp': '',
        },
        success: function(response)
        {
            // diable all uper elements
            document.getElementById('username').disabled = true;
            document.getElementById('email').disabled = true;
            document.getElementById('password1').disabled = true;
            document.getElementById('username').disabled = true;
            //unhide otp section
            document.getElementById("after otp").hidden = false;
            // change submit function
            document.getElementById('submit').setAttribute('onclick','secondcall()');
            //start timer
            document.getElementById('timer').innerText = "00:20";
            startTimer();
        },
        error: function (response){
            console.log(response);
            alert("Enter a valid collage id.");
        }
    })
}

function secondcall(){
    document.getElementById("main_form").submit();
}