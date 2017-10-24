var isRewardClicked = false;
var isPromotionClicked = false;
var number = localStorage.getItem('userNumber');
if (number == null || number == '') {
  $('.logoutBtn').hide();
} else {
  $('.logoutBtn').show();
}
$('#btn_login').click(function() {
  $('#uname').removeClass('error');
  var username = $('#uname').val().trim();
  if (username == null || username == "") {
    $('#uname').addClass('error');
    return;
  }
})

function doLogin(username) {
  var rest_id = sessionStorage.getItem('clickedRest') ? sessionStorage.getItem('clickedRest') : 1;
  var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=login&email=' + username + '&table_id=&is_restaurant=' + rest_id;
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      $('.logoutBtn').show();
      var responseData = JSON.parse(result);
      if (responseData.success == 1) {
        var registeredRest = localStorage.getItem('registeredRest');
        if (registeredRest == undefined) {
          registeredRest = [];
        } else {
          registeredRest = JSON.parse(registeredRest);
        }
        registeredRest.push(rest_id);
        localStorage.setItem('registeredRest', JSON.stringify(registeredRest));
        localStorage.setItem('userData', JSON.stringify(responseData.user));
        localStorage.setItem('userNumber', username);
        var clickedId = sessionStorage.getItem('clickedId');
        var addingKey = sessionStorage.getItem('addingKey');
        $('#loginDialog').dialog('close');
        // var changeTo = sessionStorage.getItem('changeTo');
        if (addingKey == 'promotion') {
          addPromotion(clickedId);
          //$.mobile.changePage("#restologyPage");
          // bindPromotion(rest_id);
        } else if (addingKey == 'rewards') {
          //$.mobile.changePage("#restologyPage");
          //bindRewards(rest_id);
          addReward(clickedId);
        } else if (addingKey != null && addingKey != '') {
          location.href="indexjqm.html/#"+addingKey;
          $.mobile.changePage("#" + addingKey);
        }
      } else {
        alert(responseData.message);
      }
    },
    error: function(result) {
      console.log(result);
    }
  })
}

$(document).on('click', '.logoutBtn', function(e){
    localStorage.clear();
    sessionStorage.clear();
    alert('Logout Successfully ');
    location.href = 'indexjqm.html';
});

// $('.logoutBtn').click(function() {
//   localStorage.clear();
//   sessionStorage.clear();
//   alert('Logout Successfully ');
//   location.href = 'indexjqm.html';
// });

