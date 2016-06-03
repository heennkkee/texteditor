
<html>
<head>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div id="editMe" style="width: 800px;">
        Ursprunget finns i en allmän europeisk långhårig vallhundstyp vars kännemärke är kraftigt bepälsade huvuden, bl.a. polski owczarek nizinny, bearded collie och schafpudel.
        Rasen räddades efter andra världskriget, rasklubben bildades 1957. 1952 erkändes den interimiskt den av Nederländernas kennelklubb Raad van Beheer op Kynologisch Gebied in Nederland. Rasstandarden skrevs 1954, då även stamboken började föras. 1971 erkändes den som ras av den internationella hundorganisationen FCI.
    </div>
    <script src="wysiwyg.js"></script>
    <script>
        window.myEditor.init(document.getElementById('editMe'), {});
        document.getElementById('editMe').addEventListener('save', function () {
            console.log("Heard save event.");
        });
    </script>
</body>
