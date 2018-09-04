<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    Iae {{ $name }},
    <br>
    Valeu por registrar-se. Lembre-se de completar seu registro!
    <br>
    Clique no link abaixo ou copie e cole na barra de endereço para confirmar seu email:
    <br>

    <a href="{{ $verification_link }}">Confirmar email</a>

    <br/>
</div>

</body>
</html>