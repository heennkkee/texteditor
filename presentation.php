<html>
<head>
    <title>WYSIWYG Henrik</title>
    <link rel="stylesheet" type="text/css" href="wysiwyg.css">
    <style>
        body {
            background-image: url('testdata/background.png');
            background-repeat: no-repeat;
            background-size: 100%;
            font-family: 'Courier New';
        }
        .header {
            width: 100%;
        }
        .header .title {
            display: block;
            font-size: 50pt;
            font-weight: bolder;
            width: 565px;
            margin: 50px auto;
        }
        .content {
            background-color: rgba(255, 255, 255, 0.6);
            width: 900px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="header" id="header"><span class="title">WYSIWYG Henrik</span></div>
    <div class="content" id="content">
        <div align="center"><font size="6">Welcome</font></div>
        <div align="center"><font size="2"><b>(try to edit me...)</b></font></div>
    </div>

    <script src="wysiwyg.js"></script>
    <script>
        initWYSIWYG(document.getElementById('content'), {border:'', state:'detached', display: 'block', width: 900, parentMargin: '0 auto', toolbarBackground: 'transparent'});
    </script>
</body>
</html>
