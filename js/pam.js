function pam()
{
	'use strict';
	var self = this;
	self.data = [];

	self.allData = barchart1.getAllData();

  this.cluster = function() {

  	var allData = self.allData;
  	var nYears = allData.length - 1;
  	var currYear = 3;
  	var muns = allData[currYear];
  	var nMuns = allData[0].length;
  	var nParties = muns[0].info.length;

  	var nClusters = 2;
  	var medoids = [];
  	var clusters = [];
  	var clusterCost = [];
  	var distanceMatrix = barchart1.getDistanceMatrix();

  	// 1. Räkna ut min för medoid n. Spara min. 
  	// 
  	for(var i = 0; i < nClusters; i++)
  	{
  		medoids.push(allData[Math.floor(Math.random()*nYears)][Math.floor(Math.random()*nMuns)]);
  		clusters[i] = [];
  		clusterCost[i] = [0];
  	}

  	// console.log("medoids:");
  	// console.log(medoids);
 
  	for (var i = 0; i < nMuns; i++){
  		
  		var mun = muns[i];

  		if(checkCorruptData(mun) == true)
  		{
  			continue;
  		}
  		
  		var min = 1000;
  		var index = 0;

  		for (var j = 0; j < nClusters; j++) {
	 			for (var n = 0; n < nParties; n++) {
  				var sum = 0;

					if (mun.region_name != medoids[j].region_name) {
						sum = Number(sum) + Number(Math.abs(Number(mun.info[n].votes) - Number(medoids[j].info[n].votes)));
					}
  			} // END OF: for each party in mun i

  			if (sum < min) {
  				min = Number(sum);
  				index = j;
  			}
  		} // END OF: for each menoid
  		clusterCost[index] = Number(clusterCost[index]) + Number(min); 
  		// console.log(i);
  		clusters[index].push(mun);

  	} // END OF: for each mun

  	console.log(clusters);
  	console.log(clusterCost);

  }; // END OF: cluster()

  function checkCorruptData(mun) {
  	var isCorrupted = false;
  	for (var i = 0; i < 9; i++) {
  		if (typeof mun.info[i] == "undefined") {
  			isCorrupted = true;
  			break;
  		}
  	}
  	return isCorrupted;
	}


} // END OF: pam()
