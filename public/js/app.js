$(document).ready(function () {
  // Grab the articles as a json
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Use stock photo if no thumbnail
      var thumbnail = data[i].thumbnail ? data[i].thumbnail : "https://image.shutterstock.com/image-photo/dieting-questions-concept-diet-worries-260nw-183987839.jpg"
      // Append beginning of reddit url if needed
      var link = data[i].link.startsWith("http") ? data[i].link : "https://old.reddit.com" + data[i].link;
      // Define new Bootstrap container, row, columns 
      var recipeCard = $("<div>").addClass("recipe-card").data('id', data[i]._id);
      var newContainer = $("<div>").addClass("container-fluid");
      var newRow = $('<div>').addClass("row");
      var newLCol = $('<div>').addClass("col-sm-3 col-xs-12");
      var newRCol = $('<div>').addClass("col-sm-9 col-xs-12 article-title-holder");
      // Append information relevant to the client
      newLCol.append(`<img class="thumbnail" src="${thumbnail}">`);
      var h2 = $('<h2>').append(data[i].title);
      var aa = $('<a>').attr("href", link).text("Read this article");
      // build recipe card
      newRCol.append(h2).append(aa);
      newRow.append(newLCol);
      newRow.append(newRCol);
      newContainer.append(newRow);
      recipeCard.append(newContainer);
      $("#articles").append(recipeCard);
    }
  });


  // Whenever someone clicks a p tag
  $(document).on("click", "#btn-scrape", function (event) {
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function (data) {
      console.log(data);
      location.reload();
    });
  });


  $(document).on("click", ".recipe-card", function () {
    if (event.target.nodeName == "A") return;
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).data("id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<p>Write a comment</p>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='savenote'>Save Comment</button>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
});