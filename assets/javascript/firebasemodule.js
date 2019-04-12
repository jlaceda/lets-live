"use strict";
let firebaseModule = {
    config : 
    {
        apiKey: "AIzaSyDlnKhpzpyOnPU0Qkp91SuIqjVLbJ6L37Q",
        authDomain: "group-project-1-a401c.firebaseapp.com",
        databaseURL: "https://group-project-1-a401c.firebaseio.com",
        projectId: "group-project-1-a401c",
        storageBucket: "",
        messagingSenderId: "740996231944"
    },
    database: null,
    playersRef: null,
    chatRef: null,
    lastSearch: 0,
    lastUID: 0,
    myID: 0,
    myObj: null,

    init: function()
    {
        firebase.initializeApp(this.config);
        this.database = firebase.database();
        this.recentSearchRef = this.database.ref("/recentSearchs");
        this.userIDSRef = this.database.ref("/userIDS");
        this.variablesRef = this.database.ref("/vars");

        if(localStorage.getItem("UID")) //have a user id should verify that it exists on the server
        {
            this.myID = localStorage.getItem("UID");
        }
        else //user id locally doesnt exist so create a new one
        {
            let newUser = {
                userID: this.lastUID, favorites:[1], recent:[1]
            };
            this.myID = this.lastUID;
            this.pushUser(newUser);
            localStorage.setItem("UID", this.myID);
        }

        this.addListeners();
    },

    addListeners: function()
    {
        this.variablesRef.on("value", function (snapshot) {
            console.log(snapshot.val());
            firebaseModule.lastUID = snapshot.val().lastUID;
            firebaseModule.lastSearch = snapshot.val().lastSearchNum;
        }, firebaseModule.handleErrors);

    },

    updateVars: function()
    {
        this.variablesRef.update({lastUID: this.lastUID, lastSearchNum: this.lastSearch});
    },

    pushSearch: function(search)
    {
        this.database.ref("/recentSearchs/" + this.lastSearch++).set(search);
        this.updateVars();
    },

    pushUser: function(user)
    {
        this.database.ref("/userIDS/" + this.lastUID++).set(user);
        this.updateVars();
    },

    updateUser: function()
    {
        this.userIDSRef.on("child_added", function (snapshot) {
            console.log(snapshot.val());
        }, firebaseModule.handleErrors);
    }
    
}
firebaseModule.init();


//testing
firebaseModule.updateVars();

firebaseModule.pushSearch({Artist: "asdfj", isFav: false, timeout: 10000});
firebaseModule.pushUser({userID: (firebaseModule.lastUID), favorites:["asdf"], recent:[1,2,3,4,5]});

firebaseModule.pushSearch({Artist: "asdfj", isFav: false, timeout: 10000});
firebaseModule.pushUser({userID: (firebaseModule.lastUID), favorites:["asdf"], recent:[1,2,3,4,5]});
firebaseModule.updateUser();
