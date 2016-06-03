<?php include('../mall/header.php'); ?>
<link rel="stylesheet" type="text/css" href="style.css">

<div class="playbox" id="playbox">
    <div>
        <ul>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand">execCommand</a></li>
            <li><a href="http://codepen.io/netsi1964/full/QbLLGW/">Execcommand codepen</a></li>
            <li><a href="https://design.google.com/icons/">Google icons</a></li>
        </ul>
    </div>
    <div id="myArea">

    </div>
</div>
<?php include('../mall/js.php');?>
<script src="wysiwyg.js"></script>
<script>
    initWYSIWYG(document.getElementById('myArea'));
</script>
<?php include('../mall/footer.php');?>
