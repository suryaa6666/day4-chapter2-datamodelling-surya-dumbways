let technologies = [];

let node = document.getElementById("node");
let angular = document.getElementById("angular");
let react = document.getElementById("react");
let android = document.getElementById("android");

if (node.checked) {
    technologies.push(node.value);
}

if (angular.checked) {
    technologies.push(angular.value);
}

if (react.checked) {
    technologies.push(react.value);
}

if (android.checked) {
    technologies.push(android.value);
}

const submitData = (event) => {
    let name = document.getElementById("name").value;
    let startdate = document.getElementById("startdate").value;
    let enddate = document.getElementById("enddate").value;
    let description = document.getElementById("description").value;
    let imageupload = document.getElementById("imageupload").files;

    if (name == '') {
        alert('Please insert a project name!');
        event.preventDefault();
        return;
    } else if (startdate == '') {
        alert('Please insert a start date!');
        event.preventDefault();
        return;
    } else if (enddate == '') {
        alert('Please insert an end date!');
        event.preventDefault();
        return;
    } else if (Date.parse(startdate) > Date.parse(enddate)) {
        alert('Start date cannot be after end date!');
        event.preventDefault();
        return;
    } else if (description == '') {
        alert('Please insert a description!');
        event.preventDefault();
        return;
    } else if (technologies.length == 0) {
        alert('Please insert at least one technology!');
        event.preventDefault();
        return;
    } else if (imageupload.length == 0) {
        alert('Please insert an image!');
        event.preventDefault();
        return;
    }
}
function checkboxCheck() {

    technologies = [];

    if (node.checked) {
        technologies.push(node.value);
    }

    if (angular.checked) {
        technologies.push(angular.value);
    }

    if (react.checked) {
        technologies.push(react.value);
    }

    if (android.checked) {
        technologies.push(android.value);
    }
}