function registerUser() {
  $("#loginDialog").dialog('close');
  $('input').removeClass('error');
  var phoneNumber = $('#phoneNumber').val().trim();
  var emailId = $('#emailId').val().trim();
  var fname = $('#fname').val().trim();
  var lname = $('#lname').val().trim();
  var dob = $('#userDOB').val().trim();
  var dob_date = '';
  var dob_mnth = '';
  var anniversaryDate = $('#anniversaryDate').val().trim();
  var newregex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/g;
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //$('input').tooltip('destroy');
  if (phoneNumber == null || phoneNumber == "") {
    $('#phoneNumber').attr('title', 'Enter Number');
    //$('#phoneNumber').tooltip('show');
    $('#phoneNumber').addClass('error');
    return;
  } else if (!newregex.test(phoneNumber)) {
    $('#phoneNumber').attr('title', 'Invalid Number');
    //$('#phoneNumber').tooltip('show');
    $('#phoneNumber').addClass('error');
    return;
  } else if (emailId != '' && emailId != null) {
    if (!emailRegex.test(emailId)) {
      $('#emailId').attr('title', 'Invalid Email Id');
      //$('#emailId').tooltip('show');
      $('#emailId').addClass('error');
      return;
    }
  } else if (fname == null || fname == "") {
    $('#fname').addClass('error');
    $('#fname').attr('title', 'Enter First name');
    //	$('#fname').tooltip('show');
    return;
  } else if (lname == null || lname == "") {
    $('#lname').addClass('error');
    $('#lname').attr('title', 'Enter Last name');
    //	$('#lname').tooltip('show');
    return;
  }
  if (dob != null || dob != "") {
    var date = new Date(dob);
    dob_date = date.getDate();
    dob_mnth = date.getMonth() + 1;
  }
  var rest_id = sessionStorage.getItem('clickedRest');
  var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=register&fname=' + fname + '&lname=' + lname + '&email=' + emailId + '&phone=' + phoneNumber + '&cust_dob_day=' + dob_date + '&cust_dob_mon=' + dob_mnth + '&cust_aniversary_dt=' + anniversaryDate + '&is_restaurant=' + rest_id;
  //console.log(url);
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      //console.log(result);
      $('.logoutBtn').show();
      var responseData = JSON.parse(result);
      if (responseData.success == 1) {
        localStorage.setItem('userData', JSON.stringify(responseData.user));
        localStorage.setItem('userNumber', phoneNumber);
        // location.href = 'index.html';
        //$('.myDialog').dialog('close');
        $('.myDialog').dialog('close');
        $("#loginDialog").dialog('close');
        var registeredRest = localStorage.getItem('registeredRest');
        if (registeredRest == undefined) {
          registeredRest = [];
        } else {
          registeredRest = JSON.parse(registeredRest);
        }
        registeredRest.push(rest_id);
        localStorage.setItem('registeredRest', JSON.stringify(registeredRest));
        var addingKey = sessionStorage.getItem('addingKey');
        var clickedId = sessionStorage.getItem("clickedId");
        // var changeTo = sessionStorage.getItem('changeTo');
        if (addingKey == 'promotion') {
          //$.mobile.changePage("#restologyPage");
          //bindPromotion(rest_id);
          addPromotion(clickedId);
        } else if (addingKey == 'rewards') {
          //$.mobile.changePage("#restologyPage");
          //bindRewards(rest_id);
          addReward(clickedId);
        } else if (addingKey != null && addingKey != '') {
          location.href="indexjqm.html/#"+addingKey;
          //$.mobile.changePage("#" + addingKey);
        }
      } else {
        alert(responseData.message);
      }
    },
    error: function(result) {
      //console.log(result);
      alert('Something is wrong, try later!');
    }
  })
}
$(document).on("pageshow", "#MyRewardPage", function() {
  //$.mobile.changePage("#loginDialog");
  var number = localStorage.getItem('userNumber');
  //console.log(number);
  if (number == null || number == '') {
    sessionStorage.setItem('addingKey', 'MyRewardPage');
    $.mobile.changePage("#loginDialog");
  } else {
    var rewardsFound = false;
    var userData = JSON.parse(localStorage.getItem('userData'));
    $('#username').html('Welcome ' + userData.first_name);
    var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=get_loyalty_det_new&phone=' + number;
    $.ajax({
      url: url,
      type: "GET",
      success: function(result) {
        //console.log(result);
        var responseData = JSON.parse(result);
        if (responseData.success == 0) {
          if (responseData.hasOwnProperty("rest_rewards")) {
            var rest_rewards = responseData.rest_rewards;
            $("#rewardsList").empty();
            for (var i = 0; i < rest_rewards.length; i++) {
              rewardsFound = true;
              var rewardObj = rest_rewards[i];
              // $('#rewardsList').append('<li class="list-group-item">
              //   <div class="inner-container">
              //   <div class="col-xs-3 col-sm-2 col-md-1 col-lg-1 img-icon">
              //   <img id="img_' + i + '" src="' + rewardObj.restaurant_info.restaurent_img_url + '" class="img-circle">
              //   </div><div class="col-xs-9 col-sm-10 col-md-11 col-lg-11">
              //   <div class="row">' +
              //   rewardObj.restaurant_info.restaurent_name + '</div>
              //   <div class="mypro_desc"> Avaible Points : <span>' + parseInt(rewardObj.reward.reward_bal_points) + '</span>
              //   </div><div class="col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2" id="rewardDiv_' + i + '">
              //   </div>
              //   </div>
              //   </div>
              //   </li>');
              //$('#rewardsList').append('<li>Suraj</li>');
              $('#rewardsList').append("<li><img class='restaurent_image' src='" + rewardObj.restaurant_info.restaurent_img_url + "' alt='"+rewardObj.restaurant_info.restaurent_name+"'><h2 class='rest-name'>" +rewardObj.restaurant_info.restaurent_name+ "</h2><p><div class='mypro_desc'> Avaible Points : <span>" + parseInt(rewardObj.reward.reward_bal_points) + "</span></div><div class='col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2' id='rewardDiv_" + i + "' style='color:#fff'></div></p></li>");


              var availableRewards = rewardObj.rewards_avail;
              if (availableRewards.length != 0) {
                for (var k = 0; k < availableRewards.length; k++) {
                  var item = availableRewards[k];
                  $('#rewardDiv_' + i).append('<div>' + item.prom_title + '</div><br>');
                }
              } else {
                if (rewardObj.next_reward_pt != '') {
                  $('#rewardDiv_' + i).append(rewardObj.next_reward_pt + ' points needed to get the next promotion offer');
                }
              }
            }

            $("#rewardsList").listview("refresh");
          }
        }
      },
      error: function(result) {
        console.log(result);
      }
    })
    $("#rewardsList").listview("refresh");
  }
  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
  }

  $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
      //console.log('click on close');
      location.href = 'indexjqm.html';
  })

});
$(document).on("pageinit", "#MyPromotionPage", function() {
  var number = localStorage.getItem('userNumber');
  //console.log(number);
  if (number == null || number == '') {
    sessionStorage.setItem('addingKey', 'MyPromotionPage');
    $.mobile.changePage("#loginDialog");
  } else {
    $('.promoClass').addClass("ui-btn-active")
    var userData = JSON.parse(localStorage.getItem('userData'));
    //console.log(userData);
    $('#username').html('Welcome ' + userData.first_name);
    var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_my_favorites&phone=' + number;
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        //console.log(result);
        var responseData = JSON.parse(result);
        if (responseData.success == 0) {
          if (responseData.hasOwnProperty("all_rest_promotions")) {
            var promotions_list = responseData.all_rest_promotions;
            $("#promotionList").empty();
            for (var i = 0; i < promotions_list.length; i++) {
              if (typeof(promotions_list[i].promotions) == 'object') {
                var promotions = promotions_list[i].promotions;
                var rest_info = promotions_list[i].restaurant_info;
                for (var j = 0; j < promotions.length; j++) {
                  if(promotions[j].hasOwnProperty("user_promotion")) {
                    var user_promotions = promotions[j].user_promotion;
                    for (var k = 0; k < user_promotions.length; k++) {
                      promotionFound = true;
                      var userPromObj = user_promotions[k];
                      //$('#promotionList').append('<li id="restaurentList' + userPromObj.id + '"><img id="img_' + k + '" src="img/default.jpg"><h2 class="mypro_title">' +
                      //rest_info.name + '</h2><p class="mypro_desc">' + userPromObj.simple_title + '</p></li>');
                      $('#promotionList').append("<li><img class='restaurent_image' id='img_" + k + "' src='img/default.jpg' alt='"+rest_info.name+"'><h2 class='rest-name'>" +rest_info.name+ "</h2><p><div class='mypro_desc'>"+userPromObj.simple_title+"</div></p></li>");
                      if (userPromObj.img_ext != '0') {
                        $('#img_' + k).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + userPromObj.id + '.' + userPromObj.img_ext);
                      } else {
                        $('#img_' + k).attr('src', rest_info.restaurent_img_url);
                      }
                    }
                  }
                }
              }
            }
            $("#promotionList").listview("refresh");
          }
          if (!promotionFound) {
            $('#promotionList').append('<li class="list-group-item">No Promotions</li>');
          }
        }
      },
      error: function(result) {
        console.log(result);
      }
    });
    // }
    //var url = "http://restaulogy.com/restaurant_in/service/service_login.php?tag=get_user_ids_by_phone&phone=" + number;
    // var url ="http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_my_favorites&phone=" + number;
    // $.ajax({
    //   url: url,
    //   type: 'GET',
    //   success: function(response) {
    //     console.log(response);
    //     var result = JSON.parse(response);
    //     console.log(result);
    //     // if (result.success == 1) {
    //     //   var userIdList = result.user_ids;
    //     // }
    //   },
    //   error: function(response) {
    //     console.log(response);
    //   }
    // })
  }

  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
  }

  $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
      //console.log('click on close');
      location.href = 'indexjqm.html';
  })
});

