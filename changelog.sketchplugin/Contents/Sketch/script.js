@import 'utils.js'
var commit;
var username;
var remember;

function onRun(context) {
	//You do whatever you want with with context, I expose these
	ctx = context;
  doc = context.document;
  selection = context.selection;
  page = [doc currentPage];
  view = [doc currentView];
  artboards = [[doc currentPage] artboards];

	var defaults = [NSUserDefaults standardUserDefaults], default_values = [NSMutableDictionary dictionary];

	// Let’s create a window for the ui
	var window = [[NSWindow alloc] init]
	var windowTitle = "Changelog"
	[window setTitle:windowTitle]
	[window setFrame:NSMakeRect(0, 0, 500, 320) display:false]

  //Let’s set up the path of the html page we want to load
  var filePath = "/Users/" + NSUserName() + "/Library/Application Support/com.bohemiancoding.sketch3/Plugins/changelog.sketchplugin/Contents/Resources/ui.html";
  var frame = NSMakeRect(0,60,500,240);
  var url = [NSURL fileURLWithPath:filePath];
  var webView = [[WebView alloc] initWithFrame:frame]
  [[webView mainFrame] loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:filePath]]]
  [[window contentView] addSubview:webView]
  [window center]

	// Let’s create a native OK button
	var okButton = [[NSButton alloc] initWithFrame:NSMakeRect(0, 0, 0, 0)]
	var userClickedOK = false
	[okButton setTitle:"  Save  "]
	[okButton setBezelStyle:NSRoundedBezelStyle]
	[okButton sizeToFit]
	[okButton setFrame:NSMakeRect([window frame].size.width - [okButton frame].size.width - 20, 14, [okButton frame].size.width, [okButton frame].size.height)]
	[okButton setKeyEquivalent:"\r"] // return key
	[okButton setCOSJSTargetFunction:function(sender) {
		userClickedOK = true
		[window orderOut:nil]
		[NSApp stopModal]
	}];

	[[window contentView] addSubview:okButton]

	// Let’s create a native cancel button
	var cancelButton = [[NSButton alloc] initWithFrame:NSMakeRect(0, 0, 0, 0)]
	var userClickedCancel = false
	[cancelButton setTitle:"  Cancel  "]
	[cancelButton setBezelStyle:NSRoundedBezelStyle]
	[cancelButton sizeToFit]
	[cancelButton setFrame:NSMakeRect([okButton frame].origin.x - [cancelButton frame].size.width, 14, [cancelButton frame].size.width, [cancelButton frame].size.height)]
	[cancelButton setKeyEquivalent:@"\033"] // escape key
	[cancelButton setCOSJSTargetFunction:function(sender) {
		userClickedCancel = true
		[window orderOut:nil]
		[NSApp stopModal]
	}]

	[[window contentView] addSubview:cancelButton]

	// get the user input
	[NSApp runModalForWindow:window]

  //On OK button clicked…
	if (!userClickedCancel) {
    //… we run functions on the webview
    commit = [webView stringByEvaluatingJavaScriptFromString:@"getCommit()"];
    username = [webView stringByEvaluatingJavaScriptFromString:@"getUsername()"];
		remember = [webView stringByEvaluatingJavaScriptFromString:@"rememberMe()"];
		if (remember == "true") {
			saveScript("document.getElementById('username').value = '"+username+"'")
		}
		changelog();
	}
	// let the GC gather these guys (and the targets!)
	okButton = nil;
	cancelButton = nil;
	window = nil;
}

function changelog() {
	artboard = getArtboardWithName("changelog")
	// if the changelog artboard doesn’t exist create it
	if (!artboard) {
	  artboard = MSArtboardGroup.new()
	  frame = artboard.frame()
	  if (artboards == nil || [artboards count] == 0) {
	    frame.x = 0
	    frame.y = 0
	  } else {
	    //if changeLog doesn’t exist already, we place it 50px before the first artboard
	    var numberOfArtboards = [artboards count];
	    minX = 0;
	    minY = 0;
	    for (i = 0; i < numberOfArtboards; i++) {
	        if (artboards[i].frame().minX() <= minX) {
	          minX = artboards[i].frame().minX();
	          minY = artboards[i].frame().minY();
	        }
	    }
	    firstArtboard = artboards[0];
	    firstArtboardFrame = firstArtboard.frame()
	    firstArtboardFrameX = firstArtboardFrame.minX()
	    firstArtboardFrameY = firstArtboardFrame.minY()
	    frame.x = minX - 600 - 100
	    frame.y = minY
	  }
	  frame.setWidth(600)
	  frame.setHeight(800)
	  artboard.setName("changelog for "+page.name())
	  artboard.setHasBackgroundColor(false);
		artboard.setConstrainProportions(false);
	  doc.currentPage().addLayers([artboard])
	  createChangelog();
		//if the changelog artboard exists we just update it
	} else {
	updateChangelog();
	}
}

