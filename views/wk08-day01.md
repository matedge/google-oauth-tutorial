## Week 08, Day 01

What we covered today:

- JavaScript - BackboneJS II ( continued )

___


### JavaScript - BackboneJS II

#### Structure

One of the main reasons to use Backbone is because it allows a cleaner Seperation of Concerns.  But so far, we have kept everything in one file.  That is really not ideal!

The basic folder structure for any Backbone project...

```
| javascript/
    - backbone.js
    - underscore.js
    - jQuery.js
    | models
        - animal.js
        - person.js
    | collections
        - animals.js
        - people.js
    | views
        - appView.js
        - animalView.js
        - peopleView.js
    | routers
        - appRouter.js
```

So, we have folders for our Backbone models, collections, views and routers.  By creating this structure, we end up having small, concise files that do one thing (hopefully, well).

#### The global `app` object

Another thing that is very common when working with Backbone across multiple files is to use a global `app` object - something that encompasses all of our data.  There are lots of reasons for doing this, like:

- Stopping the pollution of the global namespace (ie, not having heaps of variables in the Window object);
- Grouping related code together;
- Avoiding conflicts between variable names.

We need three things to get a global `app` object working.

##### _Define the `app` object_

First off, you need to have this line at the top of each file:

```
var app = app || {};
```

That uses the **or** (`||`) operator to provide a default `app` if none exists - if app is already defined, use that; otherwise assign an empty object to the 'app' variable.

##### _Scope your variables_

Secondly, you need to scope all of your variables. It may end up looking something like this:

```js
var app = app || {};

app.Posts = Backbone.Collection.extend({
  // etc
});

```

##### _Require your JavaScript files_

And finally, you need to load your JavaScript files in the right order.  The order will usually be something like:

- JS libraries (jQuery, _then_ Underscore, _then_ Backbone)
- All of your models JS
- All of your collections JS
- All of your views JS
- Your router JS
- The main app JS

#### Backbone and Rails - The Really Important Things

Backbone works really well with Rails, but the combination relies heavily on the implementation of a RESTful API connecting the front- and back-end, which Rails all but enforces.

These are the basic steps we need to take to set up a Rails app using Backbone as a front-end framework.

##### _Set up a new Rails application_

Let's set up the framework for a basic blog. We'll be using scaffolding to get this up-and-running, but you really should avoid using scaffolding in practice.

```sh
rails new backboneblog-rails
cd backboneblog-rails
rails generate scaffold Posts content:text title:text
rake db:migrate
bundle
```

Now, we have a fully functioning posts table to work with. Start up the server, navigate to localhost:3000/posts/new and create a few posts we can use.

##### _Set up our JavaScript directory_

Firstly, lets add BackboneJS (and its dependency UnderscoreJS) to our application's JavaScripts folder.

NOTE: Check CDNJS for the latest stable versions of Underscore and Backbone!

```sh
curl https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js > app/assets/javascripts/underscore.js
curl https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js > app/assets/javascripts/backbone.js
```

Now let's set up of the JavaScript directory structure:

```sh
touch app/assets/javascripts/main.js
touch app/assets/views/posts/app.html.erb
mkdir app/assets/javascripts/models
mkdir app/assets/javascripts/collections
mkdir app/assets/javascripts/views
mkdir app/assets/javascripts/routers
touch app/assets/javascripts/views/AppView.js
touch app/assets/javascripts/views/PostListView.js
touch app/assets/javascripts/views/PostView.js
touch app/assets/javascripts/models/Post.js
touch app/assets/javascripts/collections/Posts.js
touch app/assets/javascripts/routers/appRouter.js
```

Now we need to customize our application.js so that Rails loads all our JavaScript in the right order - this is crucial! Also note that we're removing the //= require turbolinks line.

```js
// ** app/assets/javascripts/application.js **

//= require jquery
//= require jquery_ujs
//= require underscore
//= require backbone
//= require_tree ./models
//= require_tree ./collections
//= require_tree ./views
//= require_tree ./routers
//= require_tree .
```

##### _Link the front-end up with the back-end_

Backbone gives us a bunch of methods for interacting with the records in our database, but they won't work until we provide the necessary RESTful routes to link our Backbone models and collections with our Rails routes. Let's go ahead and do that.

```js
// ** app/assets/javascripts/models/Post.js **
var app = app || {};

app.Post = Backbone.Model.extend({
    urlRoot: "/posts",
    defaults: {
        author: "Anonymous",
        content: "",
        title: "Untitled"
    },
    initialize: function() {
      console.log("Post created!")
    }
});

// ** app/assets/javascripts/collections/Posts.js **
var app = app || {};

app.Posts = Backbone.Collection.extend({
    url: "/posts",
    model: app.Post,
    initialize: function() {
      console.log("Collection of posts created!")
    }
});
```

The two important things here - the things that link our front-end framework up with our database - are the `url` and `urlRoot`

- **Models**: You must provide a ` urlRoot ` for your model. That specifies the base RESTful route to use when CRUD'ing individua posts.
- **Collections**: You must provide a ` url ` for your collection. That specifies the base RESTful route to use to access a collection of posts.

