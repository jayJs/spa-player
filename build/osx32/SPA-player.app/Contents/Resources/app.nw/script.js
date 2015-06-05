"use strict";

$(document).ready(function() {

  // yes, it's strange for me as well to see this inside the DOM ready...
  var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , app = express()
  , gui = require('nw.gui')
  , livereload = require('livereload');

  // hide loading + show app
  $("#loading").hide()
  $("#app").show("fadeIn")

  // MVC left really more for onwards possibilies...
  function clearApp(){
    $(front).hide()
    $(e404).hide()
    $('html,body').scrollTop(0)
  }

  // VIEWS // Front page view
  var frontView = function () {
    clearApp()
    $(front).show('fadeIn')
    frontFunction()
  }

  // MODEL // Set up routes, again this is really more for possible future needs...
  crossroads.addRoute('/', frontView);
  crossroads.bypassed.add(function(request){ // that's a 404 if the route structure is not matched
    clearApp()
    $(e404).show()
  })

  // start routing
  route(crossroads);

  // CONTROLLERS
  // Controller, "/"
  function frontFunction() {

    // if a file is added to the system.
    $(addFileInput).change(function(evt) {

      // get the Port and the URL
      var thePort = $(portNr).val();
      var theUrl = $(addFileInput).val();

      // get absolute routes, since Express does not want you to use paths like "../" for serving files.
      var absoluteFile = path.resolve(theUrl);
      var absoluteFolder = path.dirname(absoluteFile);

      // make Express also serve the folder where the file is, so the HTML could use linked JS and CSS files
      app.configure(function() {
        app.use(express.static(absoluteFolder));
      });

      // Send the requested file
      app.get('/', function(req, res){
        res.sendfile(absoluteFile);
      });

      // make livereload keep an eye, if files are changed inside the folder
      var reloader = livereload.createServer()
      reloader.watch(absoluteFolder);

      // create the server and listen to the port
      var server = http.createServer(app);
      server.listen(thePort, function(err){
        console.log('Express server listening on port ' + thePort);
      });

      // let us know about errors
      process.on('uncaughtException', function(err) {
         a(err);
         //process.exit(1); // this would just close the app, but we don't want that yet
      })

      // make input unable to use, since I was unable to figure out how to relieably stop the server and livereload.
      $(addFile).addClass("active");
      $(addFileInput).attr('disabled','disabled');
      $(portNr).attr('disabled','disabled');

      // let client know, what is the file name that's being served and how to access the served page.
      $(fileStatus).empty().append($(this).val());
      $(fileStatus).show();
      $(linkAddress).append('Open browser at <br /><a id="outsideLink1" href="http://localhost:'+thePort+'" target="_blank">http://localhost:'+thePort+'</a> or <br /><a target="_blank" id="outsideLink2" href="http://127.0.0.1:'+thePort+'">http://127.0.0.1:'+thePort+'</a>');
      $(linkAddress).show('zoomIn');
      $(reloadAddress).show('zoomIn');
      $(reloadInfo).show('zoomIn');

      // make sure the links open in a browser, not in the app
      $("#outsideLink1, #outsideLink2, #outsideLink3").on("click", function(event){
        event.preventDefault;
        gui.Shell.openExternal(event.target.href);
      })
    });
  }

  // make copy-paste and other shortcuts work. This is done via creating a menu
  var win = gui.Window.get();
  var nativeMenuBar = new gui.Menu({ type: "menubar" });
  nativeMenuBar.createMacBuiltin("SPA player");
  win.menu = nativeMenuBar;
});
