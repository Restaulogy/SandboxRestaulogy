$(document).ready(function() { //var activePage;
  var activePage = $.mobile.activePage.attr('id');
  if (activePage == 'restology') {
    getRestarents();
  } else if (activePage == 'signupPage') {
    var number = localStorage.getItem('userNumber');
    $.mobile.navigate("#restology", {
      transition: "slide"
    });
  }
  var number = localStorage.getItem('userNumber');
  if (number == null || number == '') {
    $('#logoutBtn').hide();
  } else {
    $('#logoutBtn').show();
  }

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
            $("#restaurentList").append("<li><div class='card rest-item'><img class='rest-img' src='" +
              restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><p class='rest-name'>" +
              restObj.restaurent_name + "</p><label class = 'rest-address'>" +
              restObj.restaurent_address + "</label><hr><div class='ui-grid-a'><div class='ui-block-a'><button class='ui-btn promoBtn' id='" +
              restObj.restaurent_id + "'>Promotions</button></div><div class='ui-block-b'><button class='ui-btn rewardBtn' id='" +
              restObj.restaurent_id + "'>Rewards</button></div></div><div style='diplay:none' class='listing' id='listing_" +
              restObj.restaurent_id + "'></div></div></li>");
          });
          $('.promoBtn').unbind('click');
          $('.promoBtn').click(function() {
            $('.listing').hide();
            var rest_id = $(this).attr('id');
            // alert(rest_id);
			$('#listing_' + rest_id).show();
              $('#listing_' + rest_id).empty();
            var number = localStorage.getItem('userNumber');
            if (number == null || number == '') {
              
              // $('#listing_' + rest_id).append('<button class="ui-btn btn-login">Login</button>');
              // $('.btn-login').unbind('click');
              // $('.btn-login').click(function() {
                // $('#login-modal').show();
              // });
			  $('#login-modal').show();
            } else {
              var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=prom_listing&listing_type=all&&is_restaurant=1';
              $.ajax({
                url: url,
                type: 'GET',
                success: function(result) {
                  console.log(result);
				  $('#listing_' + rest_id).append('No Promotions');
                },
                error: function(result) {
                  console.log(result);
				  $('#listing_' + rest_id).append('No Promotions');
                }
              });
            }
          })
		  
		  $('.rewardBtn').unbind('click');
          $('.rewardBtn').click(function() {
            $('.listing').hide();
            var rest_id = $(this).attr('id');
            // alert(rest_id);
            var number = localStorage.getItem('userNumber');
            if (number == null || number == '') {
				$('#login-modal').show();
              // $('#listing_' + rest_id).show();
              // $('#listing_' + rest_id).empty();
              // $('#listing_' + rest_id).append('<button class="ui-btn btn-login">Login</button>');
              // $('.btn-login').unbind('click');
              // $('.btn-login').click(function() {
                // $('#login-modal').show();
              // });
            } else {
				$('#listing_' + rest_id).show();
              $('#listing_' + rest_id).empty();
              var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=rest_rewards&restaurant_id='+rest_id;
              $.ajax({
                url: url,
                type: 'GET',
                success: function(result) {
                  console.log(result);
				  var response=JSON.parse(result);
				  if(response.success==1){
					  if(response.reward_list.length==0){
						  $('#listing_' + rest_id).append('No rewards');
					  }
					  for(var i=0;i<response.reward_list.length;i++){
						  var rewardItem=response.reward_list[i];
						   $('#listing_' + rest_id).append('<ul data-role="listview" data-icon="false" class="restaurentList" id="restaurentList'+rewardItem.rwd_id+'"><li><div><div class="img-icon"><img src="img/default.jpg"></div><div class="rew-div"><p>'+rewardItem.prom_title+'</p></div></div></li></ul>');
					  }
					 
				  }else{
					  $('#listing_' + rest_id).append('No rewards');
				  }
                },
                error: function(result) {
                  console.log(result);
				  $('#listing_' + rest_id).append('No rewards');
                }
              });
            }
          })
        }
      },
      error: function(result) {
        console.log(result);
      }
    })
  }
  $('#btn_login').click(function() {
    $('#uname').removeClass('error');
    var username = $('#uname').val().trim();
    if (username == null || username == "") {
      $('#uname').addClass('error');
      return;
    }
    var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=login&email='+username+'&is_restaurant=1';
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        console.log(result);
      },
      error: function(result) {
        console.log(result);
      }
    })
  });

  function isEmpty(el) {
    return !$.trim(el.html())
  }
  $('#btn_SignUp').click(function() {
    $('input').removeClass('error');
    var phoneNumber = $('#phoneNumber').val().trim();
    var emailId = $('#emailId').val().trim();
    var fname = $('#fname').val().trim();
    var lname = $('#lname').val().trim();
    var dob = $('#userDOB').val().trim();
    var dob_date = '';
    var dob_mnth = '';
    var anniversaryDate = $('#anniversaryDate').val().trim();
    if (phoneNumber == null || phoneNumber == "") {
      $('#phoneNumber').addClass('error');
      return;
    } else if (fname == null || fname == "") {
      $('#fname').addClass('error');
      return;
    } else if (lname == null || lname == "") {
      $('#lname').addClass('error');
      return;
    }
    if (dob != null || dob != "") {
      var date = new Date(dob);
      dob_date = date.getDate();
      dob_mnth = date.getMonth() + 1;
    }
    var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=register&fname=' + fname + '&lname=' + lname + '&email=' + emailId + '&phone=' + phoneNumber + '&cust_dob_day=' + dob_date + '&cust_dob_mon=' + dob_mnth + '&cust_aniversary_dt=' + anniversaryDate + '&is_restaurant=1';
    console.log(url);
    $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
        console.log(result);
        var responseData = JSON.parse(result);
        if (responseData.success == 1) {
          localStorage.setItem('userData', JSON.stringify(responseData.user));
          localStorage.setItem('userNumber', phoneNumber);
          $.mobile.navigate("#restology", {
            transition: "slide"
          });
        } else {
          alert(responseData.message);
        }
      },
      error: function(result) {
        console.log(result);
        alert('Something is wrong, try later!');
      }
    })
  });
})