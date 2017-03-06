var apiKey = 'qycca7qp2gj078smbdvxdg7b'
var contentNode = document.querySelector('.content')
var headerNode = document.querySelector('.header')

//---------------HTML TOOLING-------------------//

HtmlTemplate = function(t_g, clss, i_d, hrf, type, con){

    this.tag = '<' + t_g + " ",
    this.class = 'class = ' + '"' + clss + '" ',
    this.id = 'id = ' + '"' + i_d + '" ',
    this.href = 'href = ' + hrf 
    this.type = 'type = ' + '"' + type + '"'
    this.content = con,
    this.close = '<' + '/' + t_g + '>'

}

function templateToString(htmlModel){
    return htmlModel.tag + htmlModel.class + htmlModel.id + htmlModel.href + htmlModel.type + ">" + htmlModel.content + htmlModel.close
}

//------------------------------------------------//

//-------------------VIEWS------------------------//

//home page 
var HomepageView = Backbone.View.extend({

    initialize: function(){
        this.listenTo(this.collection, 'sync', this.render)
    },
    render: function(){
        
        var arrayOfModels = this.collection.models
        build_listings_html(arrayOfModels)

    },
})

//search results
var SearchResultsView = Backbone.View.extend({

    initialize: function(){
        this.listenTo(this.collection, 'sync', this.render)
    },
    render: function(){

        var arrayOfModels = this.collection.models
        build_listings_html(arrayOfModels)      
    }
    
})

//item view
var ItemView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.model, 'sync', this.render)
    },
    render: function(){
        
        build_item_html(this.model)
    },
})
//------------------------------------------------//

//-----------------/BUILD HTML/-------------------//

function build_listings_html(arrayOfModels){

    htmlString = ""

    var logoHtml = new HtmlTemplate('h2', 'logoText', 'logoText1', 'none', 'none', 'FRETSY'),
    searchHtml = new HtmlTemplate('input', 'searchField', 'seachField1', '', 'search', 'none')
    var logoString = templateToString(logoHtml),
    searchString = templateToString(searchHtml)

    var headerHtml = new HtmlTemplate('div', 'header', 'homeHeader', 'none', 'none', logoString + searchString)
    var headerString = templateToString(headerHtml)
    headerNode.innerHTML = headerString

    for(var i = 0; i < arrayOfModels.length; i++){
    
        //assemble html
        var currentModel = arrayOfModels[i],
        modelProperties = currentModel.attributes,
        descriptionHtml = new HtmlTemplate('p','listingDescription', 'listingDescription'+i, 'none', 'none', modelProperties.description),   
        titleHtml = new HtmlTemplate('h3','listingTitle', modelProperties.listing_id, 'none', 'none', modelProperties.title)      

        //convert assembled html to strings
        var titleString = templateToString(titleHtml),
        descriptionString = templateToString(descriptionHtml)
        
        //add all html strings into a container
        var allHtml = titleString + descriptionString,
        postHtml = new HtmlTemplate('div', 'listingPost', 'listingPost'+i, 'none', 'none', allHtml)
        postString = templateToString(postHtml)

        htmlString += postString
    }

    //applyHtml
    var pageHtml = new HtmlTemplate('div', 'homePageContent', 'contentContainer', 'none', 'none', htmlString),
    pageString = templateToString(pageHtml)

    contentNode.innerHTML = pageString

    user_search()
    user_select()

}

function build_item_html(itemModel){
    console.log(itemModel)
    console.log(itemModel.title, "titlelll")
}

//---------------------------------------------------------//

//----------------/MODELS AND COLLECTIONS/-----------------//

var HomepageCollection = Backbone.Collection.extend({

    url: 'https://openapi.etsy.com/v2/listings/active.js',
    parse: function(response) {
        
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

    url: 'https://openapi.etsy.com/v2/listings/',
    parse: function(response) {

        return response.results.attributes
    }
});

//------------------------------------------------------//

//--------------------/CONTROLLER/----------------------//

var AppRouter = Backbone.Router.extend({
    
    routes: {

        "home": "homePage",
        "search/:query": "searchResults",
        "item/:query": "detailsOfItem"
        // matches http://example.com/#anything-here
    },

    homePage: function(){

        homeCollectionInstance = new HomepageCollection
        homeCollectionInstance.fetch({ 

            dataType: 'jsonp',
        
            data: {
                'api_key': apiKey,
                'tags': 'guitar'    
            }
        })
       
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
                'tags': 'guitar' + selection
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
                'listing_id': selection, 
            }
        })

        new ItemView({

            model: itemModelInstance

        }) 

        }
});

//---------------------------------------------------------//

//----------------------/USER INPUT/-----------------------//

function user_search(){

    var searchNode = document.querySelector('.searchField')
    searchNode.addEventListener('keydown', function(eventObj){
        
        if(eventObj.keyCode === 13){
            var userSearch = ""
            userSearch = eventObj.target.value  
            location.hash = "search/" + userSearch
            eventObj.target.value = ""
        }

        })
}

function user_select(){

    window.addEventListener('click', function(clickObj){
        
        if(clickObj.target.attributes.class.value === "listingTitle"){
            var userSelect = clickObj.target.attributes.id.value
            location.hash = "item/" + userSelect
        
        }

        })
}

//-----------------------------------------------------------//

// Initiate the router
var app_router = new AppRouter;
  
// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();