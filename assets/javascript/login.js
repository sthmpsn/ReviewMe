$(document).ready(function(){
    console.log ("login.js loading");
    // Global Variable
    var currentUser = "";


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCYNDdNan5xdqBhx4xl-cuy7HEohISWPHU",
        authDomain: "myreviews-test.firebaseapp.com",
        databaseURL: "https://myreviews-test.firebaseio.com",
        projectId: "myreviews-test",
        storageBucket: "myreviews-test.appspot.com",
        messagingSenderId: "194884044201"
    };
    firebase.initializeApp(config);

    var database = firebase.database();


    // Even Triggers
    $(document).on("click", "#submit", function(){
            event.preventDefault();  //Prevent the Submit button from acting like a Submit button and do the following
            console.log("Submit button was Clicked");
            var $fname = $("#name-first");
            var $lname = $("#name-last");
            var $username = $("#userName");
            console.log($fname);
            console.log($lname);
            console.log($username);

            if ($fname.val() !== "" && $lname.val() !== "" && $username.val() !== ""){

                // var usernameVal = $username.val();
                currentUser = $username.val().trim();
            
                // add an entry for the new user and set attributes to fname and lname
                database.ref("users/"+currentUser).set({
                        fname: $fname.val().trim(),
                        lname: $lname.val().trim()
                });


                // Set the username in Session Storage
                if(currentUser !== ""){
                    // sessionStorage.clear();
                    // sessionStorage.setItem("username", currentUser);
                    localStorage.clear();
                    localStorage.setItem("username", currentUser);
                }

                // Clear the input boxes
                $fname.val("");
                $lname.val("");
                $username.val("");

                // Navigate to the main content page             
                window.location.href = 'content.html';
            }
            else{
                $("#myModal").show();

            }

            



            
        });


        





});