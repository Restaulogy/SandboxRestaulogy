$(document).ready(function() {
// var id = sessionStorage.getItem('promotionClickedId');
// console.log(id);
//  $('#logoutBtn').click(function(){
// 	  localStorage.clear();
// 	  sessionStorage.clear();
// 	  alert('Logout Successfully ');
// 	  location.reload();
//   });
// var url = 'http://restaulogy.com/restaurant_in/service/service_promotion.php?tag=get_prom_det&prom_id='+id+'&is_restaurant=1';
// $.ajax({
// 	url : url,
// 	type : "GET",
// 	success : function(response){
// 		console.log(response);
// 		var result = JSON.parse(response);
// 		if(result.success==1){
// 			var prom_det = result.prom_det;
			
// 			$('#proDetailsDiv').append("<div class=''><div class='prom_det_title'>"+prom_det.title.toUpperCase()+"</div><div class='prom_det_date'>EXPIRES ON - "+getFormattedDate(prom_det.end_date)+"</div><hr><div class='prom_det_img'><img src="+prom_det.restaurant_logo+"></div><div class='prom_det_comment'>"+prom_det.comments+"</div><div class='ui-grid-a'><div class='ui-block-a'><button class='ui-btn ui-icon-star ui-btn-icon-left'>Share With</button></div><div class='ui-block-b'><button class='ui-btn ui-icon-gear ui-btn-icon-left'>Add to Calendar</button></div></div><div class='ui-grid-a'><div class='ui-block-a'><button class='ui-btn ui-icon-comment ui-btn-icon-left'>Remind Me</button></div><div class='ui-block-b'><button class='ui-btn ui-icon-mail ui-btn-icon-left'>Email a friend</button></div></div></div>");
// 		}
// 	},
// 	error : function(response){
// 		console.log(response);
// 	}
// }) 

// function getFormattedDate(dateValue) {
//   var newDate = new Date(dateValue);
//   var day = newDate.getDate();
//   var month = newDate.getMonth() + 1;
//   var year = newDate.getYear()+1900;
//   return day + '/' + month + '/' + year;
// }
})