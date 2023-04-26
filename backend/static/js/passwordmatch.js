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

function submit_form(){
    if (!(document.getElementById("strength").innerHTML === '<span style="color:green">Strong!</span>' ||
        document.getElementById("strength").innerHTML === '<span style="color:orange">Medium!</span>')){
        alert("Set a Strong Password");
        return ;
    }
    if (document.getElementById('password1').value !== document.getElementById('password2').value){
        alert("Both Passwords do not Match");
        return ;
    }
    document.getElementById("main_form").submit();
}