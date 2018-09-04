<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
</head>
<body>
<style>
    .code-block {
        border-style: solid;
        border-color: #4aa0e6;
        padding: 10px;
        max-width: 50px;

    }
</style>
<div>
    Iae {{ $username }},
    <br>
    Seu código para redefinir sua senha foi gerado.
    <br>
    <div class='code-block'>
        {{ $token }}
    </div>
    <br>


</div>

</body>
</html>