// $(document).on('pageinit', "#signupPage", function() {
//     $(document).on('click','#btn_signupuser',function() {
//       //$('#loginDialog').dialog('close');
//       registerUser();
//     });
// });


// getRestarents();
$(document).on("pageinit", "#restologyPage", function() {
  //alert();
  $('#btn_login').click(function() {
    $('#uname').removeClass('error');
    var username = $('#uname').val().trim();
    if (username == null || username == "") {
      $('#uname').addClass('error');
      return;
    }
    doLogin(username);
  });
  $("#naviageToSignupBtn").click(function() {
    //$.mobile.changePage("#signupPage");
	    $('#loginDialog').dialog('close');
      setTimeout(function(){$.mobile.changePage("#signupPage");},10);
  });

   // $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
   //    console.log('click on close');
   //    location.href = 'indexjqm.html';
   // })
  
  $('#btn_signupuser').click(function() {
	  $('#loginDialog').dialog('close');
    registerUser();
  });
  $("#btn-menu-rest").click(function() {
    getRestarents();
  })
  //getRestarentsJsonP();
  getRestarents();
  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
  }
  //$.mobile.changePage("#loginDialog");
});


$(document).on("pageshow", "#restologyPage", function() {
  //getRestarents();
})

function getRestarentsJsonP() {
  var url = 'http://restaulogy.com/restaurant_in/service/service_restaurant.php?tag=restaurant_listing&callback=?';
  $.getJSON(url, function(result) {
    var jsonObj = result;
    if (jsonObj.success == 1) {
      jQuery.each(jsonObj.rest_list, function(i, val) {
        var restObj = val;
        $("#restaurentList").empty();
        $("#restaurentList").append("<li><img class='restaurent_image' src='" +
          restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><h2 class='rest-name'>" +
          restObj.restaurent_name + "</h2><p class = 'rest-address'>" +
          restObj.restaurent_address + "</p><div class='ui-grid-a restaurent-button-main-div'><div class='ui-block-a'><input type='button' class='promoBtn' value='Promotions' id='" +
          restObj.restaurent_id + "'></div><div class='ui-block-b'><input type='button' class='rewardBtn' value='Rewards' id='" +
          restObj.restaurent_id + "'></div></div><div style='diplay:none' class='list_div pramotion_reward_main_div'><ul class='listing' data-role='listview' id='listing_" +
          restObj.restaurent_id + "'></ul></div></li>");
      });
      $("#restaurentList").listview("refresh");
      $('[type="button"]').button();
      $('.promoBtn').unbind('click');
      $('.promoBtn').click(function() {
        $('#list_div').hide();
        $('.listing').hide();
        $('.listing').empty();
        var rest_id = $(this).attr('id');
        bindPromotion(rest_id);
      })
      $('.rewardBtn').unbind('click');
      $('.rewardBtn').click(function() {
        $('#list_div').hide();
        $('.listing').hide();
        var rest_id = $(this).attr('id');
        bindRewards(rest_id);
      })
    }
  });
}

