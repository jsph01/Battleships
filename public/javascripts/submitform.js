function checkLoginForm(){
    let valid = true;

    if(document.getElementById('username').value.length == 0){
        document.getElementById('usernameErr').innerHTML = "invalid username";
        valid = false;
    } else {
        document.getElementById('usernameErr').innerHTML = '';
    }

    if(document.getElementById('password').value.length < 6){
        document.getElementById('passwordErr').innerHTML = "invalid password"
        valid = false;
    } else {
        document.getElementById('passwordErr').innerHTML = '';
    }

    return valid;
}

function checkRegisterForm(){
    let birthMonth = document.getElementById('birthMonth');
    let birthDay = document.getElementById('birthDay');
    let birthYear = document.getElementById('birthYear');
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let confirm = document.getElementById('confirm');

    var today = new Date();
    var d = today.getDate();
    var m = today.getMonth()+1;
    var y = today.getFullYear();

    let day = parseInt(birthDay.value);
    let month = parseInt(birthMonth.value);
    let year = parseInt(birthYear.value);

    let valid = true;

    if(!(year > 1900 && year < y && // year is in valid range
            month > 0 && month <= 12 && // month is in valid range
            day > 0 && day <= getDaysInMonth(month, year))) // day is in valid range
    {
        document.getElementById('dateErr').innerHTML = "invalid date of birth";
        valid = false;
    } else {
        document.getElementById('dateErr').innerHTML = "";
    }
    
    if(username.value.length == 0) {
        document.getElementById('usernameErr').innerHTML = "invalid username";
        valid = false;
    } else {
        document.getElementById('usernameErr').innerHTML = "";
    }

    if(password.value.length < 6){
        document.getElementById('passwordErr').innerHTML = "invalid password";
        valid = false;
    } else {
        document.getElementById('passwordErr').innerHTML = "";
    }

    if(password.value != confirm.value){
        document.getElementById('confirmErr').innerHTML = "no match";
        valid = false;
    } else {
        document.getElementById('confirmErr').innerHTML = "";
    }

    return valid;
}

function getDaysInMonth(month, year) {
    switch(month){
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 2:
            return isLeapYear(year) ? 29 : 28;
        default:
            return null;
    }
}

function isLeapYear(year) {
    if(year%4 === 0 && (year%100 !== 0 || year%400 === 0))
        return true;
    return false;
}