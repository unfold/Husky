<!doctype html>
<html>
	<head>
		<meta charset=utf-8 />
		<title>TouchScroll.js example</title>
		<style>
			#container .box {
				width: 500px;
				height: 500px;
				margin-bottom: 100px;
				background: #ccc;
			}
		</style>
	</head>
	<body>
		<div id="container">
			<?php for($i=0; $i < 50; $i++): ?>
			<div class="box">Content</div>
			<?php endfor ?>
		</div>
		
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
		<script src="../touchScroll.js"></script>
		<script>
			$(function() {
				$('#container').touchScroll();
			});
		</script>
	</body>
</html>