function dummy(data) {
  console.log(data);
}

function getRestarents() {
  var url = 'http://restaulogy.com/restaurant_in/service/service_restaurant.php?tag=restaurant_listing';
  $.ajax({
    url: url,
    type: 'GET',
    crossOrigin: true,
    success: function(result) {
      var jsonObj = JSON.parse(result);
      if (jsonObj.success == 1) {
        $("#restaurentList").empty();
        jQuery.each(jsonObj.rest_list, function(i, val) {
          var restObj = val;
          // $("#restaurentList").append("<div class='col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-offset-2 col-lg-8'><div class='card'><img class='rest-img' src='" +
          // restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><p class='rest-name'>" +
          // restObj.restaurent_name + "</p><label class = 'rest-address'>" +
          // restObj.restaurent_address + "</label><hr><div class='ui-grid-a'><div class='ui-block-a'><button class='ui-btn promoBtn' id='" +
          // restObj.restaurent_id + "'>Promotions</button></div><div class='ui-block-b'><button class='ui-btn rewardBtn' id='" +
          // restObj.restaurent_id + "'>Rewards</button></div><div style='diplay:none' class='list_div'><div class='listing' data-role='listview' id='listing_" +
          // restObj.restaurent_id + "'></div></div></div></div>");
          $("#restaurentList").append("<li><img class='restaurent_image' src='" +
            restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><h2 class='rest-name'>" +
            restObj.restaurent_name + "</h2><p class = 'rest-address'>" +
            restObj.restaurent_address + "</p><div class='ui-grid-a restaurent-button-main-div'><div class='ui-block-a'><input type='button' class='promoBtn' value='Promotions' id='" +
            restObj.restaurent_id + "'></div><div class='ui-block-b'><input type='button' class='rewardBtn' value='Rewards' id='" +
            restObj.restaurent_id + "'></div></div><div style='diplay:none' class='list_div pramotion_reward_main_div'><ul class='listing' data-role='listview' id='listing_" +
            restObj.restaurent_id + "'></ul></div></li>");
        });
        $("#restaurentList").listview("refresh");
        $('[type="button"]').button();
        $('.promoBtn').unbind('click');
        $('.promoBtn').click(function() {
          $('#list_div').hide();
          $('.listing').hide();
          $('.listing').empty();
          var rest_id = $(this).attr('id');
          var prev_rest = sessionStorage.getItem("prev_rest");
          if (prev_rest != rest_id) {
            //var isRewardClicked = false;
            isPromotionClicked = false;
            sessionStorage.setItem("prev_rest", "");
          }
          /*var registeredRest = localStorage.getItem('registeredRest');
			if(registeredRest==undefined){
				registeredRest = [];
			}else{
				registeredRest = JSON.parse(registeredRest);
			}
          
          if (registeredRest.indexOf(rest_id)==-1) {
			  sessionStorage.setItem('addingKey','promotion');
			  sessionStorage.setItem('clickedRest',rest_id);
            $('#login-modal').modal();
            $.mobile.changePage("#loginDialog");
          } else {
            bindPromotion(rest_id);
          }  */
          bindPromotion(rest_id);
        })
        $('.rewardBtn').unbind('click');
        $('.rewardBtn').click(function() {
          $('#list_div').hide();
          $('.listing').hide();
          var rest_id = $(this).attr('id');
          var prev_rest = sessionStorage.getItem("prev_rest");
          if (prev_rest != rest_id) {
            isRewardClicked = false;
            //var isPromotionClicked = false;
            sessionStorage.setItem("prev_rest", "");
          }
          // alert(rest_id);
          /* var registeredRest = localStorage.getItem('registeredRest');
			if(registeredRest==undefined){
				registeredRest = [];
			}else{
				registeredRest = JSON.parse(registeredRest);
			}
          
          if (registeredRest.indexOf(rest_id)==-1) {  
			
			  sessionStorage.setItem('addingKey','rewards');
			  sessionStorage.setItem('clickedRest',rest_id);
            $.mobile.changePage("#loginDialog");
          } else {
            bindRewards(rest_id);
          }*/
          bindRewards(rest_id);
        })
      }
    },
    error: function(result) {
      console.log(result);
    }
  })
}

