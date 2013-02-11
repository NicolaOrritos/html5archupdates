// remap jQuery to $
(function($){})(window.jQuery);


/* trigger when page is ready */
$(document).ready(function ()
{
    /* *********************
	 *   Feeds management
	 */
	var Feeds = 
	{
		BASE_URL: "https://www.archlinux.org/feeds/packages/",
		
		CORE_SUFFIX: "core/",
		EXTRA_SUFFIX: "extra/",
		COMMUNITY_SUFFIX: "community/",
		MULTILIB_SUFFIX: "multilib/",

		ALL_TAG: "all/",
		I686_TAG: "i686/",
		X86_64_TAG: "x86_64/",
		ANY_TAG: "any/",
		
		AUR_URL: "https://aur.archlinux.org/rss/",
		
		NEWS_URL: "https://www.archlinux.org/feeds/news/",
		
	};
    
	/* **********************
	 *   Package management
	 */
    function getPackageName(entry)
    {
        var tokens = entry.split(" ");
        
        var result = tokens[0];
        
        console.log("package string '" + entry + "' contains name '" + result + "'");
        
        return result;
    }
    
    function getPackageVersion(entry)
    {
        var tokens = entry.split(" ");
        
        var result = tokens[1];
        
        console.log("package string '" + entry + "' contains version '" + result + "'");
        
        return result;
    }
    
    function getPackageArchitecture(entry)
    {
        var tokens = entry.split(" ");
        
        var result = tokens[2];
        
        console.log("package string '" + entry + "' contains arch '" + result + "'");
        
        return result;
    }
    
    function getPackagePubDate(dateString)
    {
    	var date = new Date(dateString);
    	
    	var result = date.getDate() + "/";
    	
    	result += date.getMonth() + 1 + "/";
    	result += date.getFullYear() + " - ";
    	
    	result += date.toLocaleTimeString();
    	
    	return result;
    }
    
    function getNewsItemPubDate(dateString)
    {
    	var date = new Date(dateString);
    	
    	var result = date.getDate() + "/";
    	
    	result += date.getMonth() + 1 + "/";
    	result += date.getFullYear();
    	
    	return result;
    }
    
    function createPackageItem(entry, entryNumber)
    {
        var result = "";
        var pkgID = "pkg" + entryNumber;
        
        var pkgName = getPackageName(entry.title);
        var pkgVersion = getPackageVersion(entry.title);
        var pkgArchitecture = getPackageArchitecture(entry.title);
        var pkgDate = getPackagePubDate(entry.publishedDate);
        
        result += "<div id='" + pkgID + "' class='package'>";
        result += "    <div class='main-info line-bottom'>";
        result += "        <div class='package-name'>" + pkgName + "</div>";
        result += "        <div class='package-version'>" + pkgVersion + "</div>";
        result += "        <div class='package-arch hidden'>[" + pkgArchitecture + "]</div>";
        result += "    </div>";
        
        result += "    <div class='secondary-info hidden'>";
        result += "        <div class='description'>" + entry.contentSnippet + "</div>";
        result += "        <a class='link' href='" + entry.link + "'>Go to package page &gt;&gt;&gt;</a>";
        result += "        <div class='pub-date'>" + pkgDate + "</div>";
        result += "    </div>";
        result += "</div>";
        
        return result;
    }
    
    function createAURPackageItem(entry, entryNumber)
    {
        var result = "";
        var pkgID = "pkg" + entryNumber;
        
        var pkgName = entry.title;
        var pkgDate = getNewsItemPubDate(entry.publishedDate);
        
        result += "<div id='" + pkgID + "' class='package'>";
        result += "    <div class='main-info line-bottom'>";
        result += "        <div class='package-name'>" + pkgName + "</div>";
        result += "    </div>";
        
        result += "    <div class='secondary-info hidden'>";
        result += "        <div class='description'>" + entry.contentSnippet + "</div>";
        result += "        <a class='link' href='" + entry.link + "'>Go to package page &gt;&gt;&gt;</a>";
        result += "        <div class='pub-date'>" + pkgDate + "</div>";
        result += "    </div>";
        result += "</div>";
        
        return result;
    }
    
    function createNewsItem(entry, entryNumber)
    {
        var result = "";
        var pkgID = "pkg" + entryNumber;
        
        var pkgName = entry.title;
        var pkgDate = getNewsItemPubDate(entry.publishedDate);
        
        result += "<div id='" + pkgID + "' class='package'>";
        result += "    <div class='main-info line-bottom'>";
        result += "        <div class='package-name'>" + pkgName + "</div>";
        result += "    </div>";
        
        result += "    <div class='secondary-info hidden'>";
        result += "        <div class='description'>" + entry.contentSnippet + "</div>";
        result += "        <a class='link' href='" + entry.link + "'>Go to news page &gt;&gt;&gt;</a>";
        result += "        <div class='pub-date'>" + pkgDate + "</div>";
        result += "    </div>";
        result += "</div>";
        
        return result;
    }
	
    
    /* ****************************
	 *   Main workflow management
	 */
    var feedURL = Feeds.BASE_URL;
    var REFRESH_INTERVAL = 300 * 1000; 	// 5 minutes
    
	function clear()
	{
	    $("#packages-list").empty();
	}
	
	function refresh()
	{
		clear();
		
		loadFeed(feedURL);
	}
	
	var main = function ()
	{
	    refresh();
	    
	    window.setInterval(refresh, REFRESH_INTERVAL);
    };
    
    
    main();
    
    
    function isNewsFeed(feedURL)
    {
    	return (Feeds.NEWS_URL == feedURL);
    }
    
    function isAURFeed(feedURL)
    {
    	return (Feeds.AUR_URL == feedURL);
    }
    
    function loadFeed(feedURL)
    {
    	var packageNumber = 1;
	    
	    var googleAPIsURL = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=20&callback=?&q=' +
                            encodeURIComponent(feedURL);
                            
        $.ajax(
        {
            url      : googleAPIsURL,
            dataType : 'json',
            success  : function (data)
            {
                if (data.responseData.feed && data.responseData.feed.entries)
                {
                    console.log("Called URL   : " + googleAPIsURL);
                    console.log("Response data: " + JSON.stringify(data));
                    
                    $.each(data.responseData.feed.entries, function (i, entry)
                    {
                        console.log("------------------------");
                        console.log("title      : " + entry.title);
                        console.log("link       : " + entry.link);
                        console.log("description: " + entry.contentSnippet);
                        console.log("release    : " + entry.publishedDate);
                        
                        
                        var packageItem = "";
                        
                        
                        if (isNewsFeed(feedURL))
                    	{
                        	packageItem = createNewsItem(entry, packageNumber++);
                    	}
                        else if (isAURFeed(feedURL))
                    	{
                        	packageItem = createAURPackageItem(entry, packageNumber++);
                    	}
                        else
                    	{
                        	packageItem = createPackageItem(entry, packageNumber++);
                    	}
                        
                        console.log("Resulting package item: " + packageItem);
                        
                        
                        $("#packages-list").append('<li>' + packageItem + '</li>');
                    });
                }
            }
        });
    }
    
    
    /* ****************************
	 *  User interaction handling
	 */
    function expandOrReduce(pkgID)
    {
    	console.log("[expandOrReduce] BEGIN");
    	
    	if (pkgID)
		{
    		event.preventDefault();
            
            if ($("#" + pkgID + " .secondary-info").hasClass("hidden"))
            {	
            	$("#" + pkgID + " .secondary-info").removeClass("hidden").addClass("inline-block").addClass("animated fadeInLeftBig");
            	
            	$("#" + pkgID + " .main-info .package-arch").removeClass("hidden").addClass("inline-block").addClass("animated fadeInLeftBig");
            }
            else
            {
                $("#" + pkgID + " .secondary-info").addClass("animated fadeOutLeftBig");
                
                $("#" + pkgID + " .main-info .package-arch").addClass("animated fadeOutLeftBig");
                
                setTimeout(function()
                {
                    $("#" + pkgID + " .secondary-info").addClass("hidden").removeClass("inline-block").removeClass("animated fadeInLeftBig").removeClass("animated fadeOutLeftBig");
                    
                    $("#" + pkgID + " .main-info .package-arch").addClass("hidden").removeClass("inline-block").removeClass("animated fadeInLeftBig").removeClass("animated fadeOutLeftBig");
                    
                }, 600);
            }
		}
    	else
		{
    		console.log("[expandOrReduce] undefined pkgID");
		}
        
        console.log("[expandOrReduce] END");
    };
    
    function toggleMenu()
    {
    	if ($("nav #more-menu #menu").hasClass("hidden"))
        {	
        	$("nav #more-menu #menu").removeClass("hidden").addClass("animated fadeInDownBig");
        }
        else
        {
            $("nav #more-menu #menu").addClass("animated fadeOutUpBig");
            
            setTimeout(function()
            {
                $("nav #more-menu #menu").addClass("hidden").removeClass("animated fadeInDownBig").removeClass("animated fadeOutUpBig");
                
            }, 320);
        }
    }
    
    $("#packages-list").on("fastClick", ".package", function()
	{
    	console.log("[.package fastClick] this.id is " + this.id);
    	
    	var pkgID = this.id;
    	
    	console.log("[.package fastClick] pkgID is " + pkgID);
    	
    	expandOrReduce(pkgID);
    	
    	console.log("[.package fastClick] END");
	});
    
    $("#packages-list").on("fastClick", ".link", function()
	{
    	console.log("[.link fastClick] this.id is " + this.id);
    	
    	this.stopPropagation();
    	
    	console.log("[.link fastClick] END");
	});
    
    
    $("nav #menu li>a").fastClick( function()
	{
    	$(this).toggleClass("selected");
    	
    	var choice = $(this)[0]["id"];
    	
    	console.log("Choice pressed: '" + choice + "'");
    	
    	
    	
    	if (choice == "news")
    	{
    		feedURL = Feeds.NEWS_URL;
    	}
    	else if (choice == "aur")
		{
    		feedURL = Feeds.AUR_URL;
		}
    	else
		{
    		feedURL = Feeds.BASE_URL;
		}
    	
    	
    	if (choice != "all" && choice != "news" && choice != "aur")
		{
    		var archSpecified = false;
    		
    		
    		$("#all").removeClass("selected");
        	$("#news").removeClass("selected");
        	$("#aur").removeClass("selected");
    		
        	
        	if (choice == "i686")
    		{
        		$("#i686").addClass("selected");
        		$("#x86_64").removeClass("selected");
        		$("#any").removeClass("selected");
        		
        		feedURL += Feeds.I686_TAG;
        		archSpecified = true;
    		}
        	else
    		{
        		$("#i686").removeClass("selected");
    		}
        	
        	if (choice == "x86_64")
    		{
        		$("#i686").removeClass("selected");
        		$("#x86_64").addClass("selected");
        		$("#any").removeClass("selected");
        		
        		feedURL += Feeds.X86_64_TAG;
        		archSpecified = true;
    		}
        	else
    		{
        		$("#x86_64").removeClass("selected");
    		}
        	
        	if (choice == "any")
    		{
        		$("#i686").removeClass("selected");
        		$("#x86_64").removeClass("selected");
        		$("#any").addClass("selected");
        		
        		feedURL += Feeds.ANY_TAG;
        		archSpecified = true;
    		}
        	else
    		{
        		$("#any").removeClass("selected");
    		}
        	
        	if (!archSpecified)
    		{
        		feedURL += Feeds.ALL_TAG;
    		}
        	
        	
        	if (choice != "core")
    		{
        		$("#core").removeClass("selected");
    		}
        	else
    		{
        		feedURL += Feeds.CORE_SUFFIX;
    		}
        	
        	if (choice != "extra")
    		{
        		$("#extra").removeClass("selected");
    		}
        	else
    		{
        		feedURL += Feeds.EXTRA_SUFFIX;
    		}
        	
        	if (choice != "community")
    		{
        		$("#community").removeClass("selected");
    		}
        	else
    		{
        		feedURL += Feeds.COMMUNITY_SUFFIX;
    		}
        	
        	if (choice != "multilib")
    		{
        		$("#multilib").removeClass("selected");
    		}
        	else
    		{
        		feedURL += Feeds.MULTILIB_SUFFIX;
    		}
		}
    	else
		{
    		if (choice != "any")
    		{
            	$("#any").removeClass("selected");
    		}
        	
    		if (choice != "news")
    		{
            	$("#news").removeClass("selected");
    		}
        	
    		if (choice != "aur")
    		{
            	$("#aur").removeClass("selected");
    		}
		}
    	
    	
    	console.log("Reloading list from feed URL '" + feedURL + "'...");
    	
    	clear();
    	loadFeed(feedURL);
    	
    	
    	toggleMenu();
    });
    
    $("nav #more-menu").fastClick(function(event)
    {
    	toggleMenu();
    });

});


/* optional triggers

$(window).load(function() {
	
});

$(window).resize(function() {
	
});

*/
