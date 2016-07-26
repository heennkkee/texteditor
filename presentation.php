<?php
$dsn = 'sqlite:data/presentation.sqlite';
try {
    $db = new PDO($dsn);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {

}
?>

<html>
<head>
    <title>WYSIWYG Henrik</title>
    <link rel="stylesheet" type="text/css" href="wysiwyg.css">
    <style>
        body {
            background-image: url('data/background.png');
            background-repeat: repeat-y;
            font-family: 'Courier New';
            overflow-y: scroll;
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
            background-color: rgba(255, 255, 255, 0.8);
            color: #4C4C4C;
            width: 900px;
            margin: 0 auto;
            padding: 5px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header" id="header"><span class="title">WYSIWYG Henrik</span></div>

    <?php
        $sth = $db->prepare('select case when b.text = p.text then "true" else "false" end AS "check" from backup b, presentation p');
        $sth->execute();
        $res = $sth->fetchAll(PDO::FETCH_ASSOC);
        if ($res[0]['check'] == 'false') {
        ?>
            <div class="content" style="margin-bottom:20px;">
                <div align="center">
                    <p>
                        <font size="4">
                            <b>Did you just arrive to the page?</b><br>
                            We believe in a free mind, but please restore the content of the site to the original before you judge it.<br>
                            <a href="#" onclick="restoreDB()">Restore me!</a>
                        </font>
                    </p>
                </div>
            </div>
        <?php
        }
        ?>

    <div class="content" id="myContent">
        <?php
            $sth = $db->prepare('SELECT * FROM PRESENTATION');
            $sth->execute();
            $res = $sth->fetchAll(PDO::FETCH_ASSOC);
            echo $res[0]['TEXT'];
        ?>
    </div>
    <script src="wysiwyg.js"></script>
    <script>
        var state = (window.orientation === undefined) ? 'detached' : 'attached';
        var options = {
            editor: {
                border:'',
            },
            parent: {
                display: 'block',
                width: 910,
                margin: '0 auto',
            },
            toolbar: {
                state: state,
                background: 'rgba(255, 255, 255, 0.8)',
            },
            editable: 'false'
        };

        initWYSIWYG(document.getElementById('myContent'), options);

        document.getElementById('myContent').addEventListener('save', function (event) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "data/save_data.php", true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send('text=' + event.text);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var text = JSON.parse(xmlhttp.responseText).output;
                }
            };
        });

        function restoreDB() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "data/restore.php", true);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    window.location.reload(true);
                }
            };

        }
    </script>
</body>
</html>