function bindRewards(rest_id) {
  //console.log("bind rewards function called");
  if (!isRewardClicked) {
    sessionStorage.setItem("prev_rest", rest_id);
    isRewardClicked = true;
    isPromotionClicked = false;
    $('#listing_' + rest_id).show();
    $('#listing_' + rest_id).empty();
    var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=rest_rewards&restaurant_id=' + rest_id;
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        var response = JSON.parse(result);
        if (response.success == 1) {
          if (response.reward_list.length == 0) {
            $('#listing_' + rest_id).append('<li>No rewards</li>');
          }
          for (var i = 0; i < response.reward_list.length; i++) {
            var rewardItem = response.reward_list[i];
            $('#listing_' + rest_id).append('<li id="restaurentList' + rewardItem.rwd_id + '"><img src="img/default.jpg" id="img_' + i + '"><div class="col-xs-9 col-sm-10 col-md-10 col-lg-10 pramotion_reward_single_div"><div class="pro_title">' + rewardItem.prom_title + '</div><div class="pro_desc">' + rewardItem.comments + '</div></div><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2"><button class="ui-btn ui-icon-plus ui-btn-icon-notext add_circle" id=' + rewardItem.rwd_id + '></button></div></li>');
            if (rewardItem.img_ext != '0') {
              $('#img_' + i).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + rewardItem.rwd_id + '.' + rewardItem.img_ext);
            } else {
              $('#img_' + i).attr('src', response.restaurent_img_url);
            }
          }
          $('.add_circle').unbind('click');
          $('.add_circle').click(function(event) {
            event.stopPropagation();
            var usernumber = localStorage.getItem('userNumber');
            if (usernumber == null || usernumber == '') {
              sessionStorage.setItem('addingKey', 'MyRewardPage');
              $.mobile.changePage("#loginDialog");
            } else {
              location.href = 'indexjqm.html#MyRewardPage';
              location.reload();
            }
            // var clickedId = $(this).attr('id');
            // var registeredRest = localStorage.getItem('registeredRest');
            // if (registeredRest == undefined) {
            //   registeredRest = [];
            // } else {
            //   registeredRest = JSON.parse(registeredRest);
            // }
            // if (registeredRest.indexOf(rest_id) == -1) {
            //   sessionStorage.setItem('addingKey', 'promotion');
            //   sessionStorage.setItem('clickedRest', rest_id);
            //   sessionStorage.setItem('clickedId', clickedId);
            //   // $('#login-modal').modal();
            //   $.mobile.changePage("#loginDialog");
            // } else {
            //   addReward(clickedId);
            // }
          })
        } else {
          $('#listing_' + rest_id).append('<li>No rewards</li>');
        }
        $('#listing_' + rest_id).listview().listview("refresh");
      },
      error: function(result) {
        //console.log(result);
        $('#listing_' + rest_id).append('<li>No rewards</li>');
        $('#listing_' + rest_id).listview().listview("refresh");
      }
    });
  } else {
    isRewardClicked = false;
    $('.listing').hide();
    $('#listing_' + rest_id).hide()
  }
  //console.log("will refresh here");
  $('#listing_' + rest_id).listview().listview("refresh");
}

