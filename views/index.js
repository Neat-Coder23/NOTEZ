$(document).ready(() => {
  $("#s-form").submit((e) => {
    e.preventDefault();
    if (
      !$("#s-username")
        .val()
        .match(/[!|@|#|$|%|^|}|&|)|*|(|{|~|`|+|=|,|/]/gm) &&
      $("#s-username").val() != "" &&
      $("#s-password").val() != "" &&
      !$("#s-username").val().includes(" ")
    ) {
      $.post(
        "/newaccount",
        {
          username: $("#s-username").val(),
          password: $("#s-password").val(),
        },
        (data) => {
          if (data == "username taken") {
            alert("The username is taken.. Try another one");
          }else{window.location.pathname=data}
        }
      );
    } else {
      alert("Invalid username!\nUsername can not include symbols except -,.,_");
    }
  });
  $("#switch-s").click(() => {
    $("#signup").css("left", "100%");
    $("#login").css("left", "0%");
  });
  $("#switch-l").click(() => {
    $("#login").css("left", "-100%");
    $("#signup").css("left", "0%");
  });

  $("#l-form").submit((e) => {
    e.preventDefault();
    $.post("/login", {
      username: $("#l-username").val(),
      password: $("#l-password").val(),
    },(d)=>{if(d=="/"){window.location.pathname=d}else{alert(d)}});
  });
});
