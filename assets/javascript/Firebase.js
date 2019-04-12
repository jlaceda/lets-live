"use strict";
firebaseModule = {
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
    init : function()
    {
        firebase.initializeApp(config);
        this.database = firebase.database();
        this.recentSearchRef = this.database.ref("/recentSearch");
        this.UserIDRef = this.database.ref("/UserID");
    }
    
}
firebaseModule.init();