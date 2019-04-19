var recentSearch = {
    recSearch: [],
    init: function()
    {
        if(firebaseModule.myObj && firebaseModule.myObj.favorites)
        {
            firebaseModule.myObj.favorites.forEach(fav => {
                this.add(fav, true);
            });
        }

/*         this.add("add new favorite");

        this.add("remove this fav");
        this.remove("remove this fav");
 */
        this.draw();

    },

    add: function(favToAdd, reverse = false)
    {
        if(recentSearch.recSearch != undefined)
        {
            if(reverse == true)
            {
                this.recSearch.push(favToAdd);
            }
            else
            {
                if(this.recSearch.unshift(favToAdd) > 5)
                {
                    this.recSearch.pop();
                }
            }
            
            
            this.updateFirebase();
        }
        else
        {
            this.recSearch = [favToAdd];
        }
        this.draw();
    },

    remove: function(favToRemove)
    {
        for(let i in this.recSearch)
        { 
            if (this.recSearch[i] === favToRemove) 
            {
                this.recSearch.splice(i, 1); 
            }
         }
         this.updateFirebase();
    },

    draw: function()
    {
        $("#recList").empty();
        this.recSearch.forEach(fav =>
        {
            $("#recList").append("<a class=\"recentSearch\" value=" + fav + " href=\"#\">" + fav + "</a>")

        })
        $(".recentSearch").click(function(event){
            event.preventDefault();
            console.log($(this));
            artistSearchMod.search($(this).attr("value"), false);
        });
    },

    updateFirebase: function()
    {
        if(firebaseModule.myObj)
        {
            firebaseModule.myObj.favorites = this.recSearch;
            firebaseModule.updateUser();
        }
    }
    
};

let firebaseModule = {
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
        function getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          }

        if(getCookie("UID") != "") //have a user id should verify that it exists on the server
        {
            firebaseModule.myID = getCookie("UID");
        }
        else //user id locally doesnt exist so create a new one
        {
            let newUser = {
                userID: firebaseModule.lastUID, favorites:[], recent:[]
            };
            firebaseModule.myID = firebaseModule.lastUID;
            firebaseModule.pushUser(newUser);
            document.cookie = "UID=" + firebaseModule.myID;
        }

        recentSearch.init();
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