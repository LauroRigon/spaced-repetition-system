import React, { Component } from 'react'
import OneSignal from 'OneSignal'
import api from 'app/services/api'

export default class OneSignalButton extends Component {
  componentDidMount () {
    this.initService()
  }

  initService () {    
    OneSignal.push(function() {
      OneSignal.init({
        appId: "75fdcd71-7030-48f3-a8c2-4f57bc06a131",
      });

      OneSignal.on('subscriptionChange', function (isSubcribed){
        if(isSubcribed) {
          OneSignal.getUserId()
            .then(function (userId) {
                api.post('/subscribed-to-push', {id: userId})
            })
        }
      });
    });
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}
