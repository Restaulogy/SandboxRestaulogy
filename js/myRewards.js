$(document).ready(function(){
 
  var rewardsFound = false;
  var userNumber = localStorage.getItem('userNumber');
  if (userNumber == null || userNumber == '') {
    location.href = 'index.html';
	return;
  } 
  $('#logoutBtn').click(function(){
	  localStorage.clear();
	  sessionStorage.clear();
	  alert('Logout Successfully ');
	  location.reload();
  });
  var userData = JSON.parse(localStorage.getItem('userData'));
  console.log(userData);
  $('#username').html('Welcome '+userData.first_name);
  var url = 'http://restaulogy.com/restaurant_in/service/service_login.php?tag=get_loyalty_det_new&phone='+userNumber;
  $.ajax({
	  url : url,
	  type : "GET",
	  success : function(result){
		  console.log(result);
		  var responseData = JSON.parse(result);
		  if(responseData.success==0){
			  if(responseData.hasOwnProperty("rest_rewards")){
				  var rest_rewards = responseData.rest_rewards;
				  for(var i = 0;i<rest_rewards.length;i++){
					  rewardsFound = true;
								var rewardObj = rest_rewards[i];
								$('#rewardsList').append('<li class="list-group-item"><div class="row inner-container"><div class="col-xs-3 col-sm-2 col-md-1 col-lg-1 img-icon"><img id="img_' + i + '" src="'+rewardObj.restaurant_info.restaurent_img_url+'" class="img-circle"></div><div class="col-xs-9 col-sm-10 col-md-11 col-lg-11"><div class="row">' +
                              rewardObj.restaurant_info.restaurent_name + '</div><div class="mypro_desc"> Avaible Points : <span>' + parseInt(rewardObj.reward.reward_bal_points) + '</span></div><div class="avaiableHeading">Available Rewards</div><div class="col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2" id="rewardDiv_'+i+'"></div></div></div></li>');
							  
						var availableRewards = rewardObj.rewards_avail;
						if(availableRewards.length!=0){
							for(var k=0;k<availableRewards.length;k++){
								var item = availableRewards[k];
								$('#rewardDiv_'+i).append('<div>'+item.prom_title+'</div><br>');
							}
						}else{
							if(rewardObj.next_reward_pt!=''){
								$('#rewardDiv_'+i).append(rewardObj.next_reward_pt+' points needed to get the next promotion offer');
							}
						}
						
				 }
			  }
		  }		  
	  },
	  error:function(result){
		  console.log(result);
	  }
  })
  
})