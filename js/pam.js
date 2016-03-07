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
    var corruptedDataLimit = 5;

  	var nClusters = 2;
  	var medoids = [];
    var medoidLength = [];
    var medoidIndex = [];
    var medoidInfo = [];

  	var clusters = [];
  	var clusterCost = Array(nClusters, 0);
  	var distanceMatrix = barchart1.getDistanceMatrix();
  	// 1. Räkna ut min för medoid n. Spara min. 

    // MULTIVARIAT??? (AA')X
    // CLARA SEN ta bara en sample => typ 50 st eller nåt
    var count = 0;
    while(count < nClusters)
    {
      var idx = Math.floor(Math.random()*nMuns);
      // Note: Plocka inte två likadana medoids/cluster! 
      // Svar: De kommer ändå att ändras sen till att hitta optimala punkter
      if(checkCorruptData(muns[idx]) == true){ continue; }
      medoids.push(muns[idx]);
      medoidIndex.push(idx);
      clusters[count] = [];
      clusterCost[count] = [0];
      medoidInfo.push({mun: muns[idx],  index: idx});
      count++;
    }

    console.log(medoidInfo);

    for (var i = 0; i < nMuns; i++) {

      var mun = muns[i];
      if (checkCorruptData(mun) == true) {
        clusters[0].push(mun); // just put it somewhere until we decide what to do with corrupted data
        continue;
      }

      var minDistance = 1000;
      var idx = 0;
      for (var n = 0; n < nClusters; n++) {

        var index = Number(medoidInfo[n].index);

        if (index != i) {

          var distance = Number(distanceMatrix[index][0][i]);
          // console.log(distance);
          if(distance < minDistance)
          {
            minDistance = Number(distanceMatrix[index][0][i]);
            idx = n;
          }
        }
      } // end of nClusters
      clusterCost[idx] = Number(clusterCost[idx]) + minDistance;  
      clusters[idx].push(mun);

    } // end of nMuns
    
    console.log(clusters);
    console.log(clusterCost);
/* 
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
*/
  	// console.log(clusters);
  	// console.log(clusterCost);

  }; // END OF: cluster()

  function checkCorruptData(mun) {
  	var isCorrupted = false;
  	for (var i = 0; i < 9; i++) {
  		if (typeof mun.info[i] == "undefined" || typeof mun.info[i] == "null") {
  			isCorrupted = true;
  			break;
  		}
  	}
  	return isCorrupted;
	}


} // END OF: pam()
