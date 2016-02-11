    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
   // data = points
   // k = number of clusters, also number of centroids
    function kmeans(data, k) {
		
    	var oldCentroids = [[]];
		var newCentroids = [[]];
		
		// För test case i dataset 3
    	//newCentroids[0] = [0.8, 0.5, 0.1];
		//newCentroids[1]	= [0.15, 0.45, 0.85];

		var clusters = [[]];
		
		var nCentroids = k;
		var nAxis = Object.keys(data[0]).length;
		var threshold = 0.001;
		var test_index = [];		
		
		// hämta  k antal random linjer att använda som centroid punkter
		for(var i = 0; i < nCentroids; i++)
		{
			clusters[i] = [];
			oldCentroids[i] = [];
			newCentroids[i] = [];
			var line = data[Math.floor(Math.random()*data.length)];
			newCentroids[i] = [];
			for(var point in line){	
				newCentroids[i].push(Number(line[point]));
			}
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
				var lineArray = [];
				var lineObject =  data[i];
				// Fyll lineArray med punkterna ur data konverterade från objekt till array.
				for(var point in lineObject){
					lineArray.push(Number(lineObject[point]));
				}
				
				var lengthLine = 0;
				var min = 100000;
				var index = 0;
				
				// Beräkna minsta avståndet som bestämmer vilket kluster en linje ska hamna i.
				for(var j  = 0; j < nCentroids; j++)
				{
					for(var k = 0; k < nAxis; k++)
					{
						lengthLine += Math.pow(lineArray[k] - newCentroids[j][k], 2); 
					}
					
					lengthLine = Math.sqrt(lengthLine);
					
					if(lengthLine < min){
						min = lengthLine;
						index = j;
					}
					
					lengthLine = 0;
				}
				
				//console.log("lineArray = " + lineArray + " has shortest distance " + min + " to centroid " + index + " with " + newCentroids[index]);
		
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
				var avg = 0;
				var sum = new Array(nAxis).fill(0);

				if(isNaN(clusterSize) == 1)
				{
					clusterSize = 0;
				}
				
				for(var k = 0; k < nAxis; k++){
					for(var i = 0; i < clusterSize; i++){
							sum[k] = sum[k] + currCluster[i][k];
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
					quality += Math.pow(oldCentroids[i][j] - newCentroids[i][j], 2);
				}
			}
			
		
		console.log("quality = " + quality);
		counter++;
		}while(quality > threshold)

		return test_index;
		
		
        /* 
        	1. Placera ut k stycken centroid-punkter på random ställen.
        	2. for i in data
        			for j in clusters
        				Beräkna normen (avståndet) mellan punkt i och centroid-punkten j. 
        				(För multidimensionell data, som i vårt fall, så blir det norm(point_i - centroid_j),
        				annars hade man kunnat köra abs(point_i - centroid_j)).
        				
        				Ta fram kortast avstånd från i till centroid j. (uppdatera minDistance)
								end for
							
         				Punkten i tillhör det cluster/centroid som den hade kortast avstånd till,
         				punkten hamnar alltså i en ny grupp/cluster j (labeling, label a point). 
         		 end for
         	3. Beräkna ny centroid, my, för alla punkter i varje cluster/centroid. Detta nya my beräknas
         		 genom att beräkna medelvärdet för alla punkter tillhörande respektive centroid. centroid1 = mean(bin1)
         	4. a) Gå till 2. och gör om allt igen fast med de nya centroiderna.
						 b) Om de nya centroiderna inte flyttades (norm(new - old) = 0), sluta
       	*/
    }
    
    