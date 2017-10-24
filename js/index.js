$(document).ready(function() {
  var isRewardClicked = false;
  var isPromotionClicked = false;
  var number = localStorage.getItem('userNumber');
  if (number == null || number == '') {
    $('#logoutBtn').hide();
  } else {
    $('#logoutBtn').show();
  }
  //$('#login-modal').modal();
  $('#btn_login').click(function() {
    $('#uname').removeClass('error');
    var username = $('#uname').val().trim();
    if (username == null || username == "") {
      $('#uname').addClass('error');
      return;
    }
    var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=login&email=' + username + '&is_restaurant=1';
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        var responseData = JSON.parse(result);
        if (responseData.success == 1) {
          localStorage.setItem('userData', JSON.stringify(responseData.user));
          localStorage.setItem('userNumber', username);
          // $.mobile.navigate("#restology", {
          // transition: "slide"
          // });
          location.href = 'index.html';
        } else {
          alert(responseData.message);
        }
      },
      error: function(result) {
        console.log(result);
      }
    })
  });
  getRestarents();

  function getRestarents() {
    var url = 'http://restaulogy.com/restaurant_in/service/service_restaurant.php?tag=restaurant_listing';
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        console.log(result);
        var jsonObj = JSON.parse(result);
        if (jsonObj.success == 1) {
          jQuery.each(jsonObj.rest_list, function(i, val) {
            console.log(val);
            var restObj = val;
            $("#restaurentList").append("<div class='col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-offset-2 col-lg-8'><div class='card'><img class='rest-img' src='" +
              restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><p class='rest-name'>" +
              restObj.restaurent_name + "</p><label class = 'rest-address'>" +
              restObj.restaurent_address + "</label><hr><div class='row'><div class='col-xs-6 col-sm-6 col-md-6'><button class='btn btn-default promoBtn' id='" +
              restObj.restaurent_id + "'>Promotions</button></div><div class='col-xs-6 col-sm-6 col-md-6'><button class='btn btn-default rewardBtn' id='" +
              restObj.restaurent_id + "'>Rewards</button></div></div><div style='diplay:none' class='list_div'><ul class='list-group listing' id='listing_" +
              restObj.restaurent_id + "'></ul></div></div></div>");
          });
          $('.promoBtn').unbind('click');
          $('.promoBtn').click(function() {
            $('#list_div').hide();
            $('.listing').hide();
            $('.listing').empty();
            var rest_id = $(this).attr('id');
            var number = localStorage.getItem('userNumber');
            if (number == null || number == '') {
              $('#login-modal').modal();
            } else {
              if (!isPromotionClicked) {
                isPromotionClicked = true;
                $('#listing_' + rest_id).show();
                $('#listing_' + rest_id).empty();
                var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=prom_listing&listing_type=all&&is_restaurant=' + rest_id;
                $.ajax({
                  url: url,
                  type: 'GET',
                  success: function(result) {
                    console.log(result);
                    var response = JSON.parse(result);
                    if (response.success == 1) {
                      if (response.prom_list.length == 0) {
                        $('#listing_' + rest_id).append('No Promotions');
                      }
                      for (var i = 0; i < response.prom_list.length; i++) {
                        var promoItem = response.prom_list[i];
                        if (promoItem.hasOwnProperty("user_promotion")) {
                          var user_promotion = promoItem.user_promotion;
                          for (var j = 0; j < user_promotion.length; j++) {
                            var user_promotion_item = user_promotion[j];
                            var startDate = getFormattedDate(user_promotion_item.start_date);
                            var endDate = getFormattedDate(user_promotion_item.end_date);
                            var message = 'Valid from ' + startDate + ' till ' + endDate;;
                            $('#listing_' + rest_id).append('<li class="list-group-item outer-container" id="restaurentList' + user_promotion_item.id + '"><div class="row inner-container"><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2 img-icon"><img id="img_' + j + '" src="img/default.jpg" class="img-circle"></div><div class="col-xs-7 col-sm-8 col-md-8 col-lg-8"><div class="row pro_title">' +
                              user_promotion_item.title + '</div><div class="pro_desc" style="color:#909090">' + user_promotion_item.stripped_comments + '</div><div class="message">' + message + '</div></div><div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><button class="btn add_circle" id="' +
                              user_promotion_item.id + '"><span class="glyphicon glyphicon-plus"></span></button></div></div></li>');
                            if (user_promotion_item.img_ext != '0') {
                              $('#img_' + j).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + user_promotion_item.id + '.' + user_promotion_item.img_ext);
                            } else {
                              $('#img_' + j).attr('src', promoItem.restaurant_logo);
                            }
                          }
                        }
                      }
                      $('.add_circle').unbind('click');
                      $('.add_circle').click(function() {
                        var clickedId = $(this).attr('id');
                        console.log(clickedId);
                        var userData = JSON.parse(localStorage.getItem('userData'));
                        var userId = userData.id;
                        var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=add_to_favorite_prom&user_id=' + userId + '&prom_id=' + clickedId;
                        console.log(url);
                        $.ajax({
                            url: url,
                            type: 'GET',
                            success: function(result) {
                              console.log(result);
                              var response = JSON.parse(result);
							  if(response.success==1){
								  alert(response.message);
							  }else{
								  alert(response.message);
							  }
                            },
                            error: function(result) {
                              console.log(result);
                            }
                          });
                      })
					 
					 
					 
                    } else {
                      $('#listing_' + rest_id).append('No Promotions');
                    }
                    // $('#listing_' + rest_id).append('No Promotions');
                  },
                  error: function(result) {
                    console.log(result);
                    $('#listing_' + rest_id).append('No Promotions');
                  }
                });
              } else {
                isPromotionClicked = false;
                $('.listing').hide();
                $('#listing_' + rest_id).hide()
              }
            }
          })
          $('.rewardBtn').unbind('click');
          $('.rewardBtn').click(function() {
            $('#list_div').hide();
            $('.listing').hide();
            var rest_id = $(this).attr('id');
            // alert(rest_id);
            var number = localStorage.getItem('userNumber');
            if (number == null || number == '') {
              $('#login-modal').modal();
            } else {
              if (!isRewardClicked) {
                isRewardClicked = true;
                $('#listing_' + rest_id).show();
                $('#listing_' + rest_id).empty();
                var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=rest_rewards&restaurant_id=' + rest_id;
                $.ajax({
                  url: url,
                  type: 'GET',
                  success: function(result) {
                    console.log(result);
                    var response = JSON.parse(result);
                    if (response.success == 1) {
                      if (response.reward_list.length == 0) {
                        $('#listing_' + rest_id).append('No rewards');
                      }
                      for (var i = 0; i < response.reward_list.length; i++) {
                        var rewardItem = response.reward_list[i];
                        $('#listing_' + rest_id).append('<li class="list-group-item outer-container" id="restaurentList' + rewardItem.rwd_id + '"><div class="row inner-container"><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2 img-icon"><img src="img/default.jpg" class="img-circle" id="img_'+i+'"></div><div class="col-xs-7 col-sm-8 col-md-8 col-lg-8"><div class="row pro_title">' + rewardItem.prom_title + '</div><div class="row pro_desc">' + rewardItem.comments + '</div></div><div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><button class="btn add_circle" id="add_' + rewardItem.rwd_id + '"><span class="glyphicon glyphicon-plus"></span></button></div></div></li>');
                        if (rewardItem.img_ext != '0') {
                          $('#img_' + i).attr('src', 'http://restaulogy.com/restaurant_in/modules/business_listing/promotion_images/' + rewardItem.rwd_id + '.' + rewardItem.img_ext);
                        } else {
                          $('#img_' + i).attr('src', restObj.restaurent_img_url);
                        }
                      }
                      $('.add_circle').unbind('click');
                      $('.add_circle').click(function() {
                        var clickedId = $(this).attr('id');
                        console.log(clickedId);
						var userData = JSON.parse(localStorage.getItem('userData'));
                        var userId = userData.id;
						var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=add_reward_pts&auth_id='+userId+'&table_id='+clickedId+'&chkin_points={reward_points}&chkin_amount={reward_amount}&cust_server_pin={Server_pin}&chkin_invoice={chkin_invoice} ';
                      })
                    } else {
                      $('#listing_' + rest_id).append('No rewards');
                    }
                  },
                  error: function(result) {
                    console.log(result);
                    $('#listing_' + rest_id).append('No rewards');
                  }
                });
              } else {
                isRewardClicked = false;
                $('.listing').hide();
                $('#listing_' + rest_id).hide()
              }
            }
          })
        }
      },
      error: function(result) {
        console.log(result);
      }
    })
  }

  function getFormattedDate(dateValue) {
    var newDate = new Date(dateValue);
    var day = newDate.getDay();
    var month = newDate.getMonth() + 1;
    var year = newDate.getYear();
    return day + '/' + month + '/' + year;
  }
  
  $('#logoutBtn').click(function(){
	  localStorage.clear();
	  sessionStorage.clear();
	  alert('Logout Successfully ');
	  location.reload();
  });
  
  $('#menuReward').click(function(){
	  var userNumber = localStorage.getItem('userNumber');
	  if(userNumber==null||userNumber==''){
		  $('login-modal').modal();
	  }else{
		  location.href = 'myRewards.html' ;
	  }
	  
  })
  
  $('#menuPromotions').click(function(){
	  var userNumber = localStorage.getItem('userNumber');
	  if(userNumber==null||userNumber==''){
		  $('login-modal').modal();
	  }else{
		  location.href = 'myRewards.html' ;
	  }
	  
  })
})