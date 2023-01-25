const theFormContainer = document.querySelector('.modal');
const theForm = document.querySelector('form');

var userType = 'undeclared';

/*Prototype database*/
var accountinfodatabase = [
    {'eid': 'athosatri2', 'password': '12345', 'type': 'admin'},
    {'eid': 'ccha23', 'password': '67890', 'type': 'admin'},
    {'eid': 'chaozhao6', 'password': '112233', 'type': 'admin'},
    {'eid': 'jyoshi45', 'password': '0000', 'type': 'student'}
]

function showloginform() {
    theFormContainer.style.display = "block";
}

function closeloginform() {
    theFormContainer.style.display = "none";
}

document.querySelector(".loginbtn").addEventListener('click', function () {
    let exist = false;
    let theEID = document.getElementById('ElectronicID').value;
    let thePsw = document.getElementById('password').value;
    
    for (i=0; i<accountinfodatabase.length; i++) {
        if (accountinfodatabase[i].eid == theEID && accountinfodatabase[i].password == thePsw) {
            userType = accountinfodatabase[i].type;
            exist = true;
            confirm(userType);
            theForm.submit();
            break;
        }
    }

    if (!exist) {
        theForm.reset();
        alert('Wrong username or password, please try again');
    }
})