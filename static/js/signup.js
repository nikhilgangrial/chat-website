
function startTimer() {
  let presentTime = document.getElementById('timer').innerText;
  let timeArray = presentTime.split(/[:]+/);
  let m = timeArray[0];
  let s = checkSecond((timeArray[1] - 1));
  if (s===59) {
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

function verfiyemail(){
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@aitpune\.edu\.in$/;
    let email = document.getElementById('email');
    return !!email.value.match(mailformat);
}


function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec} // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"}
  return sec;
}

function matchpassword(){
    let match = document.getElementById("match");
    let pwd1 = document.getElementById("password1");
    let pwd2 = document.getElementById("password2");
    if (pwd1.value === pwd2.value){
        match.innerHTML = '<span style="color:green">Matched!</span>'
    }else{
        match.innerHTML = '<span style="color:red">Do not Match!</span>';
    }
}
function checkstrength() {
        let strength = document.getElementById('strength');
        let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        let mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        let enoughRegex = new RegExp("(?=.{8,}).*", "g");
        let pwd = document.getElementById("password1");
        if (false === enoughRegex.test(pwd.value)) {
            strength.innerHTML = 'Too Short';
        } else if (strongRegex.test(pwd.value)) {
            strength.innerHTML = '<span style="color:green">Strong!</span>';
        } else if (mediumRegex.test(pwd.value)) {
            strength.innerHTML = '<span style="color:orange">Medium!</span>';
        } else {
            strength.innerHTML = '<span style="color:red">Weak!</span>';
        }
    }

function firstcall(){
    if (verfiyemail() === false){
        alert("Enter a Valid Collage email");
        return ;
    }
    if (document.getElementById("strength").innerHTML !== '<span style="color:green">Strong!</span>'){
        alert("Set a Strong Password");
        return ;
    }
    if (document.getElementById('password1').value !== document.getElementById('password2').value){
        alert("Both Passwords do not Match");
        return ;
    }
    $.ajax({
        type:"POST",
        url: "/account/register/",
        data: {'email': document.getElementById('email').value,
                'otp': '',
        },
        success: function(response)
        {
            console.log(response)
            // diable all uper elements
            document.getElementById('username').disabled = true;
            document.getElementById('email').disabled = true;
            document.getElementById('password1').disabled = true;
            document.getElementById('password2').disabled = true;
            //unhide otp section
            document.getElementById("after otp").hidden = false;
            // change submit function
            document.getElementById('sub').setAttribute('onclick','secondcall()');
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
    console.log("called second");
    document.getElementById('username').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('password1').disabled = false;
    document.getElementById('password2').disabled = false;
    document.getElementById("main form").submit();
}