Now that we've linked this all up, we can start to use all of the useful functionality that Backbone offers, like:

- **Backbone Model methods -** eg:
  + `save`
  + `fetch`
  + `destroy`

- **Backbone Collection methods -** eg:
  + `create`
  + `fetch`
  + `sync`

##### _Create our Backbone views_

```js
// ** app/assets/javascripts/views/AppView.js
var app = app || {};

app.appView = Backbone.View.extend({
  // Specify the top-level DOM element for this view. This gives us access to both this.el (the DOM node itself) and this.$el (the jQuery object) for the view. This element must already exist in the DOM.
  el: "#app",
  // Create a render function.
  render: function() {
    // Get the element with the id #appViewTemplate from the DOM (note - this is squirreled away inside script tags so that it is not rendered by the browser, but CAN still be selected using $("#appViewTemplate")).
    var appViewMarkup = $("#appViewTemplate").html();
    // Use that template to populate this element's HMTL content.
    this.$el.html(appViewMarkup);

    // Iterate over each element in the collection, calling each element 'post', and...
    this.collection.each(function(post) {
      // ...using this post as the model...
      model: post;
      // ...create a new instance of PostListView for that post, and...
      var postListView = new app.PostListView();
      // ... render it.
      postListView.render();
    })
  }
  // We could put any initializer, events, custom functions, etc down here, but we'll leave it for now.
});

// ** app/assets/javascripts/views/PostListView.js
var app = app || {}

app.PostListView = Backbone.View.extend({
  // If we want to CREATE a DOM element, rather than reference an existing DOM element, we use 'tagName' (rather than 'el') to set the value of this.el and this.$el
  tagName: "li",

  // Add an events hash to our view:
  events: {
    "click": 'showPost' // when someone clicks on an element rendered by this view, call the showPost function.
  },

  showPost: function() {
    app.router.navigate( "/posts/" + this.model.get("id"), true );
  },

  render: function() {
    var title = this.model.get("title");
    this.$el.text(title);
    // Append this view to the element with the ID of 'posts'
    this.$el.appendTo("#posts");
  }
});


// ** app/assets/javascripts/models/PostView.js

var app = app || {};

app.PostView = Backbone.View.extend({
  el: "#app",

  render: function () {
    var templateMarkup = $("#postViewTemplate").html();
    var dynamicMarkupTemplate = _.template( templateMarkup );
    var compiledTemplate = dynamicMarkupTemplate( this.model.toJSON() );

    this.$el.html( compiledTemplate );
  }
});

// ** app/assets/javascripts/main.js
$(document).ready(function() {

  // Get a collection of all the posts in my database.
  app.posts = new app.Posts();

  // Make a GET request to the '/posts' URL specified in the Backbone collection, and when that's 'done'...
  app.posts.fetch().done(function() {

    // ... create a new instance of our router, and...
    app.router = new app.Router();

    // ... tell Backbone to start paying attention to the client-side URLs and watching for #fragments, using the new instance of the app.Router.
    Backbone.history.start();

  });
});
```

##### _Create our router_

```js
 var app = app || {};


 app.Router = Backbone.Router.extend({
  // Backbone will only attempt to route requests in URL fragments (delimited by a # symbol);

  routes: {
    "" : "index" // if someone sends a request to '#' (eg, www.myblog.com/app#), call the index method in this router.
    "posts" : "index", // if someone sends a request to "#posts", call the index method in this router.
    "posts/:id" : "showPost", // if someone sends a request to "#posts/:id" (eg www.myblog.com/app#posts/4), call the showPost method in this router
    '*splat': 'error' // If nothing matches, call the error function in this router.
  },


  error: function() {
    $("#app").html("That isn't a page");

    window.setTimeout(function () {
      app.router.navigate("/", true);
    }, 1000);
  },

  showPost: function(id) {
    var post = app.posts.get(id);

    var postView = new app.PostView({
      // Use this particular post as the model.
      model: post
    });
    postVIew.render();
  },

  index: function () {
    var appView = new app.AppView({
      collection: app.posts
    });
    appView.render();
  }
});
```

##### _Create our Backbone view templates_

Now we need to actually create the elements that our Backbone views will render (those elements our Backbone objects are bound to by the `el` in our JS). Because these need to be in the DOM, we're going to create these as HTML elements in our html.erb templates. But because we don't want the browser to render these when the page loads, we want to squirrel them away inside `<script>` tags. _But_, we also don't want the browser to try to interpret the content of those script tags as JavaScript, so we're going to give those script tags a type of "html/template".

One final thing - we'll be doing something similar to the Ruby interpolation we're familiar with in ERB files (`<%= %>`), but we're going to add another `%` to the opening tag to ensure Rails doesn't try to interpret the code as Ruby code.


```html
<div id="app">
  <h1>This is where our Backbone should be loaded</h1>
</div>

<script type="html/template" id="appViewTemplate">
  <h1>My blog with all my feelings</h1>
  <ul id="posts"></ul>
</script>

<script type="html/template" id="postViewTemplate">
  <h1><%%= title %></h1>
  <h2>By: <%%= author %></h2>
  <p>
    <%%= content %>
  </p>
</script>
```
