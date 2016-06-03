<html>
<head>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div style="width: 100%; font-family: 'Calibri';">
        <h1>Min blogg</h1>
    </div>
    <?php
        $dsn = 'sqlite:testdata/testData.sqlite';
        try {
            $db = new PDO($dsn);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {

        }
        $sth = $db->prepare('SELECT * FROM POSTS');
        $sth->execute();
        $res = $sth->fetchAll(PDO::FETCH_ASSOC);
        echo '<div id="editMe" style="width: 800px;">';
        echo $res[0]['TEXT'];
        echo '</div>';
        echo '<input type="hidden" value="' . $res[0]['ID'] . '" id="post-id">';
    ?>

    <script src="wysiwyg.js"></script>
    <script>
        window.myEditor.init(document.getElementById('editMe'), {border: ''});

        document.getElementById('editMe').addEventListener('save', function (event) {
            var text = document.getElementById('editMe').innerHTML.replace(/&nbsp;/g, ' ');
            var id = document.getElementById('post-id').value;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "example_save_data.php", true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send("id=" + id + '&text=' + text);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var text = JSON.parse(xmlhttp.responseText).output;
                }
            };
        });
    </script>
</body>