function createChangelog() {
  artboard = getArtboardWithName("changelog");
  //Header bg
  var path = NSBezierPath.bezierPath();
  path.moveToPoint(NSMakePoint(0, 0));
  path.lineToPoint(NSMakePoint(0, 0));
  path.lineToPoint(NSMakePoint(600, 0));
  path.lineToPoint(NSMakePoint(600, 90));
  path.lineToPoint(NSMakePoint(0, 90));
  path.lineToPoint(NSMakePoint(0, 0));
  path.closePath();
  var shape = MSShapeGroup.shapeWithBezierPath(path);
  var fill = shape.style().addStylePartOfType(0);
  fill.color = MSImmutableColor.colorWithSVGString("#F5F5F6");
  shape.setName("bg");
	shape.setIsLocked(true);
  artboard.addLayers([shape]);

  var changelogTitle = MSTextLayer.alloc().initWithFrame_(NSMakeRect(0, 0, 100, 100))
  changelogTitle.textColor = MSImmutableColor.colorWithSVGString("#AEAEAF");
  changelogTitle.fontSize = 12;
  changelogTitle.setFontPostscriptName("HelveticaRegular");
  changelogTitle.setName("Changelog");
  changelogTitle.setNameIsFixed(true);
  changelogTitle.setStringValue("Changelog");
  changelogTitle.frame().setX(Number(20));
  changelogTitle.frame().setY(Number(20));
  changelogTitle.adjustFrameToFit();
	changelogTitle.setIsLocked(true);
  artboard.addLayers_([changelogTitle]);

  var projectTitle = MSTextLayer.alloc().initWithFrame_(NSMakeRect(0, 0, 100, 100));
  projectTitle.textColor = MSImmutableColor.colorWithSVGString("#858688");
  projectTitle.fontSize = 26;
  projectTitle.setFontPostscriptName("Helvetica-Light");
  projectTitle.setName("projectTitle");
  projectTitle.setNameIsFixed(true);
  projectTitle.setStringValue(page.name());
  projectTitle.frame().setX(Number(20));
  projectTitle.frame().setY(Number(38));
  projectTitle.adjustFrameToFit();
  projectTitle.setIsLocked(true);
  artboard.addLayers_([projectTitle]);

  var lastUpdate = MSTextLayer.alloc().initWithFrame_(NSMakeRect(0, 0, 100, 100));
  lastUpdate.textColor = MSImmutableColor.colorWithSVGString("#AEAEAF");
  lastUpdate.fontSize = 12;
  lastUpdate.setFontPostscriptName("HelveticaRegular");
  lastUpdate.setName("lastupdate");
  lastUpdate.setNameIsFixed(true);
  lastUpdate.setStringValue("Last update");
  lastUpdate.frame().setX(Number(517));
  lastUpdate.frame().setY(Number(20));
  lastUpdate.adjustFrameToFit();
	lastUpdate.setIsLocked(true);
  artboard.addLayers_([lastUpdate]);

  var timestamp = MSTextLayer.alloc().initWithFrame_(NSMakeRect(0, 0, 100, 100));
  timestamp.textColor = MSImmutableColor.colorWithSVGString("#858688");
  timestamp.fontSize = 26;
  timestamp.setFontPostscriptName("Helvetica-Light");
  timestamp.setName("Timestamp");
  timestamp.setNameIsFixed(true);
  timestamp.setStringValue(currentDate());
  timestamp.frame().setX(Number(449));
  timestamp.frame().setY(Number(38));
  timestamp.adjustFrameToFit();
	timestamp.setIsLocked(true);
  artboard.addLayers_([timestamp]);

  //one single element for all the commits, it’s easier to maintain and update
  var commitList = commit+"\n\n";
  var commits = MSTextLayer.alloc().initWithFrame_(NSMakeRect(0, 0, 100, 100));
  commits.textColor = MSImmutableColor.colorWithSVGString("#4F5051");
  commits.fontSize = 14;
  commits.lineHeight = 22;
  commits.setFontPostscriptName("Helvetica-Regular");
  commits.setName("Commits");
  commits.setNameIsFixed(true);
  commits.setStringValue(commit);
  commits.frame().setWidth(560);
  commits.frame().setHeight(600);
  commits.frame().setX(Number(20));
  commits.frame().setY(Number(105));
	commits.setIsLocked(true);
  //commits.adjustFrameToFit();
  artboard.addLayers_([commits]);

  //one single element for all the details, it’s easier to maintain and update
  var detailsList = username+" commited at "+currentTime()+" on "+currentDate()+"\n\n";
  var details = MSTextLayer.alloc().initWithFrame_(NSMakeRect(0, 0, 100, 100));
  details.textColor = MSImmutableColor.colorWithSVGString("#AEAEAF");
  details.fontSize = 12;
  details.lineHeight = 22;
  details.setFontPostscriptName("Helvetica-Regular");
  details.setName("Details");
  details.setNameIsFixed(true);
  details.setStringValue(detailsList);
  details.frame().setWidth(560);
  details.frame().setHeight(600);
  details.frame().setX(Number(20));
  details.frame().setY(Number(122));
	details.setIsLocked(true);
  //details.adjustFrameToFit();
  artboard.addLayers_([details]);
	return
};

function updateChangelog() {
	artboard.setName("changelog for "+page.name())
	var bg = getLayerWithName("bg", "changelog");
	var bgX = bg.frame().maxY();

	var timestamp = getLayerWithName("Timestamp", "changelog");
	timestamp.setStringValue(currentDate());

	var details = getLayerWithName("Details", "changelog");
	var detailsList = username+" commited at "+currentTime()+" on "+currentDate()+"\n\n"+details.stringValue().toString();
	details.frame().setY(Number(bgX+32));
	details.setStringValue(detailsList);

	var commits = getLayerWithName("Commits", "changelog");
	var commitList = commit+"\n\n"+commits.stringValue().toString();
	commits.frame().setY(Number(bgX+15));
	commits.setStringValue(commitList);

	var projectTitle = getLayerWithName("projectTitle", "changelog");
	projectTitle.setStringValue(page.name());
	projectTitle.adjustFrameToFit();
	return
};
