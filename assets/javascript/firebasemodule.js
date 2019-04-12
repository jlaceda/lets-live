var favorites = {
    favArr: [],
    init: function()
    {
        if(firebaseModule.myObj.favorites)
        {
            firebaseModule.myObj.favorites.forEach(fav => {
                this.add(fav);
            });
        }

        this.add("add new favorite");

        this.add("remove this fav");
        this.remove("remove this fav");

        this.draw();

    },

    add: function(favToAdd)
    {
        if(favorites.favArr != undefined)
        {
            this.favArr.push(favToAdd);
            this.updateFirebase();
        }
        else
        {
            this.favArr = [favToAdd];
        }
    },

    remove: function(favToRemove)
    {
        for(let i in this.favArr)
        { 
            if (this.favArr[i] === favToRemove) 
            {
                this.favArr.splice(i, 1); 
            }
         }
         this.updateFirebase();
    },

    draw: function()
    {
        let i = 0;
        $("#favList").empty();
        this.favArr.forEach(fav =>
        {
            $("#favList").append("<a href=\"#\">" + i++ + ": " + fav + "</a>")
        })
    },

    updateFirebase: function()
    {
        firebaseModule.myObj.favorites = this.favArr;
        firebaseModule.updateUser();
    }
    
};

var firebaseModule = {
    config: 
    {
        apiKey: "AIzaSyDlnKhpzpyOnPU0Qkp91SuIqjVLbJ6L37Q",
        authDomain: "group-project-1-a401c.firebaseapp.com",
        databaseURL: "https://group-project-1-a401c.firebaseio.com",
        projectId: "group-project-1-a401c",
        storageBucket: "",
        messagingSenderId: "740996231944"
    },
    database: null,
    recentSearchRef: null,
    userIDSRef: null,
    variablesRef: null,
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
        this.addListeners();
        //after 1 second to create the user if they are on first load
        setTimeout(this.initUser, 1000);


        
    },

    initUser: function()
    {
        if(localStorage.getItem("UID")) //have a user id should verify that it exists on the server
        {
            firebaseModule.myID = localStorage.getItem("UID");
        }
        else //user id locally doesnt exist so create a new one
        {
            let newUser = {
                userID: firebaseModule.lastUID, favorites:[], recent:[]
            };
            firebaseModule.myID = firebaseModule.lastUID;
            firebaseModule.pushUser(newUser);
            localStorage.setItem("UID", firebaseModule.myID);
        }

        favorites.init();
    },

    addListeners: function()
    {
        //update the iterator variables
        this.variablesRef.on("value", function (snapshot) {
            firebaseModule.lastUID = snapshot.val().lastUID;
            firebaseModule.lastSearch = snapshot.val().lastSearchNum;
        }, firebaseModule.handleErrors);

        //find my object
        this.userIDSRef.on("child_added", function (snapshot) {
            if(localStorage.getItem("UID"))
            {
                if(snapshot.val().userID == localStorage.getItem("UID"))
                {
                    firebaseModule.myObj = snapshot.val();
                }
            }
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
        this.database.ref("/userIDS/" + this.myID).update(this.myObj);
    }
    
}
firebaseModule.init();





//testing
/* firebaseModule.updateVars();

firebaseModule.pushSearch({Artist: "asdfj", isFav: false, timeout: 10000});
firebaseModule.pushUser({userID: (firebaseModule.lastUID), favorites:["asdf"], recent:[1,2,3,4,5]});

firebaseModule.pushSearch({Artist: "asdfj", isFav: false, timeout: 10000});
firebaseModule.pushUser({userID: (firebaseModule.lastUID), favorites:["asdf"], recent:[1,2,3,4,5]});
firebaseModule.updateUser();
 */