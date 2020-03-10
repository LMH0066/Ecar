let togglePassword = document.getElementById("toggle-password");
let formContent = document.getElementsByClassName('form-content')[0];
let getFormContentHeight = formContent.clientHeight;

let formImage = document.getElementsByClassName('form-image')[0];
if (formImage) {
	let setFormImageHeight = formImage.style.height = getFormContentHeight + 'px';
}
if (togglePassword) {
	togglePassword.addEventListener('click', function() {
	  let x = document.getElementById("password");
	  if (x.type === "password") {
	    x.type = "text";
	  } else {
	    x.type = "password";
	  }
	});
}