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

  $('#send_sign_login').click(function(){
      doSignUpLogin();
  });

  $("#naviageToSignupBtn").click(function() {
    //$.mobile.changePage("#signupPage");
      $('#loginDialog').dialog('close');
      console.log('Suraj');
      setTimeout(function(){$.mobile.changePage("#signupPage");},100);
  });

  $('#btn_signupuser').click(function() {
    $('#loginDialog').dialog('close');
    registerUser();
  });
  $("#btn-menu-rest").click(function() {
    getRestarents();
  })
  getRestarents();
  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
    $('.userName').empty();
    $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
  }

  // $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
  //     if()
  //     location.reload();
  // });

  $('#restologyPage').on('click','.emailFriendMyPromo', function(event){
        event.stopPropagation();
        var restor_id = $(this).attr('resturent_id');
        var promo_id = $(this).attr('promotion_id');
        if(localStorage.getItem('userNumber')) {
          $('#friendPhone').val(localStorage.getItem('userNumber'));
        }
        sessionStorage.setItem('prev_rest',restor_id);
        sessionStorage.setItem('promotionClickedId',promo_id);
        $.mobile.changePage('#shareTextFriend');
  });
});

function doSignUpLogin()
{
  var name = $('#fullname').val().trim();
  var phoneNo = $('#phoneNo').val().trim();
  var checkBox = $('#agree_term').prop("checked");
  var phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/g;

  if(name === null || name === "") {
    alert('Enter the full name.');
    return;
  } else if(phoneNo === null || phoneNo === "") {
    alert('Enter the phone number.');
    return;
  } else if(!phoneRegex.test(phoneNo)) {
    alert('Enter the correct phone number.');
    return;
  } else if(!checkBox) {
    alert('Check the checkbox to accept term and condition.');
    return;
  }

  var promotion_id = sessionStorage.getItem('clickedId');
  var restaurant_id = sessionStorage.getItem('clickedRest');
  var user_phone = phoneNo;

  if(sessionStorage.getItem('addingKey')==='promotion') {
    action_to_take = 'promotion';
  } else if(sessionStorage.getItem('addingKey')==='rewards') {
    action_to_take = 'reward';
  } else {
    action_to_take = 'refer_friend';
  }

  callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
}


function callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take) {
  var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=new_refer_friend&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&action_to_take='+action_to_take;
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        var response = JSON.parse(result);
        if (response.success == 1) {
          var number = localStorage.getItem('userNumber');
          var logged_in = true;
          if(number === null || number === "") {
            $('#commonLoginSignup').dialog('close');
            $('.logoutBtn').show();
            logged_in = false;
          } else {
            logged_in = true;
          }
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userNumber', user_phone);
          //console.log(JSON.parse(localStorage.getItem('userData')).full_name);
          $('.userName').empty();
          $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
          if(action_to_take === 'promotion') {
            addPromotionLogin(promotion_id,logged_in);
          } else if(action_to_take === 'reward') {
            setTimeout(function(){addReward(promotion_id,logged_in);},200);
          }
        } else {
          alert(response.message);
        }
      },
      error: function(result) {
        console.log(result);
      }
    });
}




function doLogin(username) {
  var rest_id = sessionStorage.getItem('clickedRest');
  if(rest_id) {
    console.log('suraj');
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
            addPromotionLogin(clickedId);
            //$.mobile.changePage("#restologyPage");
            // bindPromotion(rest_id);
          } else if (addingKey == 'rewards') {
            //$.mobile.changePage("#MyRewardPage");
            //bindRewards(rest_id);
            alert('Logged in Successfully');
            addReward(clickedId);
            location.href = '#MyRewardPage';
            //location.reload();
          } else if (addingKey != null && addingKey != '') {
            alert('Logged in Successfully');
            location.href="#"+addingKey;
            location.reload();
          }
          $('.userName').empty();
          $('.userName').append(JSON.stringify(localStorage.getItem('userData')).full_name);
        } else {
          alert(responseData.message);
          $('.logoutBtn').hide();
        }
      },
      error: function(result) {
        console.log(result);
      }
    })
  } else {
    var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=get_user_ids_by_phone&phone='+username;
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        $('.logoutBtn').show();
        var responseData = JSON.parse(result);
        if (responseData.success == 1) {
          alert('Logged in Successfully');
          localStorage.setItem('userData', JSON.stringify(responseData.user_ids[Object.keys(responseData.user_ids)[0]]));
          localStorage.setItem('userNumber', username);
          $('#loginDialog').dialog('close');
          // var changeTo = sessionStorage.getItem('changeTo');
          $('.userName').empty();
          $('.userName').append(JSON.stringify(localStorage.getItem('userData')).full_name);
        } else {
          alert(responseData.message);
          $('.logoutBtn').hide();
        }
      },
      error: function(result) {
        console.log(result);
      }
    })
  }
}

