let node = document.getElementById("node");
let angular = document.getElementById("angular");
let react = document.getElementById("react");
let android = document.getElementById("android");

let hiddentech = document.getElementById("hidden-tech").value;
let tech = hiddentech;

if (tech.includes("node")) {
    node.checked = true;
}

if (tech.includes("react")) {
    react.checked = true;
}

if (tech.includes("angular")) {
    angular.checked = true;
}

if (tech.includes("android")) {
    android.checked = true;
}