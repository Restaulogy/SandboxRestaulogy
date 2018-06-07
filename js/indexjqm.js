var isRewardClicked = false;
var isPromotionClicked = false;
var number = localStorage.getItem('userNumber');

if (number == null || number == '') {
  $('.logoutBtn').hide();
} else {
  $('.logoutBtn').show();
}

function handleAjaxError(jqXHR, textStatus, errorThrown) {    
    if (jqXHR.status === 0) {
        //alert('Not connect.Verify Network.');
    } else if (jqXHR.status == 404) {
        alert('Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        alert('Internal Server Error [500].');
    } else if (textstatus === 'parsererror') {
        alert('Requested JSON parse failed.');
    } else if (textstatus === 'timeout') {
        alert('Time out error.');
    } else if (textstatus === 'abort') {
        alert('Ajax request aborted.');
    } else {
        alert('Uncaught Error.\n' + jqXHR.responseText + '::' + errorThrown );
    }    
   /* 
   //alert('<p>status code: '+jqXHR.status+'</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>'+jqXHR.responseText + '</div>');
   if(jqXHR.status>0 && errorThrown!=""){
		alert('status code: '+jqXHR.status+' ---- errorThrown: ' + errorThrown + '---jqXHR.responseText:'+jqXHR.responseText + '.');
	}    
	*/
}


function nl2br(str, is_xhtml){   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

function getUsrLocation() {	
	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) { 
          	sessionStorage.setItem('user_lat',position.coords.latitude);
			sessionStorage.setItem('user_long',position.coords.longitude);
			//alert(position.coords.latitude + '-' + position.coords.longitude);
			$('#spnGeoLocDetect').empty();
          }, function() {
            //handleLocationError(true, infoWindow, map.getCenter());
            //alert("Geolocation is not supported by this browser.");
            $('#spnGeoLocDetect').html("Geolocation is not supported by this browser.");
            sessionStorage.setItem('user_lat',_WEB_LAT);
			sessionStorage.setItem('user_long',_WEB_LONG);
          });
    }else{
      //Browser doesn't support Geolocation
      //handleLocationError(false, infoWindow, map.getCenter());
      $('#spnGeoLocDetect').html("Geolocation is not supported by this browser.");
      sessionStorage.setItem('user_lat',_WEB_LAT);
	  sessionStorage.setItem('user_long',_WEB_LONG);
    }        
    /*if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";   
        alert("Geolocation is not supported by this browser.");     
    }*/
}
function showPosition(position) {
	sessionStorage.setItem('user_lat',position.coords.latitude);
	sessionStorage.setItem('user_long',position.coords.longitude);
}
//alert('hello');
getUsrLocation();
// Load the spinner if an ajaxStart occurs; stop when it is finished
$(document).on({
  ajaxStart: function() { 
    //$.mobile.loading('show');
    NProgress.start();
  },
  ajaxStop: function() {
    //$.mobile.loading('hide');
    NProgress.done();
  }    
});

$(document).on("pageshow", "#loginDialog", function() {
  $('#btn_login').click(function() {
    $('#uname').removeClass('error');
    var username = $('#uname').val().trim();
    if (username == null || username == "") {
      $('#uname').addClass('error');
      return;
    }
    //doLogin(username);
    var promotion_id = sessionStorage.getItem('clickedId');
    var restaurant_id = sessionStorage.getItem('prev_rest');
    var action_to_take = 'reward';
    
    if(promotion_id === null || promotion_id === "") {
    	doLogin(username);
    }else{
    	//alert('promotion_id='+restaurant_id);
		SAN_LOGIN(promotion_id,username,restaurant_id,action_to_take);
	}    

  });
});

//To select country name
function selectCountry(val) {
	$("#search-box").val(val);
	$("#suggesstion-box").hide();
}

$(document).on("pageinit", "#restologyPage", function() {
  
  	
  $(".ui-input-clear").on("click", function (e) {
    //getRestarents();
    location.href=_APP_REL_PTH;
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
    //getRestarents();
  })
    
  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
    $('.userName').empty();
    try{
		$('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
	}catch(e){
		
	}
  }
  
  getRestLocations();
  //..Check the selected location
  var usr_area = getParameterByName('area',location.href) ? getParameterByName('area',location.href) : '';
  if(usr_area!=""){
  	$("#autocomplete-input").val(usr_area);
  	$("#spnLocFilt").html("To check all restaurants remove selected location.");
  	//$('#rest_loc_list li a').trigger('click');
  }else{
  	//alert('IN');
  	$("#autocomplete-input").val('');
  	$("#spnLocFilt").empty();
  }
  getRestarents(usr_area);   
  	
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

  var promotion_id = getParameterByName('promotion_id',location.href) ? getParameterByName('promotion_id',location.href) : sessionStorage.getItem('clickedId');
  var restaurant_id = getParameterByName('restaurent_id',location.href) ? getParameterByName('restaurent_id',location.href) : sessionStorage.getItem('clickedRest');
  var user_phone = phoneNo;

  if(sessionStorage.getItem('addingKey')==='promotion') {
    action_to_take = 'promotion';
  } else if(sessionStorage.getItem('addingKey')==='rewards') {
    action_to_take = 'reward';
  } else {
    action_to_take = 'refer_friend';
  }

  // if(promotion_id == null || promotion_id == ""){
  //     promotion_id = 27;
  //     action_to_take = 'reward';
  // }

  // if(restaurant_id == null || restaurant_id == "") {
  //   restaurant_id = 10;
  // }

  callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
}

//..function to check if user exists in system
function _is_user_exist_in_sys(username,promotion_id,restaurant_id,action_to_take){
	var url = _WEBSRV_PTH+'service/service_login.php?tag=get_user_ids_by_phone&phone='+username;
	var addingKey = sessionStorage.getItem('addingKey');	
	var showDetls=sessionStorage.getItem('showDet');
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {        
        var responseData = JSON.parse(result);
        if (responseData.success == 1) {
          console.log('Already member..in success-'+responseData.success);
          $('#tmp_is_val').val(0);
          $('#fullname').val('');
          $('#div_custNm').hide();
          if(promotion_id!=null && promotion_id>0 && restaurant_id!=null && restaurant_id>0){
          		console.log('1.showDetls='+showDetls+' || addingkey='+ addingKey);
				if(addingKey=='promotion'){
					_cm_callSignupLoginWebservice(promotion_id,username,restaurant_id,'promotion'); 
					console.log('2.showDetls='+showDetls+' || addingkey='+ addingKey);
					if(showDetls != null && showDetls == 1){
						setTimeout(function(){
							location.href = '#promotionDetails?restaurent_id='+restaurant_id+'&promotion_id='+promotion_id; 
						},1000);//debugger;
			            //location.reload(); 	
			            sessionStorage.setItem('showDet',0);
			            //return;		            
					}
				}else{
					_cm_callSignupLoginWebservice(promotion_id,username,restaurant_id,'reward');
				}			
			}else{
				console.log('33.showDetls='+showDetls+' || addingkey='+ addingKey +' || promotion_id='+ promotion_id + ' || restaurant_id='+ restaurant_id );
				_cm_callSignupLoginWebservice(27,username,1,'reward');
			}			
			return;                 
          
        } else {
          console.log('New member..in fail-'+responseData.success);          
          //alert('You are new a customer, please provide the name');
		  $('#fullname').val('');
		  $('#tmp_is_val').val(1);
		  $('#div_custNm').show();
          //return 0;
        }
      },
      error: handleAjaxError
    });
}

//..START..SAN ..07/02/2018
//..Sangram function to sign to all rest 
function hideShowSignAllBtn(){	
	var usr_det = localStorage.getItem('userData');
	alert(usr_det);
	if((JSON.parse(usr_det).rest_sign_up == 'RA') || (JSON.parse(usr_det).rest_sign_up == 'DA')){		
    	$('#SignUpAllText').hide();		
	}else{
		$('#SignUpAllText').show();		
	} 
}
function signToAllRests(){
    var number = localStorage.getItem('userNumber');
    var usr_det = localStorage.getItem('userData');     
    //var usr_nm = JSON.parse(localStorage.getItem('userData')).full_name;  	
    if(number === null || number === ""){   
    	sessionStorage.setItem('signup_all_rest_pop_up',true);
        $.mobile.changePage("#commonLoginSignup_1");
    } else {  
    	$('#SignUpAllText').hide();	
    	setTimeout(function(){
			_websrv_sign_to_all_rest(number,JSON.parse(usr_det).full_name);
		},2500);//debugger; 
    }     
}
   
