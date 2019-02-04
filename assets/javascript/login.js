$(document).ready(function(){
    console.log ("login.js loading");
    // Global Variable
    var storedUserAvatar = "";

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
        var $fnameBox = $("#name-first");
        var $lnameBox = $("#name-last");
        var $usernameBox = $("#userName");
        var fname = $fnameBox.val().trim();
        var lname = $lnameBox.val().trim();
        var currentUser = $usernameBox.val().trim();
            



        if (fname !== "" && lname !== "" && currentUser !== ""){

            function pushUserToDB(){
                // Assign a random static Chuck Norris image URL from Giphy 
                var apiKey = "AnVFzv8FXQHu7I3N2iftwX1X5a4cNrCM";
                var topic = "chuck-norris";
                var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +topic+ "&limit=20&api_key=" +apiKey;
                
                // add an entry for the new user and set attributes to fname and lname
                database.ref("users/"+currentUser).set({
                    fname: fname,
                    lname: lname,
                });

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response){
                    console.log("QueryString: "+queryURL);
                    var results = response.data;    // the array of search results 
                    var randImg = Math.floor(Math.random() * (results.length -1));
                    console.log ("RandNum: "+randImg);
                    var randAvatarImg = results[randImg].images.original_still.url;
                    console.log ("Avatar Chosen URL: "+randAvatarImg);    

                    database.ref("users/"+currentUser).update({
                        avatar: randAvatarImg
                    });
                });
                // End Giphy image assignment
            
                // Set the username in Session Storage
                if(currentUser !== ""){
                    localStorage.clear();
                    localStorage.setItem("username", currentUser);
                }

                // Clear the input boxes
                $fnameBox.val().trim();
                $lnameBox.val().trim();
                $usernameBox = ("");
            }

        // Navigate to the main content page
            function navToApp(){
                setTimeout ( function(){
                window.location.href = 'content.html';
                }, 500);
            }

            pushUserToDB();
            navToApp();

        }
        else{
            $("#loginModal").show();
        }
        
    });

    // loginModal close button closure action
    $(document).on("click", "#loginModalClose", function(){
        $("#loginModal").hide();
    });


    // For Header image load
    var storedUser = localStorage.getItem("username");

    database.ref(`users/${storedUser}`).on("value", function(snapshot) {
        storedUserAvatar = snapshot.val().avatar;
        console.log("Stored user Avatar Retrieved: "+storedUserAvatar);
        $("#imgAvatar").attr("src", storedUserAvatar);
    });

    // Magnafic image avatar display
    // turn Avatar into a hyperlink and display full image
    $(document).on("click", "#imgAvatar", function(){
        $("#imgAvatar").magnificPopup({
            items:{
                src: storedUserAvatar
            },
            type: 'image'
        });
    });

});