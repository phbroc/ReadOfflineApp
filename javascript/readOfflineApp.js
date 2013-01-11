/*
This code was inspired by the work of Adrian Kosmaczewski
O'Reilly publication : Mobile Javascript Application Development
2012, ISBN 978-1-449-32785-9

This adaptation is the work of Philippe Brouard, http://www.phbroc.fr
Version 1.0 04/12/2012
*/

var ReadOfflineApp = function () {
	// sheets are the array of sheet, a sheet is an article to read offline
    var sheets = [];
    var currentSheetIndex = -1;
    var SHEETS_KEY = 'readOfflineAppKey';

    var loadSheets = function() 
    {
        if (localStorage) {
            var storedSheets = localStorage[SHEETS_KEY];
            if (!storedSheets) {
                syncStorage();
            } 
            else {
                sheets = JSON.parse(storedSheets);
            }
        }
    };

    var syncStorage = function() 
    {
        localStorage[SHEETS_KEY] = JSON.stringify(sheets);
    };

    var displaySheetsList = function () 
    {
        var createTapHandler = function(sindex) 
        {
            return function (event, data) 
            {
                	ReadOfflineApp.setCurrentSheetIndex(sindex);
					ReadOfflineApp.displayOne();
            };
        };

        var createMarkAsReadTapHandler = function(sindex) 
        {
            return function(event, data)
            {
                ReadOfflineApp.toggleSheetAsRead(sindex);
            };
        };

        var list = $('#sheetList');
        list.empty();

        for (var index = 0, length = sheets.length; index < length; ++index)
        {
            var sheet = sheets[index];
            var line = 'line' + index;
            var accessLink = $('<a>');
            accessLink.on("click", createTapHandler(index));
           	accessLink.append(sheet.title);

            var readLink = $('<input>');
	    	readLink.attr('type', 'checkbox');
	    	readLink.attr('name', line);
	    	readLink.attr('value', index);
	    	if (sheet.read) readLink.attr('checked', 'checked');
            readLink.on("click", createMarkAsReadTapHandler(index));

            
	    	var sheetinfo = $('<span>');
	    	sheetinfo.attr('class','sheetinfo');
	    	sheetinfo.append(' ' + sheet.datestore + ', Read : ');

            var newLi = $('<li>');
	    	newLi.attr('class', 'sheetli');
            newLi.append(accessLink);
	    	newLi.append(sheetinfo);
            newLi.append(readLink);
            list.append(newLi);
        }
        
        if (!sheets.length)
        {
        	$('#infooff').append(' No pages saved for the moment.');
        } 
    };

    var findSheetIndex = function() 
    {
		var currentPageTitle = $("h1:first").html();
	
		currentSheetIndex = -1;
	
		for (var index = 0, length = sheets.length; index < length; ++index) {
			var sheet = sheets[index];
			if (sheet.title == currentPageTitle)
			{
				currentSheetIndex = index;
			}
		}
    };

    var displaySheet = function() {
		$('#articletext').empty();

		var createDeleteTapHandler = function() {
            return function(event, data) {
				console.log('delete execute');                
				ReadOfflineApp.removeSheet();
				displaySheetsList();
                // This is required to make the event handler work properly
                event.preventDefault();
            };
        };
        
        var sheet = sheets[currentSheetIndex];


		var deleteBtn = $('<button>');
		deleteBtn.attr('type','button');
		deleteBtn.attr('class','imgbtn');
		deleteBtn.append('DELETE');
        deleteBtn.on('click', createDeleteTapHandler());
        
		var sheeth5 = $('<h5>');
		sheeth5.append(deleteBtn);

		$('#articletext').append(sheeth5);

		$('#articletext').append(sheet.texthtml);

		if (sheet.imgDataUrl)
		{
			$('#articletext img').eq(1).attr('src', sheet.imgDataUrl);
		}

		$('#sheetList li').each(function(index) 
		{
			if (index == currentSheetIndex)
			{
				$(this).attr('class','sheetlicurrent');
			}
			else
			{		
				$(this).attr('class','sheetli');
			}
		});
    };

    var updateCurrentSheet = function(stext) {
        var sheet = sheets[currentSheetIndex];
        sheet.texthtml = stext;
        sheet.read = false;
        sheet.datestore = now();
    };

    var deleteCurrentSheet = function() {
        sheets.splice(currentSheetIndex, 1);
		$('#articletext').empty();
    };

    var toggleSheet = function(index) {
        var sheet = sheets[index];
        sheet.read = !sheet.read;
		//console.log('toggleSheet ' + index + ' ' + sheet.read);
   	};

    var now = function() {
		var _now = new Date();
		var _ret = ('0' + _now.getDate()).substr(-2,2)+"/"+('0' +(_now.getMonth()+1)).substr(-2,2)+"/"+_now.getFullYear();
		return _ret;
    };
    
    var getParamURL = function(name) {
    	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    	var regexS = "[\\?&]" + name + "=([^&#]*)";
    	var regex = new RegExp(regexS);
    	var results = regex.exec(window.location.href);
    	if (results == null)
        	return "";
   	 	else
        	return results[1];
	}

    var getBase64ImageJpg = function(img) {
    	// Create an empty canvas element
    	var canvas = document.createElement("canvas");
    	canvas.width = img.width;
    	canvas.height = img.height;

    	// Copy the image contents to the canvas
    	var ctx = canvas.getContext("2d");
    	ctx.drawImage(img, 0, 0);

    	// var dataURL = canvas.toDataURL("image/png");
    	var dataUrl = canvas.toDataURL('image/jpeg', 0.6);

    	return dataUrl;
    };

    return {
        Sheet: function (stitle,stext,simg) {
            this.title = stitle;
            this.texthtml = stext;
            this.datestore = now();
            this.read = false;
	    	if (simg) 
			{
	    		this.imgDataUrl = getBase64ImageJpg(simg);
			}
	    	else
			{
				this.imgDataUrl = "";
			}
        },
        
        addSheet: function (sheet) {
            currentSheetIndex = sheets.length;
            sheets.push(sheet);
            syncStorage();
        },

        init: function() {
	    	console.log('init');
            loadSheets();
	    	findSheetIndex();
	    	if (currentSheetIndex != -1)
	    	{
				$('#readOffBtn').html('SAVED');
	    	}
	    	if($('title:first').html() == 'read offline app')
	    	{
				console.log('pageoffline');
				if (navigator.onLine)
				{
					$('#infooff > span').html('inline');
				}
				else
				{
					$('#infooff > span').html('offline');
				}
				document.body.addEventListener("online", function() {
					$('#infooff > span').html('inline');
				});
				document.body.addEventListener("offline", function() {
					$('#infooff > span').html('offline');
				});		
				displaySheetsList();
				if (getParamURL('first')=='true')
				{
					$('#infooff').prepend('<p>This is your first SAVE OFFLINE action. Your page is saved here. You can <a href="javascript:history.go(-1)">go back</a>.</p>');
				}
	    	}
        },

        displayOne: function() {
            displaySheet();
        },

		addOrUpdateSheet: function (sheet) {
	    	findSheetIndex();
	    	if (currentSheetIndex == -1)
	    	{
				currentSheetIndex = sheets.length;
            	sheets.push(sheet);
            	if (currentSheetIndex > 0)
            	{
					$('#readOffBtn').html('SAVED');
				}
				else
				{
					$('#readOffBtn').html('SAVED');
					// first time a page is saved, so I need to show offline page
					document.location.href='offline.html?first=true';
				}
	    	}
	    	else
	    	{
				updateCurrentSheet(sheet.texthtml);
	    	}
	    	syncStorage();
		},

        setCurrentSheetIndex: function(index) {
            currentSheetIndex = index;
        },

        toggleSheetAsRead: function(index) {
            toggleSheet(index);
            syncStorage();
        },

        removeSheet: function() {
            deleteCurrentSheet();
            syncStorage();
        }
    };
}();

var pageready = function() {
  ReadOfflineApp.init();

  // 
  $('#readOffBtn').on("click", function(event){
	var currentPageTitle = $("h1:first").html();
	var currentTexthtml = $('#articletext').html();
	var firstImg = $('#articletext img:first');
	console.log("readOffBtn click ");
	var newSheet = new ReadOfflineApp.Sheet(currentPageTitle,currentTexthtml,firstImg[0]);
        console.dir(newSheet);
        ReadOfflineApp.addOrUpdateSheet(newSheet);
  	});

};

var indexready = function() {
   ReadOfflineApp.init();
};
