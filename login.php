<?php
$title = "Seasonwatch :: Login";
include "cmnInc.php";

?>

<script type='text/javascript'>
function refreshCaptcha(){
	var img = document.images['captchaimg'];
	img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
}
function refreshCaptchareg(){
        var img = document.images['captchaimgreg'];
        img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
}


</script>

<link href="<?php echo $csspath?>captchastyle.css" rel="stylesheet">

<link rel="stylesheet" href="<?php echo $csspath?>loginReg.css"> 

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="<?php echo $jspath;?>login.js"></script>

</head>
<body id="wrapper">
    <?php include "header.php";?>
    <?php include "StatesApicall.php";
       /*print_r($resultstates);*/?>
    <section>
     <div class="container "  >
        <div class="dashmain-flex">
          <div class="grid50-left">
              <?php  include "userLogin.php";?>
            
          </div> <!--grid50-left-->
          <div class="betweenline"></div>
          <div class="grid50-right">
	    <?php include "userRegister.php";?>
           
          </div><!--grid50-right-->
        </div>
    </div><!-- end of container-->
</section>
</body> 
<br>
    <?php include "footer.php"?>
