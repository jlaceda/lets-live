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
    

    init: function()
    {
        firebase.initializeApp(this.config);
        this.database = firebase.database();
        this.recentSearchRef = this.database.ref("/recentSearch");
        this.userIDSRef = this.database.ref("/userIDS");
        this.variablesRef = this.database.ref("/vars");
        this.addListeners();
    },

    addListeners: function()
    {
        this.variablesRef.on("value", function (snapshot) {
            firebaseModule.lastUID = snapshot.val().lastUID;
            firebaseModule.lastSearch = snapshot.val().lastSearchNum;
        }, firebaseModule.handleErrors);

        
    },

    updateVars: function()
    {
        this.variablesRef.update({lastUID: this.lastUID, lastSearchNum: this.lastSearch});
    }
    
}
firebaseModule.init();

//testing
firebaseModule.updateVars();