$(document).on('click', '.logoutBtn', function(e){
    localStorage.clear();
    sessionStorage.clear();
    alert('Successfully logout.');
    location.href = '';
});

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
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      $('.logoutBtn').show();
      var responseData = JSON.parse(result);
      if (responseData.success == 1) {
        localStorage.setItem('userData', JSON.stringify(responseData.user));
        localStorage.setItem('userNumber', phoneNumber);
        // $('.myDialog').dialog('close');
        $("#signupPage").dialog('close');
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
          addPromotionSignUp(clickedId);
        } else if (addingKey == 'rewards') {
          //$.mobile.changePage("#restologyPage");
          //bindRewards(rest_id);
          alert('Sign up successfully.');
          addReward(clickedId);
        } else if (addingKey != null && addingKey != '') {
          alert('Sign up successfully.');
          location.href="#"+addingKey;
          //$.mobile.changePage("#" + addingKey);
        }
        $('.userName').empty();
        $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
      } else {
        alert(responseData.message);
        $('.logoutBtn').hide();
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
  if (number == null || number == '') {
    sessionStorage.setItem('addingKey', 'MyRewardPage');
    $.mobile.changePage("#loginDialog");
    //$.mobile.changePage("#commonLoginSignup");
    $('#naviageToSignupBtnDiv').hide();
  } else {
    var rewardsFound = false;
    var userData = JSON.parse(localStorage.getItem('userData'));
    $('#username').html('Welcome ' + userData.first_name);
    var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=get_loyalty_det_new&phone=' + number;
    $.ajax({
      url: url,
      type: "GET",
      success: function(result) {
        var responseData = JSON.parse(result);
        if (responseData.success == 0) {
            if (responseData.hasOwnProperty("rest_rewards")) {
            var rest_rewards = responseData.rest_rewards;
            var is_claim = 0;
            $("#rewardsList").empty();
            for (var i = 0; i < rest_rewards.length; i++) {
              rewardsFound = true;
              var rewardObj = rest_rewards[i];
              var reward_claim_url = 'http://restaulogy.com/restaurant_in/user/short_cd_signup.php?rst='+rewardObj.restaurant_info.restaurent_id+'&srt_cd_ph='+$.base64.encode(userData.id);
              $('#rewardsList').append("<li><img class='restaurent_image' src='" + rewardObj.restaurant_info.restaurent_img_url + 
                "' alt='"+rewardObj.restaurant_info.restaurent_name+"'><h2 class='rest-name'>" +rewardObj.restaurant_info.restaurent_name+ 
                "</h2><p class='rest-address'>"+rewardObj.restaurant_info.restaurent_address+"</p><div class='mypro_desc'> Available Points : <span>" + parseInt(rewardObj.overall_stat.balance_points) + 
                "</span><span><button class='rewardClaimBtn ui-btn ui-icon-check ui-btn-icon-left'><a target='_blank' href='"+reward_claim_url+"'>Claim</a></button></span></div><div class='reward_points_information' id='rewardDiv_" + i + "' style='color:#fff'></div></li>");
              var availableRewards = rewardObj.rewards_avail;
              if (availableRewards.length != 0) {
                is_claim = 0;
                var sub_reward_list = '';
                var img_url = '';
                for (var k = 0; k < availableRewards.length; k++) {
                  var item = availableRewards[k];
                  if(item.can_claim > 0) {
                    //<ul id='resto_reward_list_"+rewardObj.restaurant_info.restaurent_id+"' class='listing ui-listview ui-listview-inset ui-corner-all ui-shadow sublist-promotion' data-role='listview' data-icon='false' data-inset='true' data-filter='true'></ul>
                    img_url = '';
                    if (item.img_ext != '0') {
                        img_url = 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + item.rwd_coupon_id + '.' + item.img_ext;
                    } else {
                        img_url = 'http://restaulogy.com/restaurant_in/images/restaurant/'+rewardObj.restaurant_info.restaurent_id+'.'+item.restaurent_img;
                    }
                    sub_reward_list = sub_reward_list + '<li class="ui-li-static ui-body-inherit ui-li-has-thumb"><img src="'+img_url+'"><h4 class="promo-name">'+item.prom_title+ '</h4><p style="color:#fff;">'+item.comments+'</p><p style="color:#fff;">Claim : '+item.can_claim+' '+item.redeem_unit+'</p></li>';
                    is_claim = 1;
                  }
                }

                if(is_claim == 1) {
                  $('#rewardDiv_' + i).append('<ul class="listing ui-listview ui-listview-inset ui-corner-all ui-shadow sublist-promotion" data-role="listview" data-icon="false" data-inset="true" data-filter="true">' + sub_reward_list + '</ul>');
                }

                if(is_claim == 0) {
                  if (rewardObj.next_reward_pt != '') {
                    $('#rewardDiv_' + i).append('<div class="no_claim">'+rewardObj.next_reward_pt+'</div>');
                  }
                }
              } else {
                if (rewardObj.next_reward_pt != '') {
                  $('#rewardDiv_' + i).append('<div class="no_claim">'+rewardObj.next_reward_pt+'</div>');
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
    $("#rewardsList").show();
  }
  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
    $('.userName').empty();
    $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
  }
  $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
      console.log('click on close');
      if (number == null || number == '') {
        console.log('Yorewards');
        location.href = '';
      }
  })

  // if(sessionStorage.getItem('addingKey') == 'rewards') {
  //     sessionStorage.setItem('addingKey',null);
  //     location.href = '#MyRewardPage';
  //     location.reload();
  // }

});
$(document).on("pageshow", "#MyPromotionPage", function() {
  var number = localStorage.getItem('userNumber');
  if (number == null || number == '') {
    sessionStorage.setItem('addingKey', 'MyPromotionPage');
    $.mobile.changePage("#loginDialog");
    $('#naviageToSignupBtnDiv').hide();
  } else {
    promotionFound = false;
    $('.promoClass').addClass("ui-btn-active")
    var userData = JSON.parse(localStorage.getItem('userData'));
    //console.log(userData);
    $('#username').html('Welcome ' + userData.first_name);
    var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_my_favorites&phone=' + number;
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        var responseData = JSON.parse(result);
        if (responseData.success == 0) {
            if (responseData.hasOwnProperty("all_rest_promotions")) {
            var promotions_list = responseData.all_rest_promotions;
            $("#promotionList").empty();
            for (var i = 0; i < promotions_list.length; i++) {
              if (typeof(promotions_list[i].promotions) == 'object') {
                var promotions = promotions_list[i].promotions;
                var rest_info = promotions_list[i].restaurant_info;
                var prom_list = '';
                for (var j = 0; j < promotions.length; j++) {
                  if(promotions[j].hasOwnProperty("user_promotion")) {
                    var user_promotions = promotions[j].user_promotion;
                    for (var k = 0; k < user_promotions.length; k++) {
                      promotionFound = true;
                      var userPromObj = user_promotions[k];
                      var endDate = getFormattedDate(userPromObj.end_date);
                      var message = "Valid till " + endDate;
                      var imgage_url = "img/default.jpg";
                      //$('#promotionList').append('<li id="restaurentList' + userPromObj.id + '"><img id="img_' + k + '" src="img/default.jpg"><h2 class="mypro_title">' +
                      //rest_info.name + '</h2><p class="mypro_desc">' + userPromObj.simple_title + '</p></li>');
                      //$('#promotionList').append("<li><img class='restaurent_image' id='img_" + userPromObj.id + "' src='img/default.jpg' alt='"+rest_info.name+"'><h2 class='rest-name'>" +rest_info.name+ "</h2><p><div class='mypro_desc'>"+userPromObj.simple_title+"</div></p></li>");
                      if (userPromObj.img_ext != '0') {
                        imgage_url = 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + userPromObj.id + '.' + userPromObj.img_ext;
                        //$('#img_' + userPromObj.id).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + userPromObj.id + '.' + userPromObj.img_ext);
                      } else {
                        imgage_url = rest_info.restaurent_img_url;
                        //$('#img_' + userPromObj.id).attr('src', rest_info.restaurent_img_url);
                      }
                      if(userPromObj.cupon_type == "refer_friend") {
                        prom_list = prom_list + "<li class='ui-li-static ui-body-inherit ui-li-has-thumb'><img class='restaurent_image' id='img_" + userPromObj.id + "' src="+imgage_url+" alt='"+userPromObj.simple_title+"'><h4 class='promo-name' resturant_id='"+rest_info.restaurent_id+"' id='"+userPromObj.id+"'>" +userPromObj.simple_title+ "</h4><p>"+message+"</p><div class='button-div-1'><div class='ui-block-a'><button class='shareFacebookMyPromo ui-btn' id='shareMyPromo_"+userPromObj.id+"'><a href='' target='_blank' class='ui-link'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='emailFriendMyPromo ui-btn' resturent_id='"+rest_info.restaurent_id+"' promotion_id='"+userPromObj.id+"'><img id='refer_img' src='img/refer.png' style=''></button></div></div></li>";
                      } else {
                        prom_list = prom_list + "<li class='ui-li-static ui-body-inherit ui-li-has-thumb'><img class='restaurent_image' id='img_" + userPromObj.id + "' src="+imgage_url+" alt='"+userPromObj.simple_title+"'><h4 class='promo-name' resturant_id='"+rest_info.restaurent_id+"' id='"+userPromObj.id+"'>" +userPromObj.simple_title+ "</h4><p>"+message+"</p><div class='button-div-1'><div class='ui-block-a'><button class='shareFacebookMyPromo ui-btn' id='shareMyPromo_"+userPromObj.id+"'><a href='' target='_blank' class='ui-link'><img id='share_img' src='img/share.png' style=''></a></button></div></div></li>";
                      }
                      addMyPromoShareLink(rest_info.restaurent_id,userPromObj.id);
                    }
                  }
                }
              }

              if(prom_list != '' && prom_list != undefined) {
                $('#promotionList').append("<li><img class='restaurent_image' src='" +
            rest_info.restaurent_img_url + "' alt='" + rest_info.restaurent_name + "'><h2 class='rest-name'>" +
            rest_info.restaurent_name + "</h2><p class='rest-address'>"+rest_info.restaurent_address+"</p><ul class='listing ui-listview ui-listview-inset ui-corner-all ui-shadow sublist-promotion' data-role='listview' data-icon='false' data-inset='true' data-filter='true'>"+prom_list+"</ul>");
              }
              prom_list = '';
            //$(".common-sublist-promotion").listview("refresh");
            //$("#promotionList").listview("refresh");
            }
            //$(".common-sublist-promotion").listview("refresh");
            $("#promotionList").listview("refresh");
            //$('#listing_' + rest_id + ' li').unbind('click');
          }
          if (!promotionFound) {
            $('#promotionList').append('<li class="list-group-item no_promotion">No Promotions</li>');
          }
        }
      },
      error: function(result) {
        console.log(result);
      }
    });
  }

  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
    $('.userName').empty();
    $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
  }

  $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
      if (number == null || number == '') {
        console.log('UoPromotion');
        location.href = '';
      } else {
        location.href = '#MyPromotionPage';
      }
  });

  // if(sessionStorage.getItem('addingKey') == 'promotion') {
  //     sessionStorage.setItem('addingKey',null);
  //     location.href = '#MyPromotionPage';
  //     location.reload();
  // }

  $(document).on('click', '.promo-name', function(event){
        var clickedId = $(this).attr('id');
        var rest_id = $(this).attr('resturant_id');
        sessionStorage.setItem('promotionClickedId', clickedId);
        sessionStorage.setItem('prev_rest', rest_id);
        sessionStorage.setItem('addingKey','promotion');
        sessionStorage.setItem('clickedRest',"");
        sessionStorage.setItem('clickedId',clickedId);
        var number = localStorage.getItem('userNumber');
        if(number === null || number === '') {
          $.mobile.changePage("#loginDialog");
        } else {
          location.href = '#promotionDetails?promotion_id='+clickedId;
        }
        // var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_prom_det&prom_id='+clickedId+'&is_restaurant=1';
        // $.ajax({
        //   url : url,
        //   type : "GET",
        //   success : function(response){
        //     var result = JSON.parse(response);
        //     if(result.success==1){
        //       var prom_det = result.prom_det;
        //       $('#proDetailsDiv').empty();
        //       $('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='ui-grid-a'><div class='ui-block-a'><button class='ui-btn shareFacebook'><a href='' target='_blank'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='ui-btn emailFriend'><img id='refer_img' src='img/refer.png' style=''></button></div></div></div>");
        //     }
        //     addFbLink();
        //     //addShareFriendLink();
        //     //$.mobile.changePage("#promotionDetails");
        //     location.href = '#promotionDetails?promotion_id='+clickedId;
        //   },
        //   error : function(response){
        //     console.log(response);
        //   }
        // })
    });

  $('#MyPromotionPage').on('click','.emailFriendMyPromo', function(event){
        event.stopPropagation();
        var restor_id = $(this).attr('resturent_id');
        var promo_id = $(this).attr('promotion_id');
        if(localStorage.getItem('userNumber')) {
          $('#friendPhone').val(localStorage.getItem('userNumber'));
        }
        sessionStorage.setItem('prev_rest',restor_id);
        sessionStorage.setItem('promotionClickedId',promo_id);
        $.mobile.changePage('#shareTextFriend');
  });
});

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
        //localStorage.setItem('needRefresh',true);
        bindPromotion(rest_id);
      })
      $('.rewardBtn').unbind('click');
      $('.rewardBtn').click(function() {
        $('#list_div').hide();
        $('.listing').hide();
        var rest_id = $(this).attr('id');
        //localStorage.setItem('needRefresh',true);
        bindRewards(rest_id);
      })
    }
  });
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
          var menu_link = 'http://restaulogy.com/restaurant_in/user/tbl_menu.php?online_store=1&menu_restaurent='+restObj.restaurent_id+'&is_preview=1'
          $("#restaurentList").append("<li><img class='restaurent_image' src='" +
            restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><h2 class='rest-name'>" +
            restObj.restaurent_name + "</h2><p class = 'rest-address'>" +
            restObj.restaurent_address + "</p><div class='restaurent-button-main-div'><div class='ui-block-a'><button class='ui-btn ui-icon-audio ui-btn-icon-left promoBtn' id='"+restObj.restaurent_id+"'>Promotions</button></div><div class='ui-block-b'><button class='rewardBtn ui-btn ui-icon-star ui-btn-icon-left' id='" +
            restObj.restaurent_id + "'>Rewards</button></div><div class='ui-block-c'><button class='menuBtn ui-btn ui-icon-bullets ui-btn-icon-left'><a target='_blank' href='"+menu_link+"'>Menu</a></button></div></div><div style='diplay:none' class='list_div pramotion_reward_main_div'><ul class='listing' data-role='listview' id='listing_" +
            restObj.restaurent_id + "'></ul></div></li>");
        });
        $("#restaurentList").listview("refresh");
        $('[type="button"]').button();
        $('.promoBtn').unbind('click');
        $('.promoBtn').click(function() {
          $('#list_div').hide();
          $('.listing').hide();
          $('.listing').empty();
          //localStorage.setItem('needRefresh',true);
          var rest_id = $(this).attr('id');
          var prev_rest = sessionStorage.getItem("prev_rest");
          if (prev_rest != rest_id) {
            //var isRewardClicked = false;
            isPromotionClicked = false;
            sessionStorage.setItem("prev_rest", "");
          }
          bindPromotion(rest_id);
        })
        $('.rewardBtn').unbind('click');
        $('.rewardBtn').click(function() {
          $('#list_div').hide();
          $('.listing').hide();
          //localStorage.setItem('needRefresh',true);
          var rest_id = $(this).attr('id');
          var prev_rest = sessionStorage.getItem("prev_rest");
          if (prev_rest != rest_id) {
            isRewardClicked = false;
            //var isPromotionClicked = false;
            sessionStorage.setItem("prev_rest", "");
          }
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
            $('#listing_' + rest_id).append('<li id="restaurentList' + rewardItem.rwd_id + '"><img src="img/default.jpg" id="img_' + rewardItem.rwd_coupon_id + '"><div class="col-xs-9 col-sm-10 col-md-10 col-lg-10 pramotion_reward_single_div"><div class="pro_title">' + rewardItem.prom_title + '</div><div class="pro_desc">' + rewardItem.comments + '</div></div><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2"><button class="ui-btn ui-icon-plus ui-btn-icon-notext add_circle" id=' + rewardItem.rwd_id + '></button></div></li>');
            if (rewardItem.img_ext != '0') {
              $('#img_' + rewardItem.rwd_coupon_id).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + rewardItem.rwd_coupon_id + '.' + rewardItem.img_ext);
            } else {
              $('#img_' + rewardItem.rwd_coupon_id).attr('src', 'http://restaulogy.com/restaurant_in/images/restaurant/'+rest_id+'.'+rewardItem.restaurent_img);
            }
          }
          $('.add_circle').unbind('click');
          $('.add_circle').click(function(event) {
            event.stopPropagation();
              //sessionStorage.setItem('addingKey', 'MyRewardPage');
              //var registeredRest = localStorage.getItem('registeredRest');
              var clickedId = $(this).attr('id');
              // if (registeredRest == undefined) {
              //   registeredRest = [];
              // } else {
              //   registeredRest = JSON.parse(registeredRest);
              // }
              //if(registeredRest.indexOf(rest_id) == -1){
              var number = localStorage.getItem('userNumber');
              sessionStorage.setItem('addingKey', 'rewards');
              sessionStorage.setItem('clickedRest', rest_id);
              sessionStorage.setItem('clickedId', clickedId);
              if(number === null || number === ""){
                $.mobile.changePage("#commonLoginSignup");
              } else {
                var promotion_id = sessionStorage.getItem('clickedId');
                var restaurant_id = sessionStorage.getItem('clickedRest');
                var user_phone = localStorage.getItem('userNumber');
                var action_to_take = 'reward';
                callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
                // addReward(clickedId);
                // location.href = '#MyRewardPage';
                // location.reload();
              }
          })
        } else {
          $('#listing_' + rest_id).append('<li>No rewards</li>');
        }
        $('#listing_' + rest_id).listview().listview("refresh");
      },
      error: function(result) {
        $('#listing_' + rest_id).append('<li>No rewards</li>');
        $('#listing_' + rest_id).listview().listview("refresh");
      }
    });
  } else {
    isRewardClicked = false;
    $('.listing').hide();
    $('#listing_' + rest_id).hide()
  }
  $('#listing_' + rest_id).listview().listview("refresh");
}

