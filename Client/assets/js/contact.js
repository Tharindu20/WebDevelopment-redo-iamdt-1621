$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from FORM
      var name = $("input#contact-name").val();
      var email = $("input#email").val();
      var address = $("input#address").val();
      var message = $("textarea#message").val();
      
      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }

      $this = $("#sendEmail");
      $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
      
      $.ajax({
        url: "http://localhost:3000/sendemails",
        type: "POST",
        data: {
          name: name,
          email: email,
          address: address,
          message: message
        },
        cache: false,
        success: function() {
          // Success message
          $('#contact-success').html("<div class='alert alert-success'>");
          $('#contact-success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#contact-success > .alert-success')
            .append("<strong>Your message has been sent. We will get back to you shortly. </strong>");
          $('#contact-success > .alert-success')
            .append('</div>');
          //clear all fields
          $('#contactForm').trigger("reset");
        },
        error: function(jqXHR, exception) {
          // Fail message
          $('#contact-success').html("<div class='alert alert-danger'>");
          $('#contact-success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#contact-success > .alert-danger').append($("<strong>").text("Sorry " + firstName + ", We are unable to send your message. Please try again later!"));
          $('#contact-success > .alert-danger').append('</div>');
          //clear all fields
          $('#contactForm').trigger("reset");
        },
        complete: function() {
          setTimeout(function() {
            $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
          }, 1000);
        }
      });
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});
