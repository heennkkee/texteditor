<html>
<head>
    <title>WYSIWYG Henrik</title>
    <link rel="stylesheet" type="text/css" href="wysiwyg.css">
    <style>
        body {
            background-image: url('data/background.png');
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
            background-color: rgba(255, 255, 255, 0.8);
            color: #4C4C4C;
        }
    </style>
</head>
<body>
    <div class="header" id="header"><span class="title">WYSIWYG Henrik</span></div>

    <div class="content" id="content">
        <?php
            $dsn = 'sqlite:data/presentation.sqlite';
            try {
                $db = new PDO($dsn);
                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {

            }
            $sth = $db->prepare('SELECT * FROM PRESENTATION');
            $sth->execute();
            $res = $sth->fetchAll(PDO::FETCH_ASSOC);
            echo $res[0]['TEXT'];
        ?>
    </div>


    <script src="wysiwyg.js"></script>
    <script>
        var options = {
            border:'',
            state:'detached',
            display: 'block',
            width: 900,
            parentMargin: '0 auto',
            toolbarBackground: 'transparent'
        };

        initWYSIWYG(document.getElementById('content'), options);

        document.getElementById('content').addEventListener('save', function (event) {
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
    </script>
</body>
</html>