function addReward(clickedId) {
  //console.log(clickedId);
  var userData = JSON.parse(localStorage.getItem('userData'));
  var userId = userData.id;
  var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=add_reward_pts&auth_id=' + userId + '&table_id=' + clickedId + '&chkin_points={reward_points}&chkin_amount={reward_amount}&cust_server_pin={Server_pin}&chkin_invoice={chkin_invoice} ';
}

function bindPromotion(rest_id) {
  if (!isPromotionClicked) {
    sessionStorage.setItem("prev_rest", rest_id);
    isRewardClicked = false;
    isPromotionClicked = true;
    $('#listing_' + rest_id).show();
    $('#listing_' + rest_id).empty();
    var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=prom_listing&listing_type=all&&is_restaurant=' + rest_id;
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        //console.log(result);
        var response = JSON.parse(result);
        if (response.success == 1) {
          if (response.prom_list.length == 0) {
            $('#listing_' + rest_id).append('<li>No Promotions</li>');
          }
          for (var i = 0; i < response.prom_list.length; i++) {
            var promoItem = response.prom_list[i];
            if (promoItem.hasOwnProperty("user_promotion")) {
              var user_promotion = promoItem.user_promotion;
              for (var j = 0; j < user_promotion.length; j++) {
                var user_promotion_item = user_promotion[j];
                var startDate = getFormattedDate(user_promotion_item.start_date);
                var endDate = getFormattedDate(user_promotion_item.end_date);
                //var message = 'Valid from ' + startDate + ' till ' + endDate;;
                var message = "Valid till " + endDate;
                $('#listing_' + rest_id).append('<li id="' + user_promotion_item.id + '"><img id="img_' + j + '" src="img/default.jpg"><div class="col-xs-9 col-sm-10 col-md-10 col-lg-10 pramotion_reward_single_div"><div class="pro_title">' +
                  user_promotion_item.title + '</div><div class="message">' + message + '</div></div><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2 pramotion_reward_single_div_1"><button class="ui-btn ui-icon-plus ui-btn-icon-notext add_circle" id="' +
                  user_promotion_item.id + '"></button></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="ui-grid-a"><div class="ui-block-a"><button class="ui-btn ui-icon-mail ui-btn-icon-left emailFrnd">Email a friend</button></div><div class="ui-block-b"><button class="ui-btn ui-icon-star ui-btn-icon-left shareBtn">Share</button></div></div></div></div></li>');
                if (user_promotion_item.img_ext != '0') {
                  $('#img_' + j).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + user_promotion_item.id + '.' + user_promotion_item.img_ext);
                } else {
                  $('#img_' + j).attr('src', promoItem.restaurant_logo);
                }
				$('[type="button"]').button();
				$('[type="button"]').click(function(e){
					e.stopPropagation();
				})
              }
            }
          }
          $('#listing_' + rest_id).listview().listview("refresh");
          $('#listing_' + rest_id + ' li').unbind('click');
          $('#listing_' + rest_id + ' li').click(function() {
            var clickedId = $(this).attr('id');
            console.log('Suraj',clickedId);
            sessionStorage.setItem('promotionClickedId', clickedId)
            //$.mobile.changePage("../promotionDetails.html");
            var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_prom_det&prom_id='+clickedId+'&is_restaurant=1';
            $.ajax({
              url : url,
              type : "GET",
              success : function(response){
                console.log(response);
                var result = JSON.parse(response);
                if(result.success==1){
                  var prom_det = result.prom_det;
                  $('#proDetailsDiv').empty();
                  $('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='ui-grid-a'><div class='ui-block-a'><button class='ui-btn ui-icon-star ui-btn-icon-left'>Share With</button></div><div class='ui-block-b'><button class='ui-btn ui-icon-mail ui-btn-icon-left'>Email a friend</button></div></div></div>");
                }
                $.mobile.changePage("#promotionDetails");
              },
              error : function(response){
                console.log(response);
              }
            })
            //$.mobile.changePage("#promotionDetails");
            //location.href = "promotionDetails.html";
          });
          $('.add_circle').unbind('click');
          $('.add_circle').click(function(event) {
            event.stopPropagation();
            var clickedId = $(this).attr('id');
            var registeredRest = localStorage.getItem('registeredRest');
            if (registeredRest == undefined) {
              registeredRest = [];
            } else {
              registeredRest = JSON.parse(registeredRest);
            }
            if (registeredRest.indexOf(rest_id) == -1) {
              sessionStorage.setItem('addingKey', 'promotion');
              sessionStorage.setItem('clickedRest', rest_id);
              sessionStorage.setItem('clickedId', clickedId);
              // $('#login-modal').modal();
              $.mobile.changePage("#loginDialog");
            } else {
              //var clickedId = $(this).attr('id');
              //console.log(clickedId);
              addPromotion(clickedId);
            }
          })
        } else {
          $('#listing_' + rest_id).append('<li>No Promotions</li>');
        }
        // $('#listing_' + rest_id).listview("refresh");
        // $('#listing_' + rest_id).append('No Promotions');
      },
      error: function(result) {
        //console.log(result);
        $('#listing_' + rest_id).append('<li>No Promotions</li>');
        $('#listing_' + rest_id).listview().listview("refresh");
      }
    });
  } else {
    isPromotionClicked = false;
    $('.listing').hide();
    $('#listing_' + rest_id).hide()
  }
}

function addPromotion(clickedId) {
  var userData = JSON.parse(localStorage.getItem('userData'));
  var userId = userData.id;
  var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=add_to_favorite_prom&user_id=' + userId + '&prom_id=' + clickedId;
  //console.log(url);
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      //console.log(result);
      var response = JSON.parse(result);
      if (response.success == 1) {
        alert(response.message);
      } else {
        alert(response.message);
      }
    },
    error: function(result) {
      console.log(result);
    }
  });
}

function getFormattedDate(dateValue) {
  var newDate = new Date(dateValue);
  var day = newDate.getDate();
  var month = newDate.getMonth() + 1;
  var year = newDate.getYear() + 1900;
  return day + '/' + month + '/' + year;
}

// function getFormattedDate(dateValue) {
//   var newDate = new Date(dateValue);
//   var day = newDate.getDate();
//   var month = newDate.getMonth() + 1;
//   var year = newDate.getYear()+1900;
//   return day + '/' + month + '/' + year;
// }