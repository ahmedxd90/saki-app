/*
 * Simple Cloud Code Example
 */

const OneSignal = require('@onesignal/node-onesignal');

const app_id = "";
const user_key_token = "";
const rest_api_key = "";

const configuration = OneSignal.createConfiguration({
    userAuthKey: user_key_token,
    restApiKey: rest_api_key,
});
const client = new OneSignal.DefaultApi(configuration);

//////// Send push notifications ///////
Parse.Cloud.define('sendPush', async (request) => {

  var userQuery = new Parse.Query(Parse.User);

  if(request.params.type == "live"){

    userQuery.containedIn("objectId", request.params.followers);
  } else {

    userQuery.equalTo("objectId", request.params.receiverId);
  }

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.matchesQuery('user', userQuery);

  const notification = new OneSignal.Notification();
  notification.app_id = app_id;
  notification.headings = { en: request.params.title};  
  notification.contents = { en: request.params.alert};
  notification.large_icon = request.params.avatar;
  notification.big_picture = request.params.big_picture;
  notification.target_channel = "Push";
  notification.include_aliases = {
    external_id: [request.params.receiverId]
  };  
  notification.data = {
    view: request.params.view,
    alert: request.params.alert,
    senderId: request.params.senderId,
    senderName: request.params.senderName,
    type: request.params.type,
    chat: request.params.chat,
    avatar: request.params.avatar,
    objectId: request.params.objectId,
  };  

  return client.createNotification(notification)
    .then(function () {
      // Push sent!
      console.log("Push successfully");
      return "sent";
    }, function (error) {
      // There was a problem :(
        console.log("Push Got an error " + error.code + " : " + error.message);
        return Promise.reject(error);
    });
});

Parse.Cloud.define('updatePassword', async (request)=> {
    var username = request.params.username;
    var password = request.params.password;


    var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("username", username);

       const user = await userQuery.first({
           useMasterKey: true
         });

         user.set("password", password);
         user.set("secondary_password", password);


         return user.save(null, {
             useMasterKey: true
           }).then(function () {

             return "updated";
           })
           .catch(function (error) {

             return Promise.reject(error);

           });

});

////// Send gift ///////
Parse.Cloud.define('send_gift', async (request) => {

  var objectId = request.params.objectId;
  var credits = request.params.credits;

  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", objectId);

  const user = await userQuery.first({
    useMasterKey: true
  });

  user.increment("diamonds", credits);
  user.increment("diamondsTotal", credits);

  return user.save(null, {
      useMasterKey: true
    }).then(function () {

      return "updated";
    })
    .catch(function (error) {

      return Promise.reject(error);

    });

});

////// Send gift to Agency ///////
Parse.Cloud.define('send_agency', async (request) => {

  var objectId = request.params.objectId;
  var credits = request.params.credits;

  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", objectId);

  const user = await userQuery.first({
    useMasterKey: true
  });

  user.increment("diamondsAgency", credits);
  user.increment("diamondsAgencyTotal", credits);

  return user.save(null, {
      useMasterKey: true
    }).then(function () {

      return "updated";
    })
    .catch(function (error) {

      return Promise.reject(error);

    });

});

Parse.Cloud.define('check_phone_number', async (request) => {

  var phone_number = request.params.phone_number;
  //var password = request.params.password;

  let UserQuery = new Parse.Query(Parse.User);
  UserQuery.equalTo("phone_number_full", phone_number);
  UserQuery.first({useMasterKey: true}).then(function(user){
    //user.set("password", password);
    //user.set("password_secondary", password);
    return Promise.reject(100);

}).catch(function (error) {

    console.error("error " + error);
    return Promise.reject(error);
});

});

Parse.Cloud.beforeLogin(async (request) => {
  const { object: user }  = request;

  if(user.get('accountDeleted')) {

   throw new Parse.Error(340, 'Account Deleted');

  } else if(user.get('activationStatus')) {

     throw new Parse.Error(341, 'Access denied, you have been blocked.');
  }

});

// Restart Pk Battle
Parse.Cloud.define('restartPkBattle', async (request) => {

  var liveId = request.params.liveChannel;
  var times = request.params.times;

  var liveQuery = new Parse.Query("Streaming");
  liveQuery.equalTo("streaming_channel", liveId);
  liveQuery.equalTo("streaming", true);    
  liveQuery.equalTo("battle_status", "battle_alive");  

  const liveStreaming = await liveQuery.first();
  liveStreaming.set("his_points", 0);
  liveStreaming.set("my_points", 0);
  liveStreaming.set("repeat_battle_times", times);     

  liveStreaming.save();  
});

// Save his battle point
Parse.Cloud.define('save_hisBattle_points', async (request) => {

  var points = request.params.points;
  var liveId = request.params.liveChannel;

    var liveQuery = new Parse.Query("Streaming");
    liveQuery.equalTo("streaming_channel", liveId);
    liveQuery.equalTo("streaming", true);    
    liveQuery.equalTo("battle_status", "battle_alive");  

    const liveStreaming = await liveQuery.first();
    liveStreaming.set("his_points", points);
    liveStreaming.save();  
});

// Follow user
Parse.Cloud.define('follow_user', async (request) => {

  var authorId = request.params.authorId;
  var receiverId = request.params.receiverId;

  var userQueryAuthor = new Parse.Query(Parse.User);
  userQueryAuthor.equalTo("objectId", authorId);
  const author = await userQueryAuthor.first({
    useMasterKey: true
  });

  var userQueryReceiver = new Parse.Query(Parse.User);
  userQueryReceiver.equalTo("objectId", receiverId);
  const receiver = await userQueryReceiver.first({
    useMasterKey: true
  });

  author.addUnique("following", receiverId);
  receiver.addUnique("followers", authorId);

  await author.save(null, {useMasterKey: true});
  return receiver.save(null, {
    useMasterKey: true
  }).then(function () {

    return author;
  })
  .catch(function (error) {

    return Promise.reject(error);

  });

});


// UnFollow user
Parse.Cloud.define('unfollow_user', async (request) => {

  var authorId = request.params.authorId;
  var receiverId = request.params.receiverId;


  var userQueryAuthor = new Parse.Query(Parse.User);
  userQueryAuthor.equalTo("objectId", authorId);
  const author = await userQueryAuthor.first({
    useMasterKey: true
  });

  var userQueryReceiver = new Parse.Query(Parse.User);
  userQueryReceiver.equalTo("objectId", receiverId);
  const receiver = await userQueryReceiver.first({
    useMasterKey: true
  });

  author.remove("following", receiverId);
  receiver.remove("followers", authorId);

  await author.save(null, {useMasterKey: true});
  return receiver.save(null, {
    useMasterKey: true
  }).then(function () {

    return author;
  })
  .catch(function (error) {

    return Promise.reject(error);

  });

});