function addReward(clickedId,logged_in) {
  if(logged_in) {
    location.href = '#MyRewardPage';
    location.reload();
  } else {
    alert('Logged in Successfully.');
    location.href = '#MyRewardPage';
    location.reload();
  }
  // location.href="#MyRewardPage";
  // //location.reload();
  // var userData = JSON.parse(localStorage.getItem('userData'));
  // var userId = userData.id;
  // var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=add_reward_pts&auth_id=' + userId + '&table_id=' + clickedId + '&chkin_points={reward_points}&chkin_amount={reward_amount}&cust_server_pin={Server_pin}&chkin_invoice={chkin_invoice} ';
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
        var response = JSON.parse(result);
        //console.log(response);
        if (response.success == 1) {
          if (response.prom_list.length == 0) {
            console.log('suraj');
            $('#listing_' + rest_id).append('<li class="no_promotion">No Promotions</li>');
            $('#listing_' + rest_id).css('display', 'table-caption !important');
          }
          for (var i = 0; i < response.prom_list.length; i++) {
            var promoItem = response.prom_list[i];
            if (promoItem.hasOwnProperty("user_promotion")) {
              var user_promotion = promoItem.user_promotion;
              for (var j = 0; j < user_promotion.length; j++) {
                var user_promotion_item = user_promotion[j];
                var startDate = getFormattedDate(user_promotion_item.start_date);
                var endDate = getFormattedDate(user_promotion_item.end_date);
                var message = "Valid till " + endDate;
                // $('#listing_' + rest_id).append('<li id="' + user_promotion_item.id + '"><img id="img_' + user_promotion_item.id + '" src="img/default.jpg"><div class="col-xs-9 col-sm-10 col-md-10 col-lg-10 pramotion_reward_single_div"><div class="pro_title">' +
                //   user_promotion_item.title + '</div><div class="message">' + message + '</div></div><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2 pramotion_reward_single_div_1"><button class="ui-btn ui-icon-plus ui-btn-icon-notext add_circle" id="' +
                //   user_promotion_item.id + '"></button></div><div class="ui-grid-a button-div"><div class="ui-block-a"><button class="shareFacebookMyPromo ui-btn" id="shareMyPromo_'+user_promotion_item.id+'"><a href="" target="_blank" class="ui-link"><img src="img/share.png" style="width:32px;height:32px !important;margin:0;"></a></button></div><div class="ui-block-b"><button class="emailFriendMyPromo ui-btn" resturent_id="'+rest_id+'" promotion_id="'+user_promotion_item.id+'"><img src="img/refer.png" style="width:32px;height:32px !important;margin:0;"></button></div></div></div></li>');
                //<div class="pramotion_reward_single_div_2 col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="ui-grid-a"><div class="ui-block-a"><button class="ui-btn ui-icon-mail ui-btn-icon-left emailFrnd">Email a friend</button></div><div class="ui-block-b"><button class="ui-btn ui-icon-star ui-btn-icon-left shareBtn">Share</button></div></div></div>
                if(user_promotion_item.cupon_type == "refer_friend") {
                  $('#listing_' + rest_id).append('<li id="' + user_promotion_item.id + '"><img id="img_' + user_promotion_item.id + '" src="img/default.jpg"><div class="col-xs-9 col-sm-10 col-md-10 col-lg-10 pramotion_reward_single_div"><div class="pro_title" id="' + user_promotion_item.id + '" restaurant_id ="'+rest_id+'" >' +
                  user_promotion_item.title + '</div><div class="message">' + message + '</div></div><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2 pramotion_reward_single_div_1"><button class="ui-btn ui-icon-plus ui-btn-icon-notext add_circle" id="' +
                  user_promotion_item.id + '"></button></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="button-div"><div class="ui-block-a"><button class="shareFacebookMyPromo ui-btn" id="shareMyPromo_'+user_promotion_item.id+'"><a href="" target="_blank" class="ui-link"><img id="share_img" src="img/share.png" style=""></a></button></div><div class="ui-block-b"><button class="emailFriendMyPromo ui-btn" resturent_id="'+rest_id+'" promotion_id="'+user_promotion_item.id+'"><img id="refer_img" src="img/refer.png" style=""></button></div></div></div></div></li>');
                } else {
                  $('#listing_' + rest_id).append('<li id="' + user_promotion_item.id + '"><img id="img_' + user_promotion_item.id + '" src="img/default.jpg"><div class="col-xs-9 col-sm-10 col-md-10 col-lg-10 pramotion_reward_single_div"><div class="pro_title" id="' + user_promotion_item.id + '" restaurant_id ="'+rest_id+'" >' +
                  user_promotion_item.title + '</div><div class="message">' + message + '</div></div><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2 pramotion_reward_single_div_1"><button class="ui-btn ui-icon-plus ui-btn-icon-notext add_circle" id="' +
                  user_promotion_item.id + '"></button></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="button-div"><div class="ui-block-a"><button class="shareFacebookMyPromo ui-btn" id="shareMyPromo_'+user_promotion_item.id+'"><a href="" target="_blank" class="ui-link"><img id="share_img" src="img/share.png" style=""></a></button></div></div></div></div></li>');
                }
                if (user_promotion_item.img_ext != '0') {
                  $('#img_' + user_promotion_item.id).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + user_promotion_item.id + '.' + user_promotion_item.img_ext);
                } else {
                  $('#img_' + user_promotion_item.id).attr('src', ''+promoItem.restaurant_logo+'');
                }
                addMyPromoShareLink(rest_id,user_promotion_item.id);
				$('[type="button"]').button();
				$('[type="button"]').click(function(e){
					e.stopPropagation();
				})
              }
            }
          }
          $('#listing_' + rest_id).listview().listview("refresh");
          $('#listing_' + rest_id + ' li').unbind('click');
          $('#listing_' + rest_id + ' li .pro_title').click(function() {
            var clickedId = $(this).attr('id');
            var rest_id = $(this).attr('restaurant_id');
            sessionStorage.setItem('promotionClickedId', clickedId);
            sessionStorage.setItem('prev_rest', rest_id);
            sessionStorage.setItem('addingKey','promotion');
            sessionStorage.setItem('clickedRest',"");
            sessionStorage.setItem('clickedId',clickedId);
            var number = localStorage.getItem('userNumber');
            if(number === null || number === '') {
              $.mobile.changePage("#loginDialog");
            } else {
              location.href = '#promotionDetails?promotion_id='+clickedId;
            }
            // var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_prom_det&prom_id='+clickedId+'&is_restaurant=1';
            // $.ajax({
            //   url : url,
            //   type : "GET",
            //   success : function(response){
            //     var result = JSON.parse(response);
            //     if(result.success==1){
            //       var prom_det = result.prom_det;
            //       $('#proDetailsDiv').empty();
            //       $('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='ui-grid-a'><div class='ui-block-a'><button class='ui-btn shareFacebook'><a href='' target='_blank'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='ui-btn emailFriend'><img id='refer_img' src='img/refer.png' style=''></button></div></div></div>");
            //     }
            //     addFbLink();
            //     //addShareFriendLink();
            //     //$.mobile.changePage("#promotionDetails");
            //     location.href = '#promotionDetails?promotion_id='+clickedId;
            //   },
            //   error : function(response){
            //     console.log(response);
            //   }
            // })
          });
          $('.add_circle').unbind('click');
          $('.add_circle').click(function(event) {
            event.stopPropagation();
            var clickedId = $(this).attr('id');
            var number = localStorage.getItem('userNumber');
            // var registeredRest = localStorage.getItem('registeredRest');
            // if (registeredRest == undefined) {
            //   registeredRest = [];
            // } else {
            //   registeredRest = JSON.parse(registeredRest);
            // }
            sessionStorage.setItem('addingKey', 'promotion');
            sessionStorage.setItem('clickedRest', rest_id);
            sessionStorage.setItem('clickedId', clickedId);
            if (number == null || number == '') {
              $.mobile.changePage("#commonLoginSignup");
            } else {
              //addPromotion(clickedId);
              var promotion_id = sessionStorage.getItem('clickedId');
              var restaurant_id = sessionStorage.getItem('clickedRest');
              var user_phone = localStorage.getItem('userNumber');
              var action_to_take = 'promotion';
              callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
            }
          })
        } else {
          $('#listing_' + rest_id).append('<li class="no_promotion">No Promotions</li>');
          $('#listing_' + rest_id).css('display', 'table-caption');
        }
      },
      error: function(result) {
        $('#listing_' + rest_id).append('<li class="no_promotion">No Promotions</li>');
        $('#listing_' + rest_id).css('display', 'table-caption');
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
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      var response = JSON.parse(result);
      if (response.success == 1) {
        alert(response.message);
        location.href = '#MyPromotionPage';
        location.reload();
      } else {
        alert(response.message);
        location.href = '#MyPromotionPage';
        location.reload();
      }
    },
    error: function(result) {
      console.log(result);
    }
  });
}

