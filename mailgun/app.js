var api_key = '2a1a24a3f02af46e3a611d592b668895-a5d1a068-0505c483';
var domain = 'sandbox960bcbf02bb34e8095d2f0a951863161.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'Aman <amanullah8191@gmail.com>',
  to: 'amanullah8191@gmail',
  subject: 'Hello Aman from mailgun',
  text: 'Testing mailgun'
};
 
mailgun.messages().send(data, function (error, body) {
    if(error){
        console.log(error);
    }
  console.log(body);
});