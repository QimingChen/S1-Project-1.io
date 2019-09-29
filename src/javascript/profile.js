document.addEventListener("DOMContentLoaded", function(e) {
  e.preventDefault();

  // check user authorization status
  let tokenAvailable = checkTokenAvailable();
  console.log(`token availability: ${tokenAvailable}`);
  
  if (tokenAvailable) {
    document.getElementById("form-to-login").style.display = "none";
    document.getElementById("err-row").style.display = "none";
    document.getElementById("form-logined").style.display = "block"; // logged in, disable login form and enable username button
    document.getElementById("logined-username").innerText = localStorage.getItem("username"); // update username to user
  } else {
    document.getElementById("profile-form").style.display = "none";
    document.getElementById("form-logined").style.display = "none";
    document.getElementById("form-to-login").style.display = "block"; // not logged in, show the login form
    document.getElementById("err-row").style.display = "block"; // not logged in, show the error msg
    document.getElementById("err-msg").innerText = "Please Log In on "; // error msg
    return;
  }

  // load profile info and display
  getProfileOnLoaded();

  // Even listners
  document.getElementById("profile-edit-button").addEventListener("click", createOrUpdateProfileOnClick);
  document.getElementById("log-out").addEventListener("click", function(){
    logOut();
    window.location.reload();
  });
});

/**
 *  when loading the page, load profile from API
 */
async function getProfileOnLoaded() {
  await getProfile().then(profile => {
    console.log("profile from data: ");
    console.log(profile);
    //update html
    if (profile.user !== undefined) {
      // API response has profile
      console.log("profile received");
      document.getElementById("profile-username").innerText = profile.user.username;
      document.getElementById("profile-email").setAttribute("value", profile.additionalEmail);
      document.getElementById("profile-mobile").setAttribute("value", profile.mobile);
      document.getElementById("profile-address").setAttribute("value", profile.address);
      if (profile.additionalEmail.length > 0) {
        // if profile has been created, make some components immutable
        document.getElementById("profile-email").readOnly = true;
        document.getElementById("profile-email").style.backgroundColor = "grey";
        document.getElementById("profile-address").readOnly = true;
        document.getElementById("profile-address").style.backgroundColor = "grey";
      }
    } else {
      // API response didn't get user's profile
      console.log("profile not created yet");
      document.getElementById("profile-username").innerText = localStorage.getItem("username");
    }
  });
}

/**
 * create of update profile function, wrapping createProfileOnClick and updateProfileOnClick
 */
async function createOrUpdateProfileOnClick() {
  if (document.getElementById("profile-email").readOnly === true) {
    updateProfileOnClick();
  } else {
    createProfileOnClick();
  }

  await getProfileOnLoaded();
}

/**
 * update profile
 */
async function updateProfileOnClick() {
  let newMobile = document.getElementById("profile-mobile").value;
  console.log("updating mobile to: " + newMobile);
  await updateProfile(newMobile);
}

/**
 * create profile
 */
async function createProfileOnClick() {
  let newEmail = document.getElementById("profile-email").value;
  let newMobile = document.getElementById("profile-mobile").value;
  let newAddress = document.getElementById("profile-address").value;
  console.log(`creating profile: ${newEmail} -- ${newMobile} -- ${newAddress}`);
  await createProfile(newEmail, newMobile, newAddress);
}