function addPromotionLogin(promo_id,logged_in)
{
  var userData = JSON.parse(localStorage.getItem('userData'));
  var userId = userData.id;
  var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=add_to_favorite_prom&user_id=' + userId + '&prom_id=' + promo_id;
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      var response = JSON.parse(result);
      if (response.success == 1) {
        if(logged_in) {
          alert(response.message);
        } else {
          alert('Logged in successfully and ' + response.message);
        }
        location.href = '#MyPromotionPage';
        location.reload();
      } else {
        if(logged_in) {
          alert(response.message);
        } else {
          alert('Logged in successfully and ' + response.message);
        }
        location.href = '#MyPromotionPage';
        location.reload();
      }
    },
    error: function(result) {
      console.log(result);
    }
  });
}

function addPromotionSignUp(clickedId)
{
  var userData = JSON.parse(localStorage.getItem('userData'));
  var userId = userData.id;
  var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=add_to_favorite_prom&user_id=' + userId + '&prom_id=' + clickedId;
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      var response = JSON.parse(result);
      if (response.success == 1) {
        alert('Sign up successfully and ' + response.message);
        location.href = '#MyPromotionPage';
        location.reload();
      } else {
        alert('Sign up successfully and ' + response.message);
        location.href = '#MyPromotionPage';
        location.reload();
      }
    },
    error: function(result) {
      console.log(result);
    }
  });
}

