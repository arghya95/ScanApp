import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import * as firebase from 'firebase';
import { Push, PushOptions, PushObject } from '@ionic-native/push';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  devices:any;
  isScanning:boolean;
  users:any;
  time:any;
  count:number;

  constructor(public navCtrl: NavController,private ble: BLE,public ngZone:NgZone,private push: Push) {
    this.users = [];
    // this.devices = [];
    let checkref = firebase.database().ref('users/');
    checkref.on('value',(snap1:any)=>{
      if(snap1.val()){
        // console.log(snap1.val())
       
        let data = snap1.val();
       for(let key in data) {
         
        data[key].uid = key;
        // console.log(data[key])
        this.users.push(data[key]);
        
       }
      }
    })
    
    this.count = 0;

    this.ble.isEnabled().then(()=>{
      console.log('bluetooth already enabled');

      console.log('Scanning Started');
      this.devices = [];
      this.isScanning = true;
      this.ble.startScan([]).subscribe(device => {
        this.ngZone.run(() => {
        console.log(device);
        this.devices.push(device);

        setTimeout(() => {
          this.deviceFound()
        }, 3000);
        });
      });
      
  /*       setTimeout(() => {
            this.ble.stopScan().then(() => {

            this.ngZone.run(() => {
            console.log('Scanning has stopped');
            console.log(JSON.stringify(this.devices))
            this.isScanning = false;
            });
          });
        }, 5000); */

      })
      .catch(()=>{
        this.ble.enable().then(()=>{
          console.log('bluetooth enabling....');
          console.log('Scanning Started');
          this.devices = [];
          this.isScanning = true;
          this.ble.startScan([]).subscribe(device => {
            this.ngZone.run(() => {
            console.log(device);
            this.devices.push(device);
    
            setTimeout(() => {
              this.deviceFound()
            }, 7000);
            });
          });
          
/*           setTimeout(() => {
            this.ble.stopScan().then(() => {
              this.ngZone.run(() => {
            console.log('Scanning has stopped');
            console.log(JSON.stringify(this.devices))
            this.isScanning = false;
              });
          });
          }, 5000); */
         
        })
        .catch((e)=>{
          console.log('error '+e);
        })
      })
      
     
  }

 deviceFound() {

    console.log(this.users)
    console.log(this.users.length)
    for(var i=0;i<this.users.length;i++) {
      console.log(this.users.length)
      for(var j=0;j<this.devices.length;j++) {
        console.log(this.devices[j].id)
        console.log(this.users[i].macAddress)
        if(this.devices[j].id == this.users[i].macAddress) {
          this.count += 1
          this.getTime();
          
         /*  firebase.database().ref('users/'+this.users[i].uid+'/deviceHistory/').push({
           InTime: this.time
          });
 */
this.sendNotification()
          alert('arghya device started '+this.time);

        }
        else {
          alert('not found')
        }
      }
      
    }

    if(this.count == 1) {
      alert('intime '+this.time);
    }
    else if(this.count == 2) {
      alert('out time '+this.time)
    }


    /* const push = PushNotification.init({
      android: {
      },
      ios: {
        alert: "true",
        badge: true,
        sound: 'false'
      },
      windows: {}
    });
    
    push.on('registration', (data) => {
      console.log(data.registrationId);
    });
    
    push.on('notification', (data) => {
      console.log(data.message);
      console.log(data.title);
      console.log(data.count);
      console.log(data.sound);
      console.log(data.image);
      console.log(data.additionalData);
    });
    
    push.on('error', (e) => {
      console.log(e.message);
    });
 */


  }

sendNotification() {
  // to check if we have permission
this.push.hasPermission()
.then((res: any) => {

  if (res.isEnabled) {
    console.log('We have permission to send push notifications');
  } else {
    console.log('We do not have permission to send push notifications');
  }

});

// Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
this.push.createChannel({
id: "testchannel1",
description: "My first test channel",
// The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
importance: 3
}).then(() => console.log('Channel created'));

// Delete a channel (Android O and above)
this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

// Return a list of currently configured channels
this.push.listChannels().then((channels) => console.log('List of channels', channels))

// to initialize push notifications

const options: PushOptions = {
 android: {},
 ios: {
     alert: 'true',
     badge: true,
     sound: 'false'
 },
 windows: {},
 browser: {
     pushServiceURL: 'http://push.api.phonegap.com/v1/push'
 }
};

const pushObject: PushObject = this.push.init(options);


pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
}


  getTime() {
    var currentdate = new Date(); 
    this.time = currentdate.getDate() + "/"
              + (currentdate.getMonth()+1)  + "/" 
              + currentdate.getFullYear() + " @ "  
              + currentdate.getHours() + ":"  
              + currentdate.getMinutes() + ":" 
              + currentdate.getSeconds();
      return this.time;
   }

}
