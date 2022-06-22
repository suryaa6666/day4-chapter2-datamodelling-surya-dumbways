const submitData = (event) => {
    event.preventDefault();
    
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let phone = document.getElementById("phone").value;
    let subject = document.getElementById("subject").value;

    let a = document.createElement("a");

    a.href = `mailto:${email}?subject=${subject}&body=Hello my name is ${name}, number phone : ${phone}, message : ${message}`;

    // Validasi 
    if (name == '') {
        return alert('Name cannot be empty!');
    } else if (email == '') {
        return alert('Email cannot be empty!');
    } else if (phone == '') {
        return alert('Phone number cannot be empty!');
    } else if (subject == '') {
        return alert('Subject cannot be empty!');
    } else if (message == '') {
        return alert('Message cannot be empty!');
    } else {
        a.click();
    }
}