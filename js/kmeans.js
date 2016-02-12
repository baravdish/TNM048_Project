    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
      // data = points
   // k = number of clusters, also number of centroids
    function kmeans(data, k, mode) {
   //console.log("BLARGH!");
		var oldCentroids = [[]];
		var newCentroids = [[]];
		var test_index = [];	
		var clusters = [[]];
		var nCentroids = k;
		var threshold = 0.1;
		var counter = 0;
	
		if(mode == "normal"){

			var nAxis = 2;
			
			// hämta  k antal random linjer att använda som centroid punkter
			for(var i = 0; i < nCentroids; i++)
			{
				clusters[i] = [];
				oldCentroids[i] = [];
				newCentroids[i] = [];
				var line = [Number(data[Math.floor(Math.random()*data.length)].lat), Number(data[Math.floor(Math.random()*data.length)].lon)];
				newCentroids[i] = line;
			}

			var counter = 0;
			
			// Börja om här igen
			do{
				// Resetta clustret eftersm vi andvänder funktionen clusters.push(lineArray) längre ned.
				test_index = [];
				for(var i = 0; i < nCentroids; i++)
				{
					clusters[i] = [];
				}
				
				// Loopa igenom för varje linje i data.
				for(var i = 0; i < data.length; i++)
				{
					var lineArray = [Number(data[i].lat), Number(data[i].lon)];
					var lengthLine = 0;
					var min = 100000;
					var index = 0;
					
					// Beräkna minsta avståndet som bestämmer vilket kluster en linje ska hamna i.
					for(var j  = 0; j < nCentroids; j++)
					{
						for(var k = 0; k < nAxis; k++)
						{
							lengthLine += Math.pow(Number(lineArray[k]) - Number(newCentroids[j][k]), 2); 
						}
						
						lengthLine = Math.sqrt(lengthLine);
						
						if(lengthLine < min){
							min = lengthLine;
							index = j;
						}
						
						lengthLine = 0;
					}
										
					clusters[index].push(lineArray);
					test_index[i] = index;
				}

				// Fyll gamla centroid arrayen för senare jämförelse
				for(var x = 0; x < nCentroids; x++ ){
					for(var y = 0; y < nAxis; y++){		
						oldCentroids[x][y] = newCentroids[x][y];
					}
				}
				
				// Beräkna nya centroid punkter för newCentroid arrayen
				for(var j = 0; j < nCentroids; j++)
				{
					var currCluster = clusters[j];
					var clusterSize = currCluster.length;
					var sum = new Array(nAxis).fill(0);

					if(isNaN(clusterSize) == 1)
					{
						clusterSize = 0;
					}
					
					for(var k = 0; k < nAxis; k++){
						for(var i = 0; i < clusterSize; i++){
								sum[k] = Number(sum[k]) + Number(currCluster[i][k]);
								//console.log(sum.length);
						}
					}
					
					for(var x = 0; x < sum.length; x++){
						newCentroids[j][x] = sum[x]/clusterSize;
						//console.log(sum[x]/clusterSize);
					}
				}
				
				// Beräkna kvaliten på klustret.
				var quality = 0;
				for(var i = 0; i < nCentroids; i++){
					for(var j = 0; j < newCentroids[i].length; j++){
						//console.log(oldCentroids[i][j] - newCentroids[i][j] + " = " + oldCentroids[i][j] + " - " + newCentroids[i][j]);
						quality += Math.pow(Number(oldCentroids[i][j]) - Number(newCentroids[i][j]), 2);
					}
				}
			
			//console.log("quality = " + quality);
			counter++;
			}while( (quality > threshold) && (counter < 20) )

			return test_index;
		}else if(mode <= 7){
			
			for(var i = 0; i < nCentroids; i++)
			{
				clusters[i] = [];
				oldCentroids[i] = [];
				newCentroids[i] = [];
				var random_mag_point = Number(data[Math.floor(Math.random()*data.length)].properties.mag);
				newCentroids[i] = random_mag_point;

			}
			
			do{
				
				// Nollställ clusters
				test_index = [];
				for(var i = 0; i < nCentroids; i++)
				{
					clusters[i] = [];
				}

				//loopa igenom alla magnitude värden och lägga till punkten till det klustret med närmaste värde
				for(var i = 0; i < data.length; i++){
					
					var mag_point = Number(data[i].properties.mag);

					var min =  100000;
					var index;
						
					for(var j = 0; j < newCentroids.length; j++){
						


						if( Math.sqrt(Math.pow((mag_point - newCentroids[j]),2)) < min){
							index = j;
							min = Math.sqrt(Math.pow((mag_point - newCentroids[j]),2));
						}
					}
					clusters[index].push(mag_point);
					test_index[i] = index;
				}
				//console.log(clusters);
				
				// Kopiera över och spara
				for(var i = 0; i < nCentroids; i++ ){
					oldCentroids[i] = newCentroids[i];
				}
				
				for(var j = 0; j < nCentroids; j++)
				{
					var currCluster = clusters[j];
					var sum = 0;
					
					for(var i = 0; i < currCluster.length; i++)
					{
						sum = sum + currCluster[i];
					}
					
					// Om inga punkter finns i currCluster så kommer currCluster.length = 0 => OBS! divison med 0!
					newCentroids[j] = sum/(currCluster.length + 0.00000001);					
				}
				
				//var quality = [];
				var summa = 0;
				// Quality
				for(var i = 0; i < nCentroids.length; i++)
				{
					summa = Number(summa) + Math.abs(oldCentroids[i] - newCentroids[i]);
				}
				//console.log("mag quality = " + summa);
				counter++;
			}while(summa > threshold && counter < 20) //new quality calculations
			//console.log(clusters);
			//console.log(test_index);
			return test_index;
			
		}else if(mode == "time"){
			for(var i = 0; i < nCentroids; i++)
			{
				clusters[i] = [];
				oldCentroids[i] = [];
				newCentroids[i] = [];
				var random_depth_point = Number(data[Math.floor(Math.random()*data.length)].properties.depth);
				newCentroids[i] = random_depth_point;
				//console.log("första = " + newCentroids[i]);
			}
				
			do{

				// Nollställ clusters
				test_index = [];
				for(var i = 0; i < nCentroids; i++)
				{
					clusters[i] = [];
				}
				
				//loopa igenom alla magnitude värden och lägga till punkten till det klustret med närmaste värde
				for(var i = 0; i < data.length; i++){
					
					var depth_point = Number(data[i].properties.depth);
					//console.log("andra = " + depth_point);
					var min =  100000;
					var index;
					for(var j = 0; j < newCentroids.length; j++){

						if( Math.sqrt(Math.pow((depth_point - newCentroids[j]),2)) < min){
							index = j;
							min = Math.sqrt(Math.pow((depth_point - newCentroids[j]),2));
						}

					}

					clusters[index].push(depth_point);
					test_index[i] = index;
				}
				//console.log(clusters);
				
				// Kopiera över och spara
				for(var i = 0; i < nCentroids; i++ ){
					oldCentroids[i] = newCentroids[i];
					//console.log("tredje = " + newCentroids[i]);
					//console.log("fjärde = " + oldCentroids[i]);
				}
				
				for(var j = 0; j < nCentroids; j++)
				{
					var currCluster = clusters[j];
					var sum = 0;
					//console.log("sjätte = " + currCluster);
					for(var i = 0; i < currCluster.length; i++)
					{
						sum = sum + currCluster[i];
					}
					//console.log("femte = " + currCluster);
					// Om inga punkter finns i currCluster så kommer currCluster.length = 0 => OBS! divison med 0!
					newCentroids[j] = sum/(currCluster.length + 0.00000001);
					
				}
				
				//var quality = [];
				var summa = 0;
				// Quality
				for(var i = 0; i < nCentroids.length; i++)
				{
					summa = Number(summa) + Math.abs(oldCentroids[i] - newCentroids[i]);
				}
				//console.log("depth quality = " + summa);
				counter++;
			}while(summa > threshold && counter < 20) //new quality calculations
			return test_index;
		}
		
    
   
};
    