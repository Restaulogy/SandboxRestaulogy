$(document).ready(function(){
	var promotionFound = false; 
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
  
  var url =  'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_my_favorites&phone='+userNumber;
   $.ajax({
      url: url,
      type: 'GET',
      success: function(result) {
		  console.log(result);
        var responseData = JSON.parse(result);
        if (responseData.success == 0) {
			console.log(responseData);
			if(responseData.hasOwnProperty("all_rest_promotions")){
				var promotions_list = responseData.all_rest_promotions;
				for(var i = 0;i<promotions_list.length;i++){
					if(typeof(promotions_list[i].promotions)=='object'){
						
						var promotions = promotions_list[i].promotions;
						var rest_info = promotions_list[i].restaurant_info; 
						for(var j=0;j<promotions.length;j++){
							var user_promotions = promotions[j].user_promotion;
							for(var k = 0; k<user_promotions.length;k++){
								promotionFound = true;
								var userPromObj = user_promotions[k];
								$('#promotionList').append('<li class="list-group-item" id="restaurentList' + userPromObj.id + '"><div class="row inner-container"><div class="col-xs-3 col-sm-2 col-md-1 col-lg-1 img-icon"><img id="img_' + k + '" src="img/default.jpg" class="img-circle"></div><div class="col-xs-9 col-sm-10 col-md-11 col-lg-11"><div class="row mypro_title">' +
                              rest_info.name + '</div><div class="mypro_desc">' + userPromObj.simple_title + '</div></div></div></li>');
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
			if(!promotionFound){
				$('#promotionList').append('<li class="list-group-item">No Promotions</li>');
			}
		}
	  },
	  error:function(result) {
		  console.log(result);
	  }
   });
})