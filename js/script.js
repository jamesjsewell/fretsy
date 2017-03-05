var apiKey = 'qycca7qp2gj078smbdvxdg7b'
var contentNode = document.querySelector('.content')
var headerNode = document.querySelector('.header')

//---------------HTML TOOLING--------------------//

HtmlTemplate = function(t_g, clss, i_d, con, hrf){
    
    this.tag = '<' + t_g + " ",
    this.class = 'class = ' + '"' + clss + '" ',
    this.id = 'id = ' + '"' + i_d + '" ',
    this.href = 'href = ' + hrf
    this.content = con,
    this.close = '<' + '/' + t_g + '>'
}

//----------------------------------------------//
//-------------------VIEWS---------------------//

//home page 
var HomepageView = Backbone.View.extend({

    initialize: function(){
        this.listenTo(this.collection, 'sync', this.render)
    },
    render: function(){
        
        var arrayOfModels = this.collection.models[0]

        var htmlString = ""

        for(var i = 0; i < arrayOfModels; i++){

            var currentModel = arrayOfModels[i]
            var descriptionHtml = new HtmlTemplate('div','listing', 'listing'+i, currentModel.description)
            var titleHtml = new HtmlTemplate('h2','listingTitle', 'listingTitle'+i, currentModel.description)
        
        }

        console.log(descriptionHtml)











    },
})

//search results
var SearchResultsView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.collection, 'sync', this.render)
    },
    render: function(){
        console.log('rendered search results')
    }
    
})

//item view
var ItemView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.collection, 'sync', this.render)
    },
    render: function(){
        console.log('rendered search results')
    },
})

//---------------------------------------------------------//

//-----------------MODELS AND COLLECTIONS--------------------//

var HomepageCollection = Backbone.Collection.extend({

    url: 'https://openapi.etsy.com/v2/listings/active.js',
    parse: function(response) {
        console.log(response)
        return response.results
    }
});

var SearchCollection = Backbone.Collection.extend({

    url: 'https://openapi.etsy.com/v2/listings/active.js',
    parse: function(response) {
        console.log(response)
        return response.results
    }
});

var ItemModel = Backbone.Model.extend({

    url: 'https://openapi.etsy.com/v2/listings/active.js',
    parse: function(response) {
        console.log(response)
        return response.results
    }
});
//------------------------------------------------------//

//--------------------/CONTROLLER/----------------------//

var AppRouter = Backbone.Router.extend({
    
    routes: {

        "home": "homePage",
        "search/:query": "searchResults"
        // matches http://example.com/#anything-here
    },

    homePage: function(){

        homeCollectionInstance = new SearchCollection
        homeCollectionInstance.fetch({ 

            dataType: 'jsonp',
        
            data: {
                'api_key': apiKey,
                'tags': 'guitar'    
            }
        })
        console.log(homeCollectionInstance.url)
        //puts a collection on the home page
        new HomepageView({

            collection: homeCollectionInstance

        }) 
        
        },

    searchResults: function(selection){

        console.log('searched Something')
        searchCollectionInstance = new SearchCollection
        searchCollectionInstance.fetch({

            dataType: 'jsonp',

            data: {
                'api_key': apiKey,
                'q=': selection
            }
        })

        new SearchResultsView({
    
            collection: searchCollectionInstance

        }) 

        },

    detailsOfItem: function(selection){

        console.log('searched Something')
        itemModelInstance = new ItemModel
        itemModelInstance.fetch({

            dataType: 'jsonp',

            data: {
                'api_key': apiKey,
                'q': 'guitar'
            }
        })

        new ItemView({

            model: itemModelInstance

        }) 

        }
});

// Initiate the router
var app_router = new AppRouter;
  
// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();