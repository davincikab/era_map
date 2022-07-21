<?php
session_start();
 if( !isset( $_SESSION['USERID'] ) )
  {
   header("Location: login.php");
   }
$title = "Seasonwatch :: Add Observation";
include "cmnInc.php";
include 'cmnUtilies.php';
include "calendar.php";
?>

<link rel="stylesheet" href="<?php echo $csspath;?>editobservation.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js"></script>
<!-- Propeller Bootstrap datetimepicker -->
<script type="text/javascript" language="javascript" src="datetimepicker/js/bootstrap-datetimepicker.js"></script>


</head>
<?php
 if(isset($_GET['from'])){
	 $from=$_GET['from'];
 }
 if (isset($_GET['id'])) {
         $user_id= intval($_GET['id']);
 }
 if (isset($_GET['user_tree_id'])) {
        $user_tree_id= intval($_GET['user_tree_id']);
 }
 if (isset($_GET['page'])) {
    $page= intval($_GET['page']);
}
 $url=$apipath."/tree/readATreeInfo.php?id=$user_id&user_tree_id=$user_tree_id";


 $client = curl_init($url);
 curl_setopt($client,CURLOPT_RETURNTRANSFER,true);
 $response = curl_exec($client);
 $result = json_decode($response);
 $result= cvf_convert_object_to_array($result);
 curl_close($client);
 $cmnUtil = new cmnUtilies();
 /* API call*/?>



<body id="wrapper">
   <?php include "header.php";?>
   <section>
      <div class="container">
      </div>
      <!--Container-->
   </section>
   </div>
   <div class="clearfix"></div>
   <br>
	<br>
	<?php include "footer.php"?>
</body>
 <script src="<?php echo $jspath;?>addobservation.js"></script>
