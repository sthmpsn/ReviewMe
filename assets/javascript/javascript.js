$(document).ready(function () {
    // BEGIN STAR RATING RELATED - can remove this eventually
    $(document).on("click", ".star-ratings > .fa-star", function () {
        // Clear any existing stars that were previously colored since a rating change is desired
        $(".star-ratings > .fa-star").removeClass("checked");

        // Get the Clicked Object
        starNum = $(this)
        console.log("Star Object: " + starNum);
        // Get the start rating (1,2,3,4 or 5)
        var starRating = starNum.attr("rating")
        console.log("RATING: " + starRating);
        // For loop counting down to 1 that runs starting from the star-num clicked
        for (var i = starRating; i > 0; i--) {
            $('#rating' + i).addClass("checked");
            console.log("Color Filled Star " + i + " with gold")
        }
    });

    // END STAR RATING RELATED

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCYMFkr7RuA6LabcsxJulA93r57UpIHFMw",
        authDomain: "exceptional-pirates.firebaseapp.com",
        databaseURL: "https://exceptional-pirates.firebaseio.com",
        projectId: "exceptional-pirates",
        storageBucket: "exceptional-pirates.appspot.com",
        messagingSenderId: "756087661991"
    };

    firebase.initializeApp(config);

    //create variables - how many of these do we need?
    var database = firebase.database();
    var username;
    var review_rating;
    var avatar;
    var review;
    var myPreferences = "";
    var place;
    // For Header image load
    var storedUser = localStorage.getItem("username");
    // loading the Avatar
    var storedUserAvatar;
    // For deciding whether to save to database on "Close" of review or closing out of view the details of existin review item 
    // localStorage.setItem("newReview", false);
    var newReview = localStorage.getItem("newReview");
    console.log("NEW REVIEW???: "+newReview);

    $("#currentUser").html("not " +storedUser+ " ?");
    
    if (newReview === "true"){
        console.log("REACHED HERE")
        $("#review-bttnSave span").html("Save");
    }




    //display-page, category button-clicks
    $("#cat-restaurants").on("click", function () {
        //set local storage of newReview to false so it doesn't try to write to db when just viewing an existing review
        localStorage.removeItem("newReview");
        localStorage.setItem("newReview", false);
        console.log("New Cat Review???: "+newReview);
        database.ref(`users/${storedUser}`).once("value", childSnapshot => {
            console.log("Restaurant Snapshot Info: "+childSnapshot.val());
            if (childSnapshot.val().reviews !== undefined) {
                $("#review-content").empty();
                myPreferences = childSnapshot.val().reviews;
                for (key in myPreferences) {
                    console.log("Restaurant Preferences: "+myPreferences[key].class)
                    if (myPreferences[key].class == "Restaurant") {
                        $("#review-content").append(`
                <div id="${myPreferences[key].name}" class="review-summaries mx-md-3 my-md-3">

                        <h5>${myPreferences[key].name}</h5>

                        <h5>${myPreferences[key].rating}</h5>
                    </div>
                        `)
                    }
                }
                console.log("it exists");
            }
            else {
                console.log("does not");
            }
        });
    });

    //display-page, category button-clicks
    $("#cat-beer").on("click", function () {
        //set local storage of newReview to false so it doesn't try to write to db when just viewing an existing review
        localStorage.removeItem("newReview");
        localStorage.setItem("newReview", false);
        console.log("New Beer Review???: "+newReview);
        database.ref(`users/${storedUser}`).once("value", childSnapshot => {
            console.log("Beer Snapshot Info: "+childSnapshot.val());
            if (childSnapshot.val().reviews !== undefined) {
                $("#review-content").empty();
                myPreferences = childSnapshot.val().reviews;
                for (key in myPreferences) {
                    console.log("Beer Preferences: "+myPreferences[key].class)
                    if (myPreferences[key].class == "Beer") {
                        $("#review-content").append(`
                <div id="${myPreferences[key].name}" class="review-summaries mx-md-3 my-md-3">

                        <h5>${myPreferences[key].name}</h5>

                        <h5>${myPreferences[key].rating}</h5>
                    </div>
                        `)
                    }
                }
                console.log("it exists");
            }
            else {
                console.log("does not");
            }
        });
    });




    //image api call
    function changeTargetSrc(searchKey, type) {
        var queryUrl =
            `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1c7f330fcebe7bd701c8c8fe9de59c12&text=${searchKey}+${type}&sort=relevance&format=json&nojsoncallback=1`
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response.photos.photo[0]);
            var photoId = response.photos.photo[0].id;
            var photoSecret = response.photos.photo[0].secret;
            var photoServer = response.photos.photo[0].server;
            var photoFarm = response.photos.photo[0].farm;
            var myImageUrl = `https://farm${photoFarm}.staticflickr.com/${photoServer}/${photoId}_${photoSecret}.jpg`
            $(`#review-img`).attr("src", myImageUrl);
        });
    }


    //create new review form
    $("#bttn-createReview").on("click", function () {
        // Set the "newReview" attribute in Session Storage to true
        localStorage.removeItem("newReview");
        localStorage.setItem("newReview", true);
        // navigate to the content-form
        window.location.href = 'content-form.html';
    });

    //creating new review
    $(document).on("click", "#review-bttnSave", function () {
        var reviewCategory = $("#review-categories-select").val();
        var reviewName = $("#reviewName").val();
        var reviewComments = $("#reviewComments").val();
        var reviewRating = $("#reviewRating").val();

        // pull the latest status of the newReview local storage value
        newReview = localStorage.getItem("newReview");
        console.log("New Review?: "+newReview);

        if (newReview === "true"){
            //review object
            console.log("New Review Initiated");
            var reviewObject = {
                name: reviewName,
                class: reviewCategory,
                comments: reviewComments,
                rating: reviewRating
            };

            console.log("Review Object: "+reviewObject);
            var increment;

            //creating and using increment for unique review Id
            database.ref(`users/${storedUser}`).on("value", function (snapshot) {
                increment = snapshot.val().reviewCount;
                increment++;
            });

            database.ref(`/users/${storedUser}`).update({
                reviewCount: increment
            });

            //add our review object to the database under current user
            database.ref(`/users/${storedUser}/reviews/review${increment}`).update(reviewObject);

            

        }
        navToApp2();


    });
    

    function navToApp2() {
        setTimeout(function () {
            window.location.href = 'content-reviews.html';
        }, 250);
    }

    //display-preference on-click using dynamic js
    $(document).on("click", ".review-summaries", function () {
        var myId = $(this).attr("id");
        for (key in myPreferences) {
            if (myPreferences[key].name == myId) {
                $("#first").on("click", function () {
                    $("iframe").attr("src", "https://www.google.com/maps/embed/v1/search?q=mcdonalds&key=AIzaSyDz_LZnOTM0GcmyL6VQ7DsDfZmZ-Pi3LcA")
                });
                $("#review-content").empty();
                $("#review-content").append(`<div id="row-form" class="row">
<div id="col-form" class="col p-0 px-md-5 py-md-5">
    <div class="card">
        <div class="card-header text-white h5">
            Review Details
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-5 col-form-left p-0">
                    <div class="form-group m-0">
                        <img id="review-img" alt="Review Item Name">
                    </div>
                    <div class="form-group m-0">
                        <div>${myPreferences[key].name}</div>
                    </div>
                </div>
                <div class="col-7 p-0 pr-3">
                    <div class="form-group">
                        <div id="review-Category">
                            <label for="reviewCategory" class="font-weight-bold mr-3">Category</label>
                            <div>${myPreferences[key].class}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div id="review-comments">
                            <label for="reviewComments" class="font-weight-bold">Comments</label>
                            <div>${myPreferences[key].comments}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group mt-3">
                <div id="review-map" class="col-12 col p-0 border">
                    <iframe width="100%" height="100%" frameborder="0" style="border:0" src='https://www.google.com/maps/embed/v1/search?q=${myPreferences[key].name}&key=AIzaSyDz_LZnOTM0GcmyL6VQ7DsDfZmZ-Pi3LcA' allowfullscreen></iframe>
                </div>
            </div>
            <button id="review-bttnSave" class="btn mt-3 px-3 float-right text-white"><span class="h6">Close</span></button>
        </div>
    </div>
</div>
</div>`);
                //use api image
                changeTargetSrc(myPreferences[key].name, myPreferences[key].class);
            }
        }
    });
    // Steve Code
    // Global Variable
    var currentUser;

    // Even Triggers
    $(document).on("click", "#submit", function () {
        event.preventDefault();  //Prevent the Submit button from acting like a Submit button and do the following
        var $fnameBox = $("#name-first");
        var $lnameBox = $("#name-last");
        var $usernameBox = $("#userName");
        var fname = $fnameBox.val().trim();
        var lname = $lnameBox.val().trim();
        currentUser = $usernameBox.val().trim();
        console.log("Stored Username: "+storedUser);

        if (fname !== "" && lname !== "" && currentUser !== "") {
            pushUserToDB();
            navToApp();
        }
    else {
        $("#loginModal").show();
    }

        // START FUNCTION TO PUSH USER TO DB
        function pushUserToDB() {
            database.ref("users/"+currentUser).once("value", function(snapshot){
                if (snapshot.exists()){
                console.log("exists!" + currentUser);
                // navToApp();
                }
                else{
                    // add an entry for the new user and set attributes to fname and lname
                    database.ref("users/" + currentUser).set({
                        fname: fname,
                        lname: lname,
                        reviewCount: 1
                    });
                }

                // Set the username in Session Storage
                if (currentUser !== "") {
                    localStorage.clear();
                    localStorage.setItem("username", currentUser);
                }

                setAvatar();
                navToApp();
            });
        }
        // END FUNCTION TO PUSH USER TO DB

        function setAvatar(){
            // Assign a random static Chuck Norris image URL from Giphy 
            var apiKey = "AnVFzv8FXQHu7I3N2iftwX1X5a4cNrCM";
            var topic = "chuck-norris";
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&limit=20&api_key=" + apiKey;

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log("QueryString: " + queryURL);
                var results = response.data;    // the array of search results 
                var randImg = Math.floor(Math.random() * (results.length - 1));
                console.log("RandNum: " + randImg);
                var randAvatarImg = results[randImg].images.original_still.url;
                console.log("Avatar Chosen URL: " + randAvatarImg);

                database.ref("users/" + currentUser).update({
                    avatar: randAvatarImg
                });

                

            });
        }
        // End Giphy image assignment
    });
    //END ON CLICK SUBMIT

   
            


    // Navigate to the main content page
    function navToApp() {
        setTimeout(function () {
            window.location.href = 'content.html';
        }, 500);
    }


    // loginModal close button closure action
    $(document).on("click", "#loginModalClose", function () {
        $("#loginModal").hide();
    });

    console.log("Stored User: "+storedUser);

    

    // display Stored Avatar
    database.ref("users/"+storedUser).on("value", function (snapshot) {
        storedUserAvatar = snapshot.val().avatar;
        console.log("Stored user Avatar Retrieved: " + storedUserAvatar);
        $("#imgAvatar").attr("src", storedUserAvatar);
    });

    // Magnafic image avatar display
    // turn Avatar into a hyperlink and display full image
    $(document).on("click", "#imgAvatar", function () {
        $("#imgAvatar").magnificPopup({
            items: {
                src: storedUserAvatar
            },
            type: 'image'
        });
    });






});