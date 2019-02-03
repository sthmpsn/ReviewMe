$(document).ready(function(){
console.log ("javascript.js loaded");

    // Get session userName and display on site
    $("#currentUser").text('not ' +localStorage.getItem("username")+ ' ?');

    // Clear username from local storage if click "not <username>" link (simulate logout)
    $(document).on("click", "#currentUser", function(){
        localStorage.clear();
    });


// BEGIN STAR RATING RELATED
    $(document).on("click", ".star-ratings > .fa-star", function(){
        // Clear any existing stars that were previously colored since a rating change is desired
        $(".star-ratings > .fa-star").removeClass("checked");

        // Get the Clicked Object
            var starNum = $(this)
            console.log("Star Object: " + starNum);
        // Get the start rating (1,2,3,4 or 5)
            var starRating = starNum.attr("rating")  
            console.log("RATING: "+ starRating);
        // For loop counting down to 1 that runs starting from the star-num clicked
            for (var i=starRating; i > 0; i--){ 
                $('#rating'+i).addClass("checked");    
                console.log("Color Filled Star " +i+ " with gold")
            }
    });
// END STAR RATING RELATED










});