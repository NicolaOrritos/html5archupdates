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
    	
    	var result = date.getDay() + "/";
    	
    	result += date.getMonth() + 1 + "/";
    	result += date.getFullYear() + " - ";
    	
    	result += date.getHours() + ":";
    	result += date.getMinutes();
    	
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
        
        result += "<div id='" + pkgID + "' class='package' onClick=\"expandOrReduce('" + pkgID + "')\">";
        result += "    <div class='main-info'>";
        result += "        <div class='package-name'>" + pkgName + "</div>";
        result += "        <div class='package-version'>" + pkgVersion + "</div>";
        result += "    </div>";
        
        result += "    <div class='secondary-info-container'>";
        result += "        <div class='secondary-info hidden'>";
        result += "            <div class='description handle-left'>" + entry.contentSnippet + "</div>";
        result += "            <div class='package-arch handle-right'>[" + pkgArchitecture + "]</div>";
        result += "            <a class='link' href='" + entry.link + "'>&gt;</a>";
        result += "        </div>";
        result += "    </div>";
        
        result += "    <div class='pub-date'>" + pkgDate + "</div>";
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
                        
                        
                        var packageItem = createPackageItem(entry, packageNumber++);
                        
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
    window.expandOrReduce = function(pkgID)
    {
        if ($("#" + pkgID + " .secondary-info").hasClass("hidden"))
        {
            $("#" + pkgID + " .secondary-info").removeClass("hidden").addClass("animated fadeInRightBig");
        }
        else
        {
            $("#" + pkgID + " .secondary-info").addClass("animated fadeOutRightBig");
            
            setTimeout(function()
            {
                $("#" + pkgID + " .secondary-info").addClass("hidden").removeClass("animated fadeInRightBig").removeClass("animated fadeOutRightBig");
                
            }, 1000);
        }
    };
    
    $("nav>ol>li>a").click( function()
	{
    	$(this).toggleClass("selected");
    	
    	var choice = $(this)[0]["id"];
    	
    	console.log("Choice pressed: '" + choice + "'");
    	
    	feedURL = Feeds.BASE_URL;
    	
    	if (choice != "all")
		{
    		var archSpecified = false;
        	
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
        	
        	
        	if (choice != "all")
    		{
        		$("#all").removeClass("selected");
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
    	
    	
    	console.log("Reloading list from feed URL '" + feedURL + "'...");
    	
    	clear();
    	loadFeed(feedURL);
    });

});


/* optional triggers

$(window).load(function() {
	
});

$(window).resize(function() {
	
});

*/
