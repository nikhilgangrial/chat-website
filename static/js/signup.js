
function startTimer() {
  let presentTime = document.getElementById('resend').value;
  let timeArray = presentTime.split(/[:]+/);
  let m = timeArray[0];
  let s = checkSecond((timeArray[1] - 1));
  if (s==59) {
      m=m-1;
  }
  if(m<0){
      document.getElementById("resend").disabled = false;
      document.getElementById("resend").value = 'Resend Otp';
      document.getElementById("resend").setAttribute('class', "btn btn-primary btn-block")
      return
  }

  document.getElementById('resend').value = m + ":" + s;
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
    //check if password is strong
    if (!(document.getElementById("strength").innerHTML === '<span style="color:green">Strong!</span>' || document.getElementById("strength").innerHTML === '<span style="color:orange">Medium!</span>')){
        alert("Set a Strong Password");
        return ;
    }
    //check if passwords match
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
            let email = response;
            console.log(email);
            document.getElementById("afte opt message").innerHTML = "An otp have been sent to <a href='mailto:" + email + "'>"+ email + "</a> which is valid for 2 minutes.<br></a>";
            // hide all uper elements
            document.getElementById("before otp").hidden = true;
            //unhide otp section
            document.getElementById("after otp").hidden = false;
            document.getElementById("resend").disabled = true;
            document.getElementById("resend").setAttribute('class', "btn btn-secondary btn-block")
            document.getElementById('resend').value = "0:20";
            // change submit function
            document.getElementById('sub').setAttribute('onclick','secondcall()');
            //start timer
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
    document.getElementById("main form").submit();
}
