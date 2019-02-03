$(document).ready(function () {

    // BEGIN STAR RATING RELATED
    $(document).on("click", ".star-ratings > .fa-star", function () {
        // Clear any existing stars that were previously colored since a rating change is desired
        $(".star-ratings > .fa-star").removeClass("checked");
        // Get the Clicked Object
        var starNum = $(this)
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

    var database = firebase.database();
    var username;
    var review_rating;
    var avatar;
    var review;
    var myPreferences = "";
    var place;
    var users = {
        person1: {
            name: "Jim",
            reviews: {
                review1: {
                    name: "Bush Lght",
                    class: "beer",
                    rating: "4.0"
                }
            }
        },
        person2: {
            name: "Joe",
            reviews: {
                review1: {
                    name: "Bud Light",
                    class: "beer",
                    rating: "4.0"
                },
                review2: {
                    name: "Arby's",
                    class: "restaurants",
                    rating: "5.0"
                },
                review3: {
                    name: "Wendy's",
                    class: "restaurants",
                    rating: "3.0"
                }
            }
        }
    }

    //display-page, category button-clicks
    $("#cat-restaurants").on("click", function () {
        $("#review-content").empty();
        database.ref().on("child_added", function (childSnapshot) {
            myPreferences = childSnapshot.val().Jim.reviews;
            for (key in myPreferences) {
                //console.log(myPreferences[key].class)
                if (myPreferences[key].class == "restaurants") {
                    $("#review-content").append(`
                <div id="${myPreferences[key].name}" class="review-summaries mx-md-3 my-md-3">
                        
                        <h5>${myPreferences[key].name}</h5>
                        
                        <h5>${myPreferences[key].rating}</h5>
                    </div>
                    `);
                }
            }
        });
    });
    $("#cat-beer").on("click", function () {
        $("#review-content").empty();
        database.ref().on("child_added", function (childSnapshot) {
            myPreferences = childSnapshot.val().Jim.reviews;
            for (key in myPreferences) {
                if (myPreferences[key].class == "beer") {
                    $("#review-content").append(`
                <div id="${myPreferences[key].name}" class="review-summaries mx-md-3 my-md-3">
                        <h5>${myPreferences[key].name}</h5>
                        <h5>${myPreferences[key].rating}</h5>
                    </div>
                    `);
                }
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
    //js for new-preference form
    var currentUser = "Todd"
    var referenceVar = 1;

    

    //create new review form
    $("#bttn-createReview").on("click", function(){
        window.location.href = 'content-form.html';
    })

    $(document).on("click", "#review-bttnSave", function () {
        var reviewCategory = $("#review-categories-select").val();
        var reviewName = $("#review-name").val();
        var reviewRating = $("#review-name").val();
        var reviewComments = $("#reviewComments").val();

        var reviewObject = {
            name: reviewName,
            class: reviewCategory,
            comments: reviewComments,
            rating: 4.0
        }
        console.log(reviewObject);
        database.ref(`/Users/${currentUser}/preferences`).child(`review${referenceVar}`).set(reviewObject);
        referenceVar++;
        window.location.href = 'content.-reviews.html';
    })








    //display-preference on-click using dynamic js
    $(document).on("click", ".review-summaries", function () {
        //console.log(myPreferences[key]);
        var myId = $(this).attr("id");
        for (key in myPreferences) {
            //console.log(myPreferences[key].class)
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
                                <textarea class="form-control" id="reviewComments" rows="5"></textarea>
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
});
