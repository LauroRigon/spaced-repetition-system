<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}"/>
    <!-- <script src="https://cdn.ckeditor.com/ckeditor5/11.1.1/inline/ckeditor.js"></script> -->
    <title>App</title>
</head>
<body>
<div id="root"></div>
<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
<script src="{{ mix('js/app.js') }}"></script>


{{--<script>--}}
  {{--var OneSignal = window.OneSignal || [];--}}
  {{--var axios = new window.$.Axios;--}}

  {{--OneSignal.push(function() {--}}
    {{--OneSignal.init({--}}
      {{--appId: "75fdcd71-7030-48f3-a8c2-4f57bc06a131",--}}
    {{--});--}}

    {{--OneSignal.on('subscriptionChange', function (isSubcribed){--}}
        {{--if(isSubcribed) {--}}
            {{--OneSignal.getUserId()--}}
                {{--.then(function (userId) {--}}
                    {{--axios.post('/api/subscribed-to-push', {id: userId})--}}
                {{--})--}}
        {{--}--}}
    {{--});--}}


  {{--});--}}

{{--</script>--}}
</body>
</html>