$(document).on("pageshow", "#promotionDetails", function() {

      var number = localStorage.getItem('userNumber');
      if(number === null || number === '') {
        location.href = '';
        return;
      }

      var promotion_id = getParameterByName('promotion_id',location.href);
      $('.logoutBtn').show();
      $('.userName').empty();
      $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
      $('#proDetailsDiv').empty();

      var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_prom_det&prom_id='+promotion_id+'&is_restaurant=1';
        $.ajax({
          url : url,
          type : "GET",
          success : function(response){
            var result = JSON.parse(response);
            if(result.success==1){
              var prom_det = result.prom_det;
              $('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='promo_code_resto'> <b>CODE : "+prom_det.prom_code+"</b></div><div class='promotion_details_share_fb_button'><div class='ui-block-a'><button class='ui-btn shareFacebook'><a href='' target='_blank'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='ui-btn emailFriend'><img id='refer_img' src='img/refer.png' style=''></button></div><div class='promo_det_add_promotion'><button class='ui-btn ui-icon-plus ui-btn-icon-notext add_circle_prom_det' id='"+promotion_id+"'></button></div></div></div>");
            }
            addFbLink();
            //addShareFriendLink();
            //$.mobile.changePage("#promotionDetails");
            //location.href = '#promotionDetails?promotion_id='+clickedId;
          },
          error : function(response){
            console.log(response);
          }
        });

        $("#promotionDetails").on('click', '.emailFriend', function () {
            if(localStorage.getItem('userNumber')) {
                $('#friendPhone').val(localStorage.getItem('userNumber'));
            }
            $.mobile.changePage('#shareTextFriend');
        });

        $("#promotionDetails").on('click', '.add_circle_prom_det', function () {
            var promotion_id = sessionStorage.getItem('promotionClickedId');
            var restaurant_id = sessionStorage.getItem('prev_rest');
            var user_phone = localStorage.getItem('userNumber');
            action_to_take = 'promotion';
            callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
        });


        // $('.emailFriend').on('click',function(event){
        //     $.mobile.changePage('#shareTextFriend');
        // });
});

$(document).on("pageshow", "#referFriendLink", function() {
      var promotion_id = getParameterByName('promotion_id',location.href);
      var user_id = getParameterByName('user_id',location.href);
      var number = localStorage.getItem('userNumber');
      if(number == null || number == "") {
        $('.logoutBtn').hide();
      } else {
        $('.logoutBtn').show();
        $('.userName').empty();
        $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
      }
      // $('.userName').empty();
      // $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
      $('#referProDetailsDiv').empty();

      var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_prom_det&prom_id='+promotion_id+'&is_restaurant=1';
        $.ajax({
          url : url,
          type : "GET",
          success : function(response){
            var result = JSON.parse(response);
            if(result.success==1){
              var prom_det = result.prom_det;
              $('#referProDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='promo_code_resto'> <b>CODE : "+prom_det.prom_code+"</b></div></div>");
              //$('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='promo_code_resto'> <b>CODE : "+prom_det.prom_code+"</b></div><div class='promotion_details_share_fb_button'><div class='ui-block-a'><button class='ui-btn shareFacebook'><a href='' target='_blank'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='ui-btn emailFriend'><img id='refer_img' src='img/refer.png' style=''></button></div><div class='promo_det_add_promotion'><button class='ui-btn ui-icon-plus ui-btn-icon-notext add_circle_prom_det' id='"+promotion_id+"'></button></div></div></div>");
            }
            //addFbLink();
            //addShareFriendLink();
            //$.mobile.changePage("#promotionDetails");
            //location.href = '#promotionDetails?promotion_id='+clickedId;
          },
          error : function(response){
            console.log(response);
          }
        });

        $('#referFriendLink').on('click', '#claim_refre_friend', function(){
            var phoneNo = $('#phoneNoRef').val().trim();
            var restopin = $('#restaurentPin').val().trim();
            var phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/g;

            if(phoneNo === null || phoneNo === "") {
              alert('Enter the phone number.');
              return;
            } else if(!phoneRegex.test(phoneNo)) {
              alert('Enter the correct phone number.');
              return;
            } else if(restopin === null || restopin === "") {
              alert('Enter the restaurent pin.');
              return;
            }

            var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=friend_click_refer&promoid='+promotion_id+'&phone='+phoneNo+'&server_pin='+restopin+'&ref_by='+user_id;
            $.ajax({
              url : url,
              type : "GET",
              success : function(response){
                var result = JSON.parse(response);
                if(result.success==1){
                  alert(result.message);
                  localStorage.setItem('userData', JSON.stringify(response.user));
                  localStorage.setItem('userNumber', user_phone);
                  location.reload();
                } else {
                  alert(result.message);
                }
              },
              error : function(response){
                console.log(response);
              }
            });
        });

        // $("#promotionDetails").on('click', '.emailFriend', function () {
        //     if(localStorage.getItem('userNumber')) {
        //         $('#friendPhone').val(localStorage.getItem('userNumber'));
        //     }
        //     $.mobile.changePage('#shareTextFriend');
        // });

        // $("#promotionDetails").on('click', '.add_circle_prom_det', function () {
        //     var promotion_id = sessionStorage.getItem('promotionClickedId');
        //     var restaurant_id = sessionStorage.getItem('prev_rest');
        //     var user_phone = localStorage.getItem('userNumber');
        //     action_to_take = 'promotion';
        //     callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
        // });


        // $('.emailFriend').on('click',function(event){
        //     $.mobile.changePage('#shareTextFriend');
        // });
});






$(document).on("pageinit", "#shareTextFriend", function() {
    $(document).on('click','#send_text_friend',function(){
        var phone = $('#friendPhone').val().trim()
        var newregex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/g;
        if(phone == null || phone == '') {
          $('#friendPhone').addClass('error');
          return;
        } else if (!newregex.test(phone)){
          $('#friendPhone').addClass('error');
          return;
        }
        var restaurant_id = sessionStorage.getItem('prev_rest');
        var promotion_id = sessionStorage.getItem('promotionClickedId');
        var action_to_take = 'refer_friend';
        var user_phone = phone;
        var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=new_refer_friend&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&action_to_take='+action_to_take;
        $.ajax({
          url: url,
          type: 'GET',
          success: function(result) {
            var response = JSON.parse(result);
            if (response.success == 1) {
              $('.logoutBtn').show();
              var number = localStorage.getItem('userNumber');
              if(number === null || number === "") {
                alert('Logged in successfully'+response.message);
                $('#shareTextFriend').dialog('close');
                location.reload();
              } else {
                alert(response.message);
                $('#shareTextFriend').dialog('close');
                location.reload();
              }
              localStorage.setItem('userData', JSON.stringify(response.user));
              localStorage.setItem('userNumber', user_phone);
              $('.userName').empty();
              $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
            } else {
              alert(response.message);
            }
          },
          error: function(result) {
            console.log(result);
          }
        });
    });
});

function addFbLink()
{
      var rest_id = sessionStorage.getItem('prev_rest');
      var prom_id = sessionStorage.getItem('promotionClickedId');
      var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_fb_share&prom_id='+prom_id+'&is_restaurant='+rest_id;
      $.ajax({
        url: url,
        type: 'GET',
        success: function(result) {
          var response = JSON.parse(result);
          if (response.success == 1) {
            //alert(response.message);
            //window.open(response.fb_share_lnk, '_blank');
            $('.shareFacebook a').attr('href',response.fb_share_lnk);
          } else {
            alert(response.message);
          }
        },
        error: function(result) {
          console.log(result);
        }
      });
}


function addMyPromoShareLink(rest_id,promo_id)
{
  var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_fb_share&prom_id='+promo_id+'&is_restaurant='+rest_id;
      $.ajax({
        url: url,
        type: 'GET',
        success: function(result) {
          var response = JSON.parse(result);
          if (response.success == 1) {
            $('#shareMyPromo_'+promo_id+' a').attr('href',response.fb_share_lnk);
          } else {
            alert(response.message);
          }
        },
        error: function(result) {
          console.log(result);
        }
      });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function getFormattedDate(dateValue) {
  var newDate = new Date(dateValue);
  var day = newDate.getDate();
  var month = newDate.getMonth() + 1;
  var year = newDate.getYear() + 1900;
  return day + '/' + month + '/' + year;
}
