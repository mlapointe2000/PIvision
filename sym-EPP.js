/***************************************************************************
   Copyright 2016-2017 OSIsoft, LLC.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
   Modified by par Mario Lapointe to display inspection route
    2018, April 12
 ***************************************************************************/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	//'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Vision to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'EPP',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'EPP',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		// iconUrl: '/Scripts/app/editor/symbols/ext/Icons/snapshotDataTable.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'Table',
				//DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 250,
				Width: 500,
				// Specify the value of custom configuration options; see the "configure" section below
				textColor: "black",
				labelColor: "white",
				labelBackgroundColor: "SkyBlue",
				backgroundColor: "white",
				borderColor: "white",
				fontSize: 14,
				jour: 1,
				vert: 0,
				jaune: 1,
				rouge: 2,
				desc_larg: 300,
				val_larg: 100
			};
		},
		// By including this, you're specifying that you want to allow configuration options for this symbol
		configOptions: function () {
            return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Format Symbol',
				// Supply a unique name for this cofiguration setting, so it can be reused, if needed
                mode: 'format'
            }];
        }
		// Specify the name of the function that will be called to initialize the symbol
		//init: myCustomSymbolInitFunction
	};
	
	//************************************
	// Function called to initialize the symbol
	//************************************
	//function myCustomSymbolInitFunction(scope, elem) {
	function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);
	symbolVis.prototype.init = function(scope, elem) {
		// Specify which function to call when a data update or configuration change occurs 
		this.onDataUpdate = myCustomDataUpdateFunction;
		this.onConfigChange = myCustomConfigurationChangeFunction;
		
		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerDiv = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerDiv.id = newUniqueIDString;
		// Create a variable to hold the custom visualization object
		var customVisualizationObject;
		// Create vars to hold the labels and units
		var dataItemNameArray = [];
		var dataItemLabelArray = [];
		var path = [];
		console.log("Version du 12 avril 2018");
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			//console.log("Data object: ",data);
			if(data) {
				 
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// --------------------------------------------------------------------------------------------------
				//console.log("Now creating custom visualization...");
				// Clear the table
				if(customVisualizationObject) {
					$('#' + symbolContainerDiv.id + ' tbody').remove();
				}
				customVisualizationObject = true;
				// Crée la row header du tableau
				var newRow = symbolContainerDiv.insertRow(0);
				//newRow.width="500"
				newRow.style.width = "100%";
				newRow.style.border = "1px solid " + scope.config.borderColor;
				newRow.style.fontSize = scope.config.fontSize + "px";
				// Cellule Data Item header
				var labelCell = newRow.insertCell(-1);
				labelCell.innerHTML = "Nom";
				labelCell.style.padding = "1px";
				labelCell.style.textAlign = "center";
				labelCell.style.backgroundColor = scope.config.labelBackgroundColor;
				labelCell.style.color = scope.config.labelColor;
				labelCell.style.border = "1px solid " + scope.config.borderColor;
				// Cellule Description header
				var labelCell = newRow.insertCell(-1);
				labelCell.innerHTML = "Description";
				labelCell.style.padding = "1px";
				labelCell.style.textAlign = "center";
				labelCell.style.backgroundColor = scope.config.labelBackgroundColor;
				labelCell.style.color = scope.config.labelColor;
				labelCell.style.border = "1px solid " + scope.config.borderColor;
				// Cellule Value header
				var labelCell = newRow.insertCell(-1);
				labelCell.innerHTML = "Etats";
				labelCell.style.padding = "1px";
				labelCell.style.textAlign = "center";
				labelCell.style.backgroundColor = scope.config.labelBackgroundColor;
				labelCell.style.color = scope.config.labelColor;
				labelCell.style.border = "1px solid " + scope.config.borderColor;
				// Cellule Timestamp header				
				var labelCell = newRow.insertCell(-1);
				labelCell.innerHTML = "Jours";
				labelCell.style.padding = "1px";
				labelCell.style.textAlign = "center";
				labelCell.style.backgroundColor = scope.config.labelBackgroundColor;
				labelCell.style.color = scope.config.labelColor;
				labelCell.style.border = "1px solid " + scope.config.borderColor;
				// -----------				
				// Scan tous les rows de data pour creer une row tableau par row data		
				for (var i = 0; i < data.Rows.length; i++) {
					// ajoute un row dans tableau par tag point
					var newRow = symbolContainerDiv.insertRow(i+1);
				    newRow.style.width = "100%";
				    newRow.style.border = "1px solid " + scope.config.borderColor;
				    newRow.style.fontSize = scope.config.fontSize + "px";
					
					// --------- debut cellule Nom du point (colonne 1	du tableau)					
					var newCell = newRow.insertCell(-1);
					// Check if the label exists; if it does, add it to the global array
					if (data.Rows[i].Label) {					
					  console.log("data.Rows[i]:",data.Rows[i]);
					  path[i] = data.Rows[i].Path;
					  //console.log("Path cours: ", path[i].slice(20));
					  newCell.title = path[i];  // pour le hint		  
					  dataItemNameArray[i] = data.Rows[i].Label;
					}				
					newCell.innerHTML = dataItemNameArray[i];
					//console.log("newCell.innerHTML",i,"  ", newCell.innerHTML);
					// Apply padding and the specified color for this column
					newCell.style.padding = "1px";
					newCell.style.textAlign = "left";
					newCell.style.backgroundColor = scope.config.backgroundColor;
					newCell.style.color = scope.config.textColor;
					newCell.style.border = "1px solid " + scope.config.borderColor;
					// --------- fin cellule Nom du point					
					
					// --------- debut cellule Description du point (colonne 2	du tableau)					
					var newCell = newRow.insertCell(-1);
					// Check if the label exists; if it does, add it to the global array
					if (data.Rows[i].Label) {
						dataItemLabelArray[i] = data.Rows[i].Description;
					}				
					newCell.innerHTML = dataItemLabelArray[i];
					//console.log("newCell.innerHTML",i,"  ", newCell.innerHTML);
					// Apply padding and the specified color for this column
					newCell.style.padding = "1px";
					newCell.style.textAlign = "left";
					newCell.style.backgroundColor = scope.config.backgroundColor;
					newCell.style.color = scope.config.textColor;
                    newCell.style.border = "1px solid " + scope.config.borderColor;					
					// --------- fin cellule Description du point
									
					// -----
					// ---- debut cellule pour Etats (colonne 3 du tableau)
					var newCell = newRow.insertCell(-1);
                    // console.log("Value: " +data.Rows[i].Value);
					
					newCell.innerHTML = data.Rows[i].Value;
					// Apply padding and the specified color for this column
					newCell.style.padding = "1px";
					newCell.style.textAlign = "center";
					newCell.style.backgroundColor = scope.config.backgroundColor;
					newCell.style.color = scope.config.textColor;
					newCell.style.border = "1px solid " + scope.config.borderColor;	
					if (data.Rows[i].Value == scope.config.vert) {
					newCell.innerHTML = "<IMG SRC='images/vert.png'>";
					// Apply padding and the specified color for this column
					newCell.style.padding = "1px";
					newCell.style.textAlign = "center";
					newCell.style.backgroundColor = scope.config.backgroundColor;
					newCell.style.color = "Green";
					newCell.style.border = "1px solid " + scope.config.borderColor;	
					}
					
					if (data.Rows[i].Value == scope.config.jaune) {
					newCell.innerHTML = "<IMG SRC='images/orange.png'>";
					// Apply padding and the specified color for this column
					newCell.style.padding = "1px";
					newCell.style.textAlign = "center";
					newCell.style.backgroundColor = scope.config.backgroundColor;
					newCell.style.color = "Yellow";
					newCell.style.border = "1px solid " + scope.config.borderColor;	
					}
					if (data.Rows[i].Value == scope.config.rouge) {
					newCell.innerHTML = "<IMG SRC='images/rouge.png'>";
					// Apply padding and the specified color for this column
					newCell.style.padding = "1px";
					newCell.style.textAlign = "center";
					newCell.style.backgroundColor = scope.config.backgroundColor;
					newCell.style.color = "Red";
					newCell.style.border = "1px solid " + scope.config.borderColor;	
					}
					
					// ---- fin cellule pour Etats
					
					// ---- debut cellule pour Timestamp (colonne 4 du tableau)
					var newCell = newRow.insertCell(-1);
					var date1 = new Date(data.Rows[i].Time);
					var date2 = new Date();
					var jour = 0;
					jour = (date2 - date1)/1000/3600/24; //Age en jour du data
					//console.log(jour.toFixed(1));
					// Apply padding and the specified color for this column
					newCell.style.padding = "1px";
					newCell.style.textAlign = "RIGHT";
					newCell.style.backgroundColor = scope.config.backgroundColor;
					newCell.innerHTML = jour.toFixed(1);
					newCell.style.color = "Green";
					newCell.style.border = "1px solid " + scope.config.borderColor;	
					if (jour > scope.config.jour) {
					newCell.style.color = "Red";
					}
				}	
						
			}
		}

		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// All configuration changes for this symbol are set up to take effect
			// automatically every data update, so there's no need for specific config change code here
		}
		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };		
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);