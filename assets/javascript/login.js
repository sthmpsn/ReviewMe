$(document).ready(function(){
    console.log ("Page loading");

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
            console.log("Add User was Clicked");
            var $fname = $("#name-first");
            var $lname = $("#name-last");
            var $username = $("#userName");
            console.log($fname);
            console.log($lname);
            console.log($username);
     
            var usernameVal = $username.val();
           
            // add an entry for the new user and set attributes to fname and lname
            database.ref("users/"+usernameVal).set({
                    fname: $fname.val(),
                    lname: $lname.val()
            });


            // Clear the input boxes
                $fname.val("");
                $lname.val("");
                $username.val("");
    
            window.location.href = 'content.html';
        });








});