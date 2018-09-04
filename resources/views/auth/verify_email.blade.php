<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.3.3/dist/semantic.min.css">
</head>
<body style="background-color: #DADADA">
    <div class='ui container'>
        <div class='ui one column grid'>
            <div class='row'>
                <div class='column' style='margin-top: 20px'>
                    <div class='ui {{ $color }} message'>
                        <div class='header'>
                            {{ $message }}
                        </div>
                        <p>
                            <a href="/app">Clique aqui</a> para ir para o site!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>