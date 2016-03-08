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
    var medoidLength = [];
    var medoidIndex = [];
    var medoidInfo = [];
	
  	var clusters = [];
  	var clusterCost = Array(nClusters, 0);
  	var distanceMatrix = barchart1.getDistanceMatrix();
  	// 1. Slumpa fram 2 medoids.
	// 2. Räkna ut cost C för bägge två.
	// 3. I varje medoid/cluster m_i, kolla om en annan medoidpunkt m_k har lägre cost C_k (med de punkter som finns i samma cluster som m_i)
			// 3. a. Om C_k är lägre än C, byt medoid m_i till m_k
			// 3. b. Om inte, gå vidare till nästa medoid och kolla om det går att hitta lägsta C där.
	// 4. När vi har nya optimerade medoids m_k och m_h: Ta fram nya cluster för dessa två. 
	 		// a. Om det var typ samma cluster som innan, eller om det var samma medoids som innan ELLER TYP SAMMA COST: Avbryt.
			// b. Om det var nya medoids och nya cluster med mycket lägre cost: Gå till steg 3.
	
    // CLARA SEN ta bara en sample => typ 50 st eller nåt
    var count = 0;
    while(count < nClusters)
    {
      var idx = Math.floor(Math.random()*nMuns);
      // Note: Plocka inte två likadana medoids/cluster! 
      // Svar: De kommer ändå att ändras sen till att hitta optimala punkter
      if(checkCorruptData(muns[idx]) == true){ continue; }
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

		// TODO: Check if selected mun is already a medoid, should the medoid itself be able to be assigned to another cluster?
        if (index != i) {

          var distance = Number(distanceMatrix[index][0][i]);
          // console.log(distance);
          if(distance < minDistance)
          {
            minDistance = distance;
            idx = n;
          }
        }
      } // end of nClusters
      clusterCost[idx] = Number(clusterCost[idx]) + minDistance;  
      clusters[idx].push({mun: mun, index: i});

    } // end of nMuns
    	
	var costDiff = [];
	var medoidChanged = true;
	while(medoidChanged == true)
	{
		for(var n = 0; n < nClusters; n++)
		{
				var bestMedoid = calcMinCost(clusters, n, medoidInfo);
				if(bestMedoid.cost < clusterCost[n] && bestMedoid.index != medoidInfo[n].index)
				{
						costDiff[n] = Math.abs(bestMedoid.cost - clusterCost[n]);
						if(costDiff[n] > 2)
						{
							clusterCost[n] = bestMedoid.cost;
							medoidInfo[n].index = bestIndex;
							medoidInfo[n].mun = clusters[n][bestIndex].mun;
							medoidChanged = true;
						}
						else
						{
							medoidChanged[n] = false;
						}
				}
				else
				{
					medoidChanged[n] = false;
					continue;
				}
		}
		
		if(medoidChanged == true)
		{
			// reassign clusters to contain new points to each medoid
			reassignCluster(clusters, medoidInfo etc.........);
		}
	}
	

	// 
    console.log(clusters);
    console.log(clusterCost);

  }; // END OF: cluster()

  
  function medoidDifference(clusters, )
  
  function calcMinCost(medoids, clusterIndex, oldMedoids){
  
  // SPARA ALLA bestIndex, inte bara för EN (array) o.s.v.
  
	var cost = 0;
	var minCost = 1000;
	var bestIndex = 0;
	for(var newMedoid in medoids[clusterIndex])
	{
	
		cost = 0;
		
		if(checkCorruptData(newMedoid.mun) == true)
		{
			continue;
		}
			
		if(newMedoid.index != oldMedoids[clusterIndex].index)
		{
			for(var point in medoids[clusterIndex])
			{
				if(checkCorruptData(point.mun) == true)
				{
					continue;
				}
				if(newMedoid.index != point.index)
				{
				    var distance = Number(distanceMatrix[newMedoid.index][0][point.index]);
					cost = Number(cost) + distance;
				}
			}
		}
		else
		{
			continue;
		}
		
		if(cost < minCost)
		{
			minCost = cost;
			bestIndex = newMedoid.index;
		}
	}
	
	console.log("cost = " + cost + " old cost = " + clusterCost[clusterIndex]);
	console.log("bestIndex = " + bestIndex + " and oldMedoid = " + oldMedoids[clusterIndex].index + " was the best medoid ");
	var bestMedoid = {cost: minCost, index: bestIndex}; 
	return bestMedoid;
  }
  
  
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