function _websrv_sign_to_all_rest(user_phone,username) {
  var url = "";
  var name = username;
  var action_to_take = '';
  if(name !== "" && name !== null) {
    var res = name.split(" ");
    var fname = res[0] ? res[0] : '';
    var lname = res[1] ? res[1] : '';
    url = _WEBSRV_PTH+'service/service_promotion.php?tag=sign_to_all_rests&phone='+user_phone+'&fname='+fname+'&lname='+lname;
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        var response = JSON.parse(result);
        if (response.success == 1) {
          var number = localStorage.getItem('userNumber');
          var logged_in = true;
          if(number === null || number === "") {
            sessionStorage.setItem('signup_all_rest_pop_up',false);
            $('.logoutBtn').show();            
            logged_in = false;
          } else {
            logged_in = true;
          }
          //alert(response.message);
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userNumber', user_phone);
    
          $('.userName').empty();
          $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);       
          
        } else {
          alert(response.message);
        }
      },
      complete: function(xhr, textStatus) {
      	$('#SignUpAllText').hide(); 
        location.href="#MyRewardPage";
        location.reload(); 
        console.log(xhr.status);
      },
      error: handleAjaxError
    })
  }
}
//..END..SAN ..07/02/2018

function callSignupLoginWebservice_referal_program(promotion_id,user_phone,restaurant_id,referal_name,username) {
  var url = "";
  var name = username;
  var action_to_take = '';
  if(name !== "" && name !== null) {
    var res = name.split(" ");
    var fname = res[0] ? res[0] : '';
    var lname = res[1] ? res[1] : '';
    url = _WEBSRV_PTH+'service/service_promotion.php?tag=AddRefBy&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&fname='+fname+'&lname='+lname+'&action_to_take=reward&ReferredBy='+referal_name;
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        var response = JSON.parse(result);
        if (response.success == 1) {
          var number = localStorage.getItem('userNumber');
          var logged_in = true;
          if(number === null || number === "") {
            sessionStorage.setItem('referal_program',false);
            $('.logoutBtn').show();
            alert(response.message);
            logged_in = false;
          } else {
            logged_in = true;
          }
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userNumber', user_phone);
          //console.log(JSON.parse(localStorage.getItem('userData')).full_name);
          $('.userName').empty();
          $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
          //hideShowSignAllBtn();

          location.href="#MyRewardPage";
          location.reload();
          // if(action_to_take === 'promotion') {
          //   addPromotionLogin(promotion_id,logged_in);
          // } else if(action_to_take === 'reward') {
          //   setTimeout(function(){addReward(promotion_id,logged_in);},200);
          // }
        } else {
          alert(response.message);
        }
      },
      error: handleAjaxError
    });
  }
}

//..New common login service..san
function _cm_callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take) {

  var name = $('#fullname_1').val().trim() ? $('#fullname_1').val().trim() : '';
  var url = "";
  var showDetls=sessionStorage.getItem('showDet');
  var isSignAll=sessionStorage.getItem('signup_all_rest_pop_up');

  var _srv_act="new_refer_friend";	
 /* if(isSignAll !== null && isSignAll){
  	 _srv_act="sign_to_all_rests";
  }*/	

  if(name !== "" && name !== null) {
    var res = name.split(" ");
    var fname = res[0] ? res[0] : '';
    var lname = res[1] ? res[1] : '';
    url = _WEBSRV_PTH+'service/service_promotion.php?tag='+_srv_act+'&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&fname='+fname+'&lname='+lname+'&action_to_take='+action_to_take;
  } else {
    url = _WEBSRV_PTH+'service/service_promotion.php?tag='+_srv_act+'&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&action_to_take='+action_to_take;
  }
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        var response = JSON.parse(result);
        if (response.success == 1) {
          var number = localStorage.getItem('userNumber');
          var logged_in = true;
          if(number === null || number === "") {
            if(!sessionStorage.getItem('referal_program') && !sessionStorage.getItem('reward_promotion_pop_up')){
              $('#commonLoginSignup').dialog('close');
            }            
			
            if(sessionStorage.getItem('reward_promotion_pop_up')) {
              $('#commonLoginSignup_1').dialog('close');
            }
            if(sessionStorage.getItem('signup_all_rest_pop_up')) {
              $('#commonLoginSignup_1').dialog('close');
            }
            sessionStorage.setItem('signup_all_rest_pop_up',false);
            sessionStorage.setItem('reward_promotion_pop_up',false);
            sessionStorage.setItem('referal_program',false);
            $('.logoutBtn').show();
            logged_in = false;
          } else {
            logged_in = true;
          }
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userNumber', user_phone);
          //hideShowSignAllBtn();
          console.log(JSON.parse(localStorage.getItem('userData')).full_name);
          $('.userName').empty();
          $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
          console.log('userNumber:'+localStorage.getItem('userNumber'));
          //alert('showDetls='+showDetls+'||restaurant_id='+restaurant_id+'|promotion_id'+promotion_id);
          console.log('showDetls='+showDetls+'||restaurant_id='+restaurant_id+'|promotion_id'+promotion_id);
          
          if(showDetls == 1 && restaurant_id>0 && promotion_id>0){ 
        
		  }else{
		  	  if(action_to_take === 'promotion') {
	            addPromotionLogin(promotion_id,logged_in);
	          }else if(action_to_take === 'reward') {
	            setTimeout(function(){addReward(promotion_id,logged_in);},200);
	          }
		  }        
          //return;		  
        } else {
          alert(response.message);
        }
      },
      error: handleAjaxError
    });
}

function callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take) {

  var name = $('#fullname').val().trim() ? $('#fullname').val().trim() : $('#referalFullname').val().trim();
  var url = "";
  if(name !== "" && name !== null) {
    var res = name.split(" ");
    var fname = res[0] ? res[0] : '';
    var lname = res[1] ? res[1] : '';
    url = _WEBSRV_PTH+'service/service_promotion.php?tag=new_refer_friend&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&fname='+fname+'&lname='+lname+'&action_to_take='+action_to_take;
  } else {
    url = _WEBSRV_PTH+'service/service_promotion.php?tag=new_refer_friend&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&action_to_take='+action_to_take;
  }
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        var response = JSON.parse(result);
        if (response.success == 1) {
          var number = localStorage.getItem('userNumber');
          var logged_in = true;
          if(number === null || number === "") {
            if(!sessionStorage.getItem('referal_program') && !sessionStorage.getItem('reward_promotion_pop_up')){
              $('#commonLoginSignup').dialog('close');
            }

            if(sessionStorage.getItem('reward_promotion_pop_up')) {
              $('#commonLoginSignup_1').dialog('close');
            }
            sessionStorage.setItem('reward_promotion_pop_up',false);
            sessionStorage.setItem('referal_program',false);
            $('.logoutBtn').show();
            logged_in = false;
          } else {
            logged_in = true;
          }
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userNumber', user_phone);
          //hideShowSignAllBtn();
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
      error: handleAjaxError
    });
}


