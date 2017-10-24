$(document).ready(function(){
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
	var newregex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/g;
	var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	$('input').tooltip('destroy');
    if (phoneNumber == null || phoneNumber == "") {
		$('#phoneNumber').attr('title','Enter Number');
		$('#phoneNumber').tooltip('show');
      $('#phoneNumber').addClass('error');
      return;
    } else if(!newregex.test(phoneNumber)){
		$('#phoneNumber').attr('title','Invalid Number');
		$('#phoneNumber').tooltip('show');
		$('#phoneNumber').addClass('error');
      return;
	}else if(emailId!=''&&emailId!=null){
		if(!emailRegex.test(emailId)){
			$('#emailId').attr('title','Invalid Email Id');
		$('#emailId').tooltip('show');
		$('#emailId').addClass('error');
		return;
		}
		
	}else if (fname == null || fname == "") {
      $('#fname').addClass('error');
	  $('#fname').attr('title','Enter First name');
		$('#fname').tooltip('show');
      return;
    } else if (lname == null || lname == "") {
      $('#lname').addClass('error');
	  	  $('#lname').attr('title','Enter Last name');
		$('#lname').tooltip('show');
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
          location.href = 'index.html';
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