function SAN_LOGIN(promotion_id,user_phone,restaurant_id,action_to_take) {

  var name = 'Guest User';//;$('#fullname').val().trim();
  var url = "";
  if(name !== "" && name !== null) {
    var res = name.split(" ");
    var fname = res[0] ? res[0] : 'Guest';
    var lname = res[1] ? res[1] : 'User';
    url = _WEBSRV_PTH+'service/service_promotion.php?tag=new_refer_friend&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&fname='+fname+'&lname='+lname+'&action_to_take='+action_to_take;
  } else {
    url = _WEBSRV_PTH+'service/service_promotion.php?tag=new_refer_friend&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&action_to_take='+action_to_take;
  }
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
      	$('.logoutBtn').show();
        var response = JSON.parse(result);
        if (response.success == 1) {
          alert(response.message);
          //$('#loginDialog').dialog('close');
          /*var number = localStorage.getItem('userNumber');
          var logged_in = true;
          if(number === null || number === "") {
            //$('#commonLoginSignup').dialog('close');
            //$('.logoutBtn').show();
            logged_in = false;
          } else {
            logged_in = true;
          }*/
          var registeredRest = localStorage.getItem('registeredRest');
          if (registeredRest == undefined) {
            registeredRest = [];
          } else {
            registeredRest = JSON.parse(registeredRest);
          }
          registeredRest.push(restaurant_id);
          localStorage.setItem('registeredRest', JSON.stringify(registeredRest));

          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userNumber', user_phone);
          //console.log(JSON.parse(localStorage.getItem('userData')).full_name);
          //$('.userName').empty();
          //$('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
          //if(sessionStorage.getItem('addingKey') == 'promotion') {
            location.href = '#promotionDetails?restaurent_id='+restaurant_id+'&promotion_id='+promotion_id;
            location.reload();
          //}
          
          /*
          if(sessionStorage.getItem('addingKey') == 'promotion') {
            location.href = '#promotionDetails?restaurent_id='+restaurant_id+'&promotion_id='+promotion_id;
            location.reload();
          }
          */
        } else {
          alert(response.message);
           $('.logoutBtn').hide();
        }
      },
      error: handleAjaxError
    });
}

function doLogin(username) {
  var rest_id = sessionStorage.getItem('clickedRest');
  if(rest_id) {
    var url = _WEBSRV_PTH+'service/service_login.php?tag=login&email=' + username + '&table_id=&is_restaurant=' + rest_id;
      $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
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
          //hideShowSignAllBtn();
        } else {
          alert(responseData.message);
          $('.logoutBtn').hide();
        }
      },
      error: handleAjaxError
    })
  } else {
    var url = _WEBSRV_PTH+'service/service_login.php?tag=get_user_ids_by_phone&phone='+username;
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        $('.logoutBtn').show();
        var responseData = JSON.parse(result);
        if (responseData.success == 1) {
          alert('Logged in Successfully');
          localStorage.setItem('userData', JSON.stringify(responseData.user_ids[Object.keys(responseData.user_ids)[0]]));
          localStorage.setItem('userNumber', username);
          $('#loginDialog').dialog('close');
          // var changeTo = sessionStorage.getItem('changeTo');
          //location.reload();
          $('.userName').empty();
          $('.userName').append(JSON.stringify(localStorage.getItem('userData')).full_name);
          if(sessionStorage.getItem('addingKey') == 'promotion') {
            location.href = '#promotionDetails?restaurent_id='+sessionStorage.getItem('prev_rest')+'&promotion_id='+sessionStorage.getItem('promotionClickedId');
            location.reload();
          }
        } else {
          alert(responseData.message);
          $('.logoutBtn').hide();
        }
      },
      error: handleAjaxError
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
  var url = _WEBSRV_PTH+'service/service_login.php?tag=register&fname=' + fname + '&lname=' + lname + '&email=' + emailId + '&phone=' + phoneNumber + '&cust_dob_day=' + dob_date + '&cust_dob_mon=' + dob_mnth + '&cust_aniversary_dt=' + anniversaryDate + '&is_restaurant=' + rest_id;
  $.ajax({
    url: url,
    type: 'GET',
    headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
    },
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
        //hideShowSignAllBtn();
      } else {
        alert(responseData.message);
        $('.logoutBtn').hide();
      }
    },
    error: handleAjaxError
  })
}


$(document).on('pageinit', "#commonLoginSignup_1", function(){
    $('#commonLoginSignup_1').on('click','#send_sign_login_1',function(){
        var newregex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/g;
        var phoneNumber = $('#phoneNo_1').val().trim();
        
        var isNewCust = $('#tmp_is_val').val();
        //..hide customer name div
        //$('#div_custNm').hide();
        var name = $('#fullname_1').val().trim() ? $('#fullname_1').val().trim() : '';
	                    
        if (phoneNumber == null || phoneNumber == "") {
          $('#phoneNo_1').attr('title', 'Enter Number');
          //$('#phoneNumber').tooltip('show');
          $('#phoneNo_1').addClass('error');
          return;
        } else if (!newregex.test(phoneNumber)) {
          $('#phoneNo_1').attr('title', 'Invalid Number');
          $('#phoneNo_1').addClass('error');
          return;
        }
                
        var promotion_id = getParameterByName('promotion_id',location.href) ? getParameterByName('promotion_id',location.href) : sessionStorage.getItem('clickedId');
		var restaurant_id = getParameterByName('restaurent_id',location.href) ? getParameterByName('restaurent_id',location.href) : sessionStorage.getItem('clickedRest');
		var addingKey = sessionStorage.getItem('addingKey');
		console.log('Rest='+restaurant_id+'||Prom='+promotion_id+'||Key '+addingKey)       
		
		var showDetls=sessionStorage.getItem('showDet');
		sessionStorage.setItem('reward_promotion_pop_up',true);
        //..validation
        if (isNewCust == 1) {
    		if (name == "") {	          
	          alert('Plase provide name to proceed');
	          return;
	        }
	        var res = name.split(" ");
		    var fname = res[0] ? res[0] : '';
		    var lname = res[1] ? res[1] : '';
	        
	        if(promotion_id!=null && promotion_id>0 && restaurant_id!=null && restaurant_id>0){
				if(addingKey=='promotion'){
					_cm_callSignupLoginWebservice(promotion_id,phoneNumber,restaurant_id,'promotion');
					if(showDetls != null && showDetls == 1){
						setTimeout(function(){
							//console.log('i m n');
							location.href = '#promotionDetails?restaurent_id='+restaurant_id+'&promotion_id='+promotion_id;
						},4100);//debugger; 	
			            sessionStorage.setItem('showDet',0);
			            //return;		            
					}
				}else{
					_cm_callSignupLoginWebservice(promotion_id,phoneNumber,restaurant_id,'reward');
				}							
			}else{
				_cm_callSignupLoginWebservice(27,phoneNumber,1,'reward');
			}
	        return false;	        
		}
                
        if (isNewCust == 0) {        	
        	_is_user_exist_in_sys(phoneNumber,promotion_id,restaurant_id, addingKey);
        }
         	  
    });
});


$(document).on("pageshow", "#MyRewardPage", function() {
  //hideShowSignAllBtn(); 	
  $('.lnkSignToAllRest').click(function(){  	
      signToAllRests();
  });
  //$.mobile.changePage("#loginDialog");
  var number = localStorage.getItem('userNumber');
  if (number == null || number == '') {
    sessionStorage.setItem('addingKey', 'MyRewardPage');
    //$.mobile.changePage("#loginDialog");
    $.mobile.changePage("#commonLoginSignup_1");
    $('#naviageToSignupBtnDiv').hide();
  } else {
    var rewardsFound = false;
    var userData = JSON.parse(localStorage.getItem('userData'));
    $('#username').html('Welcome ' + userData.first_name);
    var url = _WEBSRV_PTH+'service/service_login.php?tag=get_loyalty_det_new&phone=' + number;
    $.ajax({
      url: url,
      type: "GET",
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        var responseData = JSON.parse(result);
        if (responseData.success == 0) {
            if (responseData.hasOwnProperty("rest_rewards")) {
            var rest_rewards = responseData.rest_rewards;
            var is_claim = 0;
            $("#rewardsList").empty();
            var _show_all_sign_btn=1;
            for (var i = 0; i < rest_rewards.length; i++) {
              rewardsFound = true;
              var rewardObj = rest_rewards[i];
              var reward_claim_url = _WEBSRV_PTH+'user/short_cd_signup.php?rst='+rewardObj.restaurant_info.restaurent_id+'&srt_cd_ph='+$.base64.encode(rewardObj.reward.id);
              var use_cpn_btn="<span class='rewardClaimBtnSapn'><button class='rewardClaimBtn ui-btn ui-icon-audio ui-btn-icon-left'><a target='_blank' href='"+reward_claim_url+"'>Use coupon</a></button></span>";            
              if((rewardObj.reward.rest_sign_up == 'RA') || (rewardObj.reward.rest_sign_up == 'DA') ){
			  	_show_all_sign_btn=0;
			  }
                
              $('#rewardsList').append("<li><img class='restaurent_image' src='" + rewardObj.restaurant_info.restaurent_img_url + 
                "' alt='"+rewardObj.restaurant_info.restaurent_name+"'><h2 class='rest-name'>" +rewardObj.restaurant_info.restaurent_name+ 
                "</h2><p class='rest-address'>"+rewardObj.restaurant_info.restaurent_city_nm+"</p><div class='mypro_desc'> Available Points : <span>" + parseInt(rewardObj.overall_stat.balance_points) + 
                "</span></div><div class='reward_points_information' id='rewardDiv_" + i + "' style='color:#fff'></div></li>");
              var availableRewards = rewardObj.rewards_avail;
              if (availableRewards !=null && availableRewards.length != 0) {
                is_claim = 0;
                var sub_reward_list = '';
                var img_url = '';
                for (var k = 0; k < availableRewards.length; k++) {
                  var item = availableRewards[k];                  
                  if(item.can_claim > 0) {
                    //<ul id='resto_reward_list_"+rewardObj.restaurant_info.restaurent_id+"' class='listing ui-listview ui-listview-inset ui-corner-all ui-shadow sublist-promotion' data-role='listview' data-icon='false' data-inset='true' data-filter='true'></ul>
                    img_url = '';
                    /*if (item.img_ext != '0') {
                        img_url = _WEBSRV_PTH+'modules/business_listing/promotion_images/' + item.rwd_coupon_id + '.' + item.img_ext;
                    } else {
                        img_url = _WEBSRV_PTH+'images/restaurant/'+rewardObj.restaurant_info.restaurent_id+'.'+item.restaurent_img;
                    }
                    <img src="'+img_url+'"> <h4 class="promo-name">'+item.prom_title+ '</h4> Claim : '+item.can_claim+' +item.redeem_unit
                    */
                    sub_reward_list = sub_reward_list + '<li class="ui-li-static ui-body-inherit ui-li-has-thumb"><div class="light_green_color"><b>'+ item.comments + '</b></div><div>' + use_cpn_btn + '</div></li>';
                    is_claim = 1;
                  }
                }
				
                if(is_claim == 1) {
                  $('#rewardDiv_' + i).append('<ul class="listing ui-listview ui-listview-inset ui-corner-all sublist-promotion" data-role="listview" data-icon="false" data-inset="true" data-filter="true">' + sub_reward_list + '</ul>');
                }

                if(is_claim == 0) {
                  if (rewardObj.next_reward_pt != '') {
                    $('#rewardDiv_' + i).append('<div class="no_claim light_green_color"><b>'+rewardObj.next_reward_pt + '</b></br>' + use_cpn_btn + '</div>');
                  }
                }
              } else {
                if (rewardObj.next_reward_pt != '') {
                  $('#rewardDiv_' + i).append('<div class="no_claim light_green_color"><b>'+rewardObj.next_reward_pt + '</b></br>' +use_cpn_btn +'</div>');
                }
              }
              
            }
            if(_show_all_sign_btn==1){
				$("#SignUpAllText").show();
			}else{
				$("#SignUpAllText").hide();
			}            
            $("#rewardsList").listview("refresh");
          }
        }
      },
      error: handleAjaxError
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
    //hideShowSignAllBtn();

  }
  $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
      console.log('click on close');
      if (number == null || number == '') {
        console.log('Yorewards');
        location.href = '';
      }
  })

});
$(document).on("pageshow", "#NewPromotionPage", function() {
  var number = localStorage.getItem('userNumber');

 /* if (number == null || number == '') {
    sessionStorage.setItem('addingKey', 'NewPromotionPage');
    $.mobile.changePage("#commonLoginSignup_1");
    $('#naviageToSignupBtnDiv').hide();
  } else {*/
    promotionFound = false;
    $('.promoClass').addClass("ui-btn-active")
    
   /* var userData = JSON.parse(localStorage.getItem('userData'));
    $('#username').html('Welcome ' + userData.first_name);*/
    var url = _WEBSRV_PTH+'service/service_promotion.php?tag=get_new_promotions';
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        var responseData = JSON.parse(result);
        if (responseData.success == 0) {
            if (responseData.hasOwnProperty("new_rest_promotions")) {
            var promotions_list = responseData.new_rest_promotions;
            $("#newpromotionList").empty();
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

                      var plus_btn= "<div style='float:right;'><button class='promBtnSignUp ui-btn ui-icon-plus add_circle' resturant_id='"+rest_info.restaurent_id + "' id='" + userPromObj.id + "'>Get Coupon</button></div>";
                                    
                      var rest_det = "<br><span class='white_color'> at </span><span class='light_green_color'> " + rest_info.restaurent_name + "</span></h4><p class='rest-address'>" + rest_info.restaurent_city_nm + "</p>";
                     
                      if(userPromObj.cupon_type == "refer_friend") {
                        prom_list = prom_list + "<li class='ui-li-static ui-body-inherit ui-li-has-thumb'><img src='" +
            rest_info.restaurent_img_url + "' alt='" + rest_info.restaurent_name + "'/><h4 class='rest-name' resturant_id='"+rest_info.restaurent_id+"' id='"+userPromObj.id+"'>" + plus_btn + userPromObj.simple_title + rest_det +"<p class='rest-address'>"+message+"</p><div class='restaurent-button-main-div'><div class='ui-block-a'><button class='shareFacebookMyPromo ui-btn' id='shareMyPromo_"+userPromObj.id+"'><a href='' target='_blank' class='ui-link'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='emailFriendMyPromo ui-btn' resturent_id='"+rest_info.restaurent_id+"' promotion_id='"+userPromObj.id+"'><img id='refer_img' src='img/refer.png' style=''></button></div></div></li>";
                      } else {
                        prom_list = prom_list + "<li class='ui-li-static ui-body-inherit ui-li-has-thumb'><img src='" +
            rest_info.restaurent_img_url + "' alt='" + rest_info.restaurent_name + "'/><h4 class='rest-name' resturant_id='"+rest_info.restaurent_id+"' id='"+ userPromObj.id +"'>" + plus_btn + userPromObj.simple_title + rest_det +"<p class='rest-address'>"+ message +"</p><div class='restaurent-button-main-div'><div class='ui-block-a'><button class='shareFacebookMyPromo ui-btn' id='shareMyPromo_"+ userPromObj.id +"'><a href='' target='_blank' class='ui-link'><img id='share_img' src='img/share.png' style=''></a></button></div></div></li>";
                      }
                      addMyPromoShareLink(rest_info.restaurent_id,userPromObj.id);
                    }
                  }
                }
              }

              if(prom_list != '' && prom_list != undefined) {
              	$('#newpromotionList').append(prom_list);
              }
              prom_list = '';
            //$(".common-sublist-promotion").listview("refresh");
            //$("#promotionList").listview("refresh");
            }
            //$(".common-sublist-promotion").listview("refresh");
            $("#newpromotionList").listview("refresh");
            //$('#listing_' + rest_id + ' li').unbind('click');
            
              $('.promBtnSignUp').unbind('click');
	          $('.promBtnSignUp').click(function(event) {
	            event.stopPropagation();
	            var clickedId = $(this).attr('id');
	            var rest_id = $(this).attr('resturant_id');
	            
	            var number = localStorage.getItem('userNumber');
	            sessionStorage.setItem('addingKey', 'promotion');
	            sessionStorage.setItem('clickedRest', rest_id);
	            sessionStorage.setItem('clickedId', clickedId);
	            if (number == null || number == '') {
	              //$.mobile.changePage("#commonLoginSignup");
	              $.mobile.changePage("#commonLoginSignup_1");
	            } else {
	              var promotion_id = sessionStorage.getItem('clickedId');
	              var restaurant_id = sessionStorage.getItem('clickedRest');
	              var user_phone = localStorage.getItem('userNumber');              
	              var action_to_take = 'promotion';
	              callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
	            }
	          });
            
          }
          if (!promotionFound) {
            $('#newpromotionList').append('<li class="list-group-item no_promotion">Currently there are no new promotion added. </li>');
          }
        }
      },
      error: handleAjaxError
    });
  //}

  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
    $('.userName').empty();
    $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
    //hideShowSignAllBtn();
  }

  $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
      if (number == null || number == '') {
        console.log('UoPromotion');
        location.href = '';
      } else {
        location.href = '#NewPromotionPage';
      }
  });
  
  
   $(document).on('click', '.rest-name', function(event){
        var clickedId = $(this).attr('id');
        var rest_id = $(this).attr('resturant_id');
        sessionStorage.setItem('promotionClickedId', clickedId);
        sessionStorage.setItem('prev_rest', rest_id);
        sessionStorage.setItem('addingKey','promotion');
        sessionStorage.setItem('showDet',1);
        sessionStorage.setItem('clickedRest',rest_id);        
        sessionStorage.setItem('clickedId',clickedId);
        var number = localStorage.getItem('userNumber');
        //alert('there');
        //sessionStorage.setItem('addingKey', 'NewPromotionPage');
        if(number === null || number === '') {
          //$.mobile.changePage("#loginDialog");
          $.mobile.changePage("#commonLoginSignup_1");          
        } else {
          location.href = '#promotionDetails?restaurent_id='+rest_id+'&promotion_id='+clickedId;
        }        
    });

  $('#NewPromotionPage').on('click','.emailFriendMyPromo', function(event){
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


$(document).on("pageshow", "#MyPromotionPage", function() {
  var number = localStorage.getItem('userNumber');
  if (number == null || number == '') {
    sessionStorage.setItem('addingKey', 'MyPromotionPage');
    $.mobile.changePage("#commonLoginSignup_1");
    $('#naviageToSignupBtnDiv').hide();
  } else {
    promotionFound = false;
    $('.promoClass').addClass("ui-btn-active")
    var userData = JSON.parse(localStorage.getItem('userData'));
    //console.log(userData);
    $('#username').html('Welcome ' + userData.first_name);
    var url = _WEBSRV_PTH+'service/service_promotion.php?tag=get_my_favorites&phone=' + number;
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
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
        
                      if(userPromObj.cupon_type == "refer_friend") {
                        prom_list = prom_list + "<li class='ui-li-static ui-body-inherit ui-li-has-thumb'><h4 class='promo-name' resturant_id='"+rest_info.restaurent_id+"' id='"+userPromObj.id+"'>" +userPromObj.simple_title+ "</h4><p>"+message+"</p><div class='button-div-1'><div class='ui-block-a'><button class='shareFacebookMyPromo ui-btn' id='shareMyPromo_"+userPromObj.id+"'><a href='' target='_blank' class='ui-link'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='emailFriendMyPromo ui-btn' resturent_id='"+rest_info.restaurent_id+"' promotion_id='"+userPromObj.id+"'><img id='refer_img' src='img/refer.png' style=''></button></div></div></li>";
                      } else {
                        prom_list = prom_list + "<li class='ui-li-static ui-body-inherit ui-li-has-thumb'><h4 class='promo-name' resturant_id='"+rest_info.restaurent_id+"' id='"+userPromObj.id+"'>" +userPromObj.simple_title+ "</h4><p>"+message+"</p><div class='button-div-1'><div class='ui-block-a'><button class='shareFacebookMyPromo ui-btn' id='shareMyPromo_"+userPromObj.id+"'><a href='' target='_blank' class='ui-link'><img id='share_img' src='img/share.png' style=''></a></button></div></div></li>";
                      }
                      addMyPromoShareLink(rest_info.restaurent_id,userPromObj.id);
                    }
                  }
                }
              }

              if(prom_list != '' && prom_list != undefined) {              	
                $('#promotionList').append("<li><img class='restaurent_image' src='" +
            rest_info.restaurent_img_url + "' alt='" + rest_info.restaurent_name + "'><h2 class='rest-name'>" +
            rest_info.restaurent_name + "</h2><p class='rest-address'>"+rest_info.restaurent_city_nm +"</p><ul class='listing ui-listview ui-listview-inset ui-corner-all sublist-promotion' data-role='listview' data-icon='false' data-inset='true' data-filter='true'>"+prom_list+"</ul>");
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
            $('#promotionList').append('<li class="list-group-item no_promotion">Currently there are no promotion added. To add please click on plus sign button in front of particular promotion from restaurant listing. <a href="#restologyPage">Click here</a> to start adding.</li>');
          }else{
		  	$('#popupPromShow').popup("open");
		  	setTimeout(function(){
              $("#popupPromShow").popup("close");
            }, 6000);
		  }
        }
      },
      error: handleAjaxError
    });
  }

  var userLoggedIn = localStorage.getItem('userNumber');
  if (userLoggedIn == null || userLoggedIn == '') {
    $('.logoutBtn').hide();
  } else {
    $('.logoutBtn').show();
    $('.userName').empty();
    $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
    //hideShowSignAllBtn();
  }

  $(document).on("click", ".ui-dialog-contain .ui-header a", function(e){
      if (number == null || number == '') {
        console.log('UoPromotion');
        location.href = '';
      } else {
        location.href = '#MyPromotionPage';
      }
  });

  $(document).on('click', '.promo-name', function(event){
        var clickedId = $(this).attr('id');
        var rest_id = $(this).attr('resturant_id');
        sessionStorage.setItem('promotionClickedId', clickedId);
        sessionStorage.setItem('prev_rest', rest_id);
        sessionStorage.setItem('addingKey','promotion');
        sessionStorage.setItem('showDet',1);
        sessionStorage.setItem('clickedRest',"");
        sessionStorage.setItem('clickedId',clickedId);
        var number = localStorage.getItem('userNumber');
        //alert('there');
        if(number === null || number === '') {
          //$.mobile.changePage("#loginDialog");
          $.mobile.changePage("#commonLoginSignup_1");          
        } else {
          location.href = '#promotionDetails?restaurent_id='+rest_id+'&promotion_id='+clickedId;
        }        
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
  var url = _WEBSRV_PTH+'service/service_restaurant.php?tag=restaurant_listing&callback=?';
  $.getJSON(url, function(result) {
    var jsonObj = result;
    if (jsonObj.success == 1) {
      jQuery.each(jsonObj.rest_list, function(i, val) {
        var restObj = val;
        $("#restaurentList").empty();
        $("#restaurentList").append("<li><img class='restaurent_image' src='" +
          restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><h2 class='rest-name'>" +
          restObj.rest_free_offer + "<br> at " +
          restObj.restaurent_name + "</h2><p class = 'rest-address'>" +
          restObj.restaurent_state + "</p><div class='ui-grid-a restaurent-button-main-div'><div class='ui-block-a'><input type='button' class='promoBtn' value='Promotions' id='" +
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

function getRestLocations() {
     	
  var url = _WEBSRV_PTH+'service/service_restaurant.php?tag=restaurant_locations';
 
  $.ajax({
    url: url,
    type: 'GET',
    headers:{     	
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
    },
    crossOrigin: true,
    success: function(result) {
      var jsonObj = JSON.parse(result);
      if (jsonObj.success == 1) {
        $("#rest_loc_list").empty();
        //alert(JSON.stringify(jsonObj.rest_list));
        jQuery.each(jsonObj.rest_loc_list, function(i, val) {
          var restLocObj = val;          
          $("#rest_loc_list").append("<li><a class='itm_loc' loc_qry='" + restLocObj.restaurent_fax + "' href='#'>" + restLocObj.restaurent_fax + "</a></li>");
        });
        $("#rest_loc_list").listview("refresh");
        
         $("#rest_loc_list").on("click", "li", function () {
	        /* selected option */
	        var text = $("a", this).text();
	        /* update input with selected option */
	        $("#autocomplete-input").val(text);
	        /* hide all options */
	        $(this).siblings().addBack().addClass("ui-screen-hidden");
	        
	        setTimeout(function(){getRestarents(text);},1000);
	        
	    });
      }
    },
    error: handleAjaxError
  })
}
  
//This function will add a marker to the map each time it 
//is called.  It takes latitude, longitude, and html markup
//for the content you want to appear in the info window 
//for the marker.
function addMarkerToMap(markerCount, lat, long, htmlMarkupForInfoWindow){
    var infowindow = new google.maps.InfoWindow();
    var myLatLng = new google.maps.LatLng(parseFloat(lat), parseFloat(long));
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });    
    //Gives each marker an Id for the on click
    //markerCount++;
    
    //Creates the event listener for clicking the marker
    //and places the marker on the map 
    google.maps.event.addListener(marker, 'click', (function(marker, markerCount) {
        return function() {
        	if(marker.open){
                infowindow.close();
                marker.open = false;
            }else{                
                infowindow.setContent(htmlMarkupForInfoWindow);
                infowindow.open(map, marker);
                marker.open = true;
            }
            google.maps.event.addListener(map, 'click', function() {
                infowindow.close();
                marker.open = false;
            });
        }
    })(marker, markerCount));  
    
    //Pans map to the new location of the marker
    //map.panTo(myLatLng)
           
}

var map;

//..Map initialization      
function initMap(objMarkers) {
  var lc_usr_lat = ((sessionStorage.getItem('user_lat') == null) ? _WEB_LAT : sessionStorage.getItem('user_lat'));
  var lc_usr_long = ((sessionStorage.getItem('user_long') == null) ? _WEB_LONG : sessionStorage.getItem('user_long'));
  //alert(lc_usr_lat+'-'+lc_usr_long);
  var myLatLng = {lat: parseFloat(lc_usr_lat), lng: parseFloat(lc_usr_long)};
  //var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
  //var myLatLng = {lat: 16.7049873, lng: -74.24325270000001};
  //var map =;
  map = new google.maps.Map(document.getElementById('map_area'), {
    zoom: 4,
    center: myLatLng
  });
  
  addMarkerToMap(99999, lc_usr_lat, lc_usr_long, 'Your location');
  //..add each marker
  $.each(objMarkers, function(i, value) {  
  		//alert(value.id +' - ' + value.lat+' - ' + value.lng+' - ' + value.msg); 
        addMarkerToMap(value.id, value.lat, value.lng, value.msg);
  }); 
}

function getRestarents(loc_filt) {
	
  loc_filt= ((loc_filt == null) ? "" : loc_filt);
  var lc_usr_lat = ((sessionStorage.getItem('user_lat') == null) ? _WEB_LAT : sessionStorage.getItem('user_lat'));
  var lc_usr_long = ((sessionStorage.getItem('user_long') == null) ? _WEB_LONG : sessionStorage.getItem('user_long'));
  //alert(lc_usr_lat + '-' + lc_usr_long );
  var url = _WEBSRV_PTH+'service/service_restaurant.php?tag=restaurant_listing&filt_location='+loc_filt+'&user_lat='+lc_usr_lat+'&user_long='+lc_usr_long;

  var objMarkers=[];
  NProgress.start(); 
  $.ajax({  	    
    url: url,
    type: 'GET',
    headers:{     	
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
    },
    error: handleAjaxError
  }).done(function(result){
      var jsonObj = JSON.parse(result);
      if (jsonObj.success == 1) {
        $("#restaurentList").empty();
        //alert(JSON.stringify(jsonObj.rest_list));
        var htmlMarkupForInfoWindow="";
        jQuery.each(jsonObj.rest_list, function(i, val) {
          var restObj = val;
          var menu_link = _WEBSRV_PTH+'user/tbl_menu.php?online_store=1&menu_restaurent='+restObj.restaurent_id+'&is_preview=1'
          $("#restaurentList").append("<li><img class='restaurent_image' src='" +
            restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><h2 class='rest-name'>" +
            restObj.rest_free_offer + "<div style='float:right;'><button class='rewardBtnSignUp ui-btn ui-icon-plus add_circle' id='" +
            restObj.restaurent_id + "'>Get Coupon</button></div><br><span class='white_color'> at </span><span class='light_green_color restDetlSpn' rest_dtls='"+JSON.stringify(restObj)+"'>" +
            restObj.restaurent_name + "</span></h2><p class = 'rest-address'>" +
            restObj.restaurent_fax + "</p><div class='restaurent-button-main-div'><div class='ui-block-a'><button class='ui-btn ui-icon-audio ui-btn-icon-left promoBtn' id='"+restObj.restaurent_id+"'>Promotions</button></div><div class='ui-block-b'><button class='rewardBtn ui-btn ui-icon-star ui-btn-icon-left' id='" +
            restObj.restaurent_id + "'>Rewards</button></div><div class='ui-block-c'><button class='menuBtn ui-btn ui-icon-bullets ui-btn-icon-left'><a target='_blank' href='"+menu_link+"'>Menu</a></button></div></div><div style='diplay:none' class='list_div pramotion_reward_main_div'><ul class='listing' data-role='listview' id='listing_" +
            restObj.restaurent_id + "'></ul></div></li>");
            
            htmlMarkupForInfoWindow="<div class='gl_map_mark_info'><img class='gl_map_image' src='" +
            restObj.restaurent_img_url + "' alt='" + restObj.restaurent_name + "'><h2 class='rest-name'><br><h2 >" +
            restObj.restaurent_name + "</h2><p >" +
            restObj.restaurent_address + "</p><p ><b> Distance: <b>" +
            Math.round(restObj.distance) + " km</p></div>";
            if(restObj.restaurent_lat != null && restObj.restaurent_lat != ''){
				objMarkers.push({id: restObj.restaurent_id, lat: restObj.restaurent_lat, lng: restObj.restaurent_lng, msg: htmlMarkupForInfoWindow});
			}            	
        });
        $("#restaurentList").listview("refresh");
        NProgress.done();
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
        });
        initMap(objMarkers);
        
        $('.restDetlSpn').click(function() {
        	 var restObj = $.parseJSON($(this).attr('rest_dtls'));
        	 $('#rst_det_img').attr('src', restObj.restaurent_img_url);
        	 //$('#rst_det_img').css("background-image", "url('"+restObj.restaurent_img_url+"')");  
		  	 $('#rst_det_nm').html(restObj.restaurent_name);
		  	 $('#rst_det_add').html(restObj.restaurent_address);
		  	 $('#rst_det_loctn').html(restObj.restaurent_fax);
		  	 $('#rst_det_work_hr').html(restObj.restaurent_online_ord_start.substring(0,5) + '-' + restObj.restaurent_online_ord_end.substring(0,5));
		  	 $('#rst_det_desc').html(nl2br(restObj.restaurent_description));
		  	 
		  	 $('#rst_det_phone').empty();
		  	 if(restObj.restaurent_phone_1){
			 	$('#rst_det_phone').html('<b>'+restObj.restaurent_phone_1+'</b>');
			 }	
			 if(restObj.restaurent_phone_2){
			 	$('#rst_det_phone').append('<br><b>'+restObj.restaurent_phone_2+'</b>');
			 }		  	 	
		  	 var latlon = restObj.restaurent_lat + "," + restObj.restaurent_lng;		  
			 var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+ latlon +"&markers=color:red%7Clabel:S%7C"+ latlon +"&zoom=14&size=300x200&key=AIzaSyA9FqscGt5_K0Dvo7hrbBq23lzK3kXElI0";
			 $('#mapholder').html("<img src='"+img_url+"'>");
 
			 $.mobile.changePage("#restDetails");			 
        });	
		
        $('.rewardBtnSignUp').unbind('click');
          $('.rewardBtnSignUp').click(function(event) {
              event.stopPropagation();       
              var rest_id = $(this).attr('id');
	          var prev_rest = sessionStorage.getItem("prev_rest");
	          if (prev_rest != rest_id) {
	            isRewardClicked = false;            
	            sessionStorage.setItem("prev_rest", "");
	          }                 
	          var clickedId = $(this).attr('id');
              var number = localStorage.getItem('userNumber');
              sessionStorage.setItem('addingKey', 'rewards');
              sessionStorage.setItem('clickedRest', rest_id);
              sessionStorage.setItem('clickedId', clickedId);
              if(number === null || number === ""){
                //$.mobile.changePage("#commonLoginSignup");
                $.mobile.changePage("#commonLoginSignup_1");
              } else {
                var promotion_id = sessionStorage.getItem('clickedId');
                var restaurant_id = sessionStorage.getItem('clickedRest');
                var user_phone = localStorage.getItem('userNumber');
                var action_to_take = 'reward';
                callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
              }
          })                 
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
    var url = _WEBSRV_PTH+'service/service_login.php?tag=rest_rewards&restaurant_id=' + rest_id;
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
      success: function(result) {
        var response = JSON.parse(result);
        if (response.success == 1) {
          if (response.reward_list.length == 0) {
            $('#listing_' + rest_id).append('<li>No rewards</li>');
          }else{
		  	 $('#listing_' + rest_id).append('<li id="restaurentList1"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pramotion_reward_single_div"><div class="light_green_color">' + response.multiply_factor + '</div></div></li>');
		  }
          for (var i = 0; i < response.reward_list.length; i++) {
            var rewardItem = response.reward_list[i];
            $('#listing_' + rest_id).append('<li id="restaurentList' + rewardItem.rwd_id + '"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 pramotion_reward_single_div"><div class="light_green_color">' + rewardItem.comments + '</div></div></li>');            
          }
          $('.add_circle').unbind('click');
          $('.add_circle').click(function(event) {
            event.stopPropagation();
              //sessionStorage.setItem('addingKey', 'MyRewardPage');
              //var registeredRest = localStorage.getItem('registeredRest');
              var clickedId = $(this).attr('id');
             
              var number = localStorage.getItem('userNumber');
              sessionStorage.setItem('addingKey', 'rewards');
              sessionStorage.setItem('clickedRest', rest_id);
              sessionStorage.setItem('clickedId', clickedId);
              if(number === null || number === ""){
                //$.mobile.changePage("#commonLoginSignup");
                $.mobile.changePage("#commonLoginSignup_1");
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
  // var url = 'http://localhost/restaurant_in/service/service_login.php?tag=add_reward_pts&auth_id=' + userId + '&table_id=' + clickedId + '&chkin_points={reward_points}&chkin_amount={reward_amount}&cust_server_pin={Server_pin}&chkin_invoice={chkin_invoice} ';
}

function bindPromotion(rest_id) {
  if (!isPromotionClicked) {
    sessionStorage.setItem("prev_rest", rest_id);
    isRewardClicked = false;
    isPromotionClicked = true;
    $('#listing_' + rest_id).show();
    $('#listing_' + rest_id).empty();
    var url = _WEBSRV_PTH+'service/service_promotion.php?tag=prom_listing&listing_type=all&is_restaurant=' + rest_id;
    $.ajax({
      url: url,
      type: 'GET',
      headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
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
       
                if(user_promotion_item.cupon_type == "refer_friend") {
                  $('#listing_' + rest_id).append('<li id="' + user_promotion_item.id + '"><div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 pramotion_reward_single_div"><div class="pro_title" id="' + user_promotion_item.id + '" restaurant_id ="'+rest_id+'" >' +
                  user_promotion_item.title + '</div><div class="message">' + message + '</div></div><div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pramotion_reward_single_div_1"><button class="ui-btn ui-icon-plus add_circle" id="' +
                  user_promotion_item.id + '">Get Coupon</button></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="button-div"><div class="ui-block-a"><button class="shareFacebookMyPromo ui-btn" id="shareMyPromo_'+user_promotion_item.id+'"><a href="" target="_blank" class="ui-link"><img id="share_img" src="img/share.png" style=""></a></button></div><div class="ui-block-b"><button class="emailFriendMyPromo ui-btn" resturent_id="'+rest_id+'" promotion_id="'+user_promotion_item.id+'"><img id="refer_img" src="img/refer.png" style=""></button></div></div></div></div></li>');
                } else {
                  $('#listing_' + rest_id).append('<li id="' + user_promotion_item.id + '"><div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 pramotion_reward_single_div"><div class="pro_title" id="' + user_promotion_item.id + '" restaurant_id ="'+rest_id+'" >' +
                  user_promotion_item.title + '</div><div class="message">' + message + '</div></div><div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pramotion_reward_single_div_1"><button class="ui-btn ui-icon-plus add_circle" id="' +
                  user_promotion_item.id + '">Get Coupon</button></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="button-div"><div class="ui-block-a"><button class="shareFacebookMyPromo ui-btn" id="shareMyPromo_'+user_promotion_item.id+'"><a href="" target="_blank" class="ui-link"><img id="share_img" src="img/share.png" style=""></a></button></div></div></div></div></li>');
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
            sessionStorage.setItem('showDet',1);
            //sessionStorage.setItem('clickedRest',"");
            sessionStorage.setItem('clickedRest',rest_id);
            sessionStorage.setItem('clickedId',clickedId);
            var number = localStorage.getItem('userNumber');
            if(number === null || number === '') {
              //$.mobile.changePage("#loginDialog");
              $.mobile.changePage("#commonLoginSignup_1");
            } else {
              //location.href = '#promotionDetails?restaurent_id='+rest_id+'&promotion_id='+clickedId;
              _is_user_exist_in_sys(number,clickedId,rest_id,'promotion');              
            }

          });
          $('.add_circle').unbind('click');
          $('.add_circle').click(function(event) {
            event.stopPropagation();
            var clickedId = $(this).attr('id');
            var number = localStorage.getItem('userNumber');
 
            sessionStorage.setItem('addingKey', 'promotion');
            sessionStorage.setItem('clickedRest', rest_id);
            sessionStorage.setItem('clickedId', clickedId);
            if (number == null || number == '') {
              //$.mobile.changePage("#commonLoginSignup");
              $.mobile.changePage("#commonLoginSignup_1");
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
  var url = _WEBSRV_PTH+'service/service_promotion.php?tag=add_to_favorite_prom&user_id=' + userId + '&prom_id=' + clickedId;
  $.ajax({
    url: url,
    type: 'GET',
    headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
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
    error: handleAjaxError
  });
}

function addPromotionLogin(promo_id,logged_in)
{
  var userData = JSON.parse(localStorage.getItem('userData'));
  var userId = userData.id;
  var url = _WEBSRV_PTH+'service/service_promotion.php?tag=add_to_favorite_prom&user_id=' + userId + '&prom_id=' + promo_id;
  $.ajax({
    url: url,
    type: 'GET',
    headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
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
    error: handleAjaxError
  });
}

function addPromotionSignUp(clickedId)
{
  var userData = JSON.parse(localStorage.getItem('userData'));
  var userId = userData.id;
  var url = _WEBSRV_PTH+'service/service_promotion.php?tag=add_to_favorite_prom&user_id=' + userId + '&prom_id=' + clickedId;
  $.ajax({
    url: url,
    type: 'GET',
    headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
      },
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
    error: handleAjaxError
  });
}

$(document).on("pageshow", "#promotionDetails", function() {
    /*
    $('#loginDialog').on("click", ".ui-dialog-contain .ui-header a", function(e){
          console.log('suraj');
          location.href = '';
    });
    */
      var number = localStorage.getItem('userNumber');
      var promotion_id = getParameterByName('promotion_id',location.href) ? getParameterByName('promotion_id',location.href) : sessionStorage.getItem('clickedId');
	  var rest_id = getParameterByName('restaurent_id',location.href) ? getParameterByName('restaurent_id',location.href) : sessionStorage.getItem('clickedRest'); 
     /*
      var promotion_id = getParameterByName('promotion_id',location.href);
      var rest_id = getParameterByName('restaurent_id',location.href);
      */            
      sessionStorage.setItem('clickedRest', rest_id);
	  sessionStorage.setItem('clickedId', promotion_id);
	  sessionStorage.setItem('addingKey', 'promotion');
	  sessionStorage.setItem('showDet',1);
	  //alert('inside-prom-detl:promotion_id='+promotion_id+'||res_id='+rest_id);
      console.log('inside-prom-detl:promotion_id='+promotion_id+'||res_id='+rest_id);      
      if(number == null || number == '') {      	             						$.mobile.changePage("#commonLoginSignup_1");		 
      } else {      
      //$('.logoutBtn').show();
      /*try{
	  	$('#commonLoginSignup_1').dialog('close');
	  }catch(e){		
	  } */     
      $('.userName').empty();
      try{
		$('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
	  }catch(e){		
	  }
      //$('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
      $('#proDetailsDiv').empty();

      var url = _WEBSRV_PTH+'service/service_promotion.php?tag=get_prom_det&prom_id='+promotion_id+'&is_restaurant=1';
        $.ajax({
          url : url,
          type : "GET",
          headers:{
	        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
	      },
          success : function(response){
            var result = JSON.parse(response);
            if(result.success==1){
              var prom_det = result.prom_det;
              var image_url='';
              if (prom_det.img_ext != '0') {
                image_url = _WEBSRV_PTH+'modules/business_listing/promotion_images/' + prom_det.id + '.' + prom_det.img_ext;
              } else {
                image_url= prom_det.restaurant_logo;
              }
              if(prom_det.cupon_type == "refer_friend") {
                $('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+image_url+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='promo_code_resto'> <b>CODE : "+prom_det.prom_code+"</b></div><div class='promotion_details_share_fb_button'><div class='ui-block-a'><button class='ui-btn shareFacebook'><a href='' target='_blank'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='ui-block-b'><button class='ui-btn emailFriend'><img id='refer_img' src='img/refer.png' style=''></button></div><div class='promo_det_add_promotion'><button class='ui-btn ui-icon-plus ui-btn-icon-notext add_circle_prom_det' id='"+promotion_id+"'></button></div></div></div>");
              } else {
                $('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+image_url+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='promo_code_resto'> <b>CODE : "+prom_det.prom_code+"</b></div><div class='promotion_details_share_fb_button'><div class='ui-block-a'><button class='ui-btn shareFacebook'><a href='' target='_blank'><img id='share_img' src='img/share.png' style=''></a></button></div><div class='promo_det_add_promotion'><button class='ui-btn ui-icon-plus ui-btn-icon-notext add_circle_prom_det' id='"+promotion_id+"'></button></div></div></div>");
              }
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
        console.log('completed loading pg:promotion_id='+promotion_id+'||res_id='+rest_id); 
		//alert('i m therer');
		
        $("#promotionDetails").on('click', '.emailFriend', function () {
            if(localStorage.getItem('userNumber')) {
                $('#friendPhone').val(localStorage.getItem('userNumber'));
            }
            $.mobile.changePage('#shareTextFriend');
        });

        $("#promotionDetails").on('click', '.add_circle_prom_det', function () {
            var promotion_id = getParameterByName('promotion_id',location.href) ? getParameterByName('promotion_id',location.href) : sessionStorage.getItem('promotionClickedId');
            var restaurant_id = getParameterByName('restaurent_id',location.href) ? getParameterByName('restaurent_id',location.href) : sessionStorage.getItem('prev_rest');
            var user_phone = localStorage.getItem('userNumber');
            action_to_take = 'promotion';
            callSignupLoginWebservice(promotion_id,user_phone,restaurant_id,action_to_take);
        });
      }


      // $('#btn_login').click(function() {
      //   $('#uname').removeClass('error');
      //   var username = $('#uname').val().trim();
      //   if (username == null || username == "") {
      //     $('#uname').addClass('error');
      //     return;
      //   }
      //   doLogin(username);
      // });


        // $('.emailFriend').on('click',function(event){
        //     $.mobile.changePage('#shareTextFriend');
        // });
});

$(document).on("pageinit", "#referalProgram", function() {
    $('#referalProgram').on('click','#send_referal_sign',function(){
        var userName = $('#referalFullname').val().trim();
        var referalName = $('#referalAngelName').val().trim();
        var phoneNumber = $('#referalphoneNo').val().trim();
        var newregex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/g;
        var promotion_id = getParameterByName('promotion_id',location.href);
        var restaurant_id = getParameterByName('restaurant_id',location.href);
        if(userName === null || userName === "") {
          alert('Enter your name.');
          return;
        } else if(phoneNumber === null || phoneNumber === "") {
          alert('Enter the phone number.');
          return;
        } else if(!newregex.test(phoneNumber)) {
          alert('Enter the correct phone number.');
          return;
        } else if(referalName === null || referalName === "") {
          alert('Enter referal name.');
          return;
        }
        sessionStorage.setItem('referal_program',true);
        //callSignupLoginWebservice(27,phoneNumber,10,'referal_program');
        callSignupLoginWebservice_referal_program(27,phoneNumber,1,referalName,userName);
    });

});

$(document).on("pageinit", "#referFriendLink", function() {
      var promotion_id = getParameterByName('promotion_id',location.href);
      var user_id = getParameterByName('user_id',location.href);
      var number = localStorage.getItem('userNumber');
      if(number == null || number == "") {
        $('.logoutBtn').hide();
      } else {
        $('.logoutBtn').show();
        $('.userName').empty();
        $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
        $('#phoneNoRef').val(number)
        //$('#referFriendForm').hide();
      }
      // $('.userName').empty();
      // $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
      $('#referProDetailsDiv').empty();

      var url = _WEBSRV_PTH+'service/service_promotion.php?tag=get_prom_det&prom_id='+promotion_id+'&is_restaurant=1';
        $.ajax({
          url : url,
          type : "GET",
          headers:{
	        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
	      },
          success : function(response){
            var result = JSON.parse(response);
            if(result.success==1){
              var prom_det = result.prom_det;
              var endDate = getFormattedDate(prom_det.end_date);
              var message = "Valid till " + endDate;
              $('#referProDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_valid'>"+message+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='promo_code_resto'> <b>CODE : "+prom_det.prom_code+"</b></div></div>");
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

            var url = _WEBSRV_PTH+'service/service_promotion.php?tag=friend_click_refer&promoid='+promotion_id+'&phone='+phoneNo+'&server_pin='+restopin+'&ref_by='+user_id;
            $.ajax({
              url : url,
              type : "GET",
              headers:{
		        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
		      },
              success : function(response){
                var result = JSON.parse(response);
                if(result.success==1){
                  alert(result.message);
                  localStorage.setItem('userData', JSON.stringify(result.user));
                  localStorage.setItem('userNumber', phoneNo);
                  $('.logoutBtn').show();
                  $('.userName').empty();
                  $('.userName').append(JSON.parse(localStorage.getItem('userData')).full_name);
                  $('#referFriendForm').hide();
                  //location.reload();
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
        var restaurant_id = getParameterByName('restaurent_id',location.href) ? getParameterByName('restaurent_id',location.href) : sessionStorage.getItem('prev_rest');
        var promotion_id = getParameterByName('promotion_id',location.href) ? getParameterByName('promotion_id',location.href) : sessionStorage.getItem('promotionClickedId');
        var action_to_take = 'refer_friend';
        var user_phone = phone;
        var url = _WEBSRV_PTH+'service/service_promotion.php?tag=new_refer_friend&promoid='+promotion_id+'&phone='+user_phone+'&is_restaurant='+restaurant_id+'&action_to_take='+action_to_take;
        $.ajax({
          url: url,
          type: 'GET',
          headers:{
	        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
	      },
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
              alert('suraj');
              alert(result.message);
            }
          },
          error: handleAjaxError
        });
    });
});

function addFbLink()
{
      var rest_id = getParameterByName('restaurent_id',location.href) ? getParameterByName('restaurent_id',location.href) : sessionStorage.getItem('prev_rest');
      var prom_id = getParameterByName('promotion_id',location.href) ? getParameterByName('promotion_id',location.href) : sessionStorage.getItem('promotionClickedId');

      // var rest_id = sessionStorage.getItem('prev_rest');
      // var prom_id = sessionStorage.getItem('promotionClickedId');
      var url = _WEBSRV_PTH+'service/service_promotion.php?tag=get_fb_share&prom_id='+prom_id+'&is_restaurant='+rest_id;
      $.ajax({
        url: url,
        type: 'GET',
        headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
        },
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
        error: handleAjaxError
      });
}


function addMyPromoShareLink(rest_id,promo_id)
{
  var url = _WEBSRV_PTH+'service/service_promotion.php?tag=get_fb_share&prom_id='+promo_id+'&is_restaurant='+rest_id;
      $.ajax({
        url: url,
        type: 'GET',
        headers:{
        "Authorization": "Basic " + btoa(_WEBSRV_USR+":"+_WEBSRV_PWD)
        },
        success: function(result) {
          var response = JSON.parse(result);
          if (response.success == 1) {
            $('#shareMyPromo_'+promo_id+' a').attr('href',response.fb_share_lnk);
          } else {
            alert(response.message);
          }
        },
        error: handleAjaxError
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
