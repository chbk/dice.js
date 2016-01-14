// dice.js v1.0.0 | github.com/chbk/dice.js
;(function(){
	
	var dice = {
		
		// A multigram is a group of consecutive characters
		// Each group can be a pair of 2 characters, a triad of 3 characters, or any other number
		multigramLength: 2,
		
		// Minimum Dice coefficient required to determine a match
		matchMinimum: 0.5,
		
		// In a string 'alpha bravo', if the multigram length is set to 2
		// the split method will return [' b', 'a ', 'al', 'av', 'br', 'ha', 'lp', 'ph', 'ra', 'vo']
		split: function(str){
			
			var multigrams = [];
			
			for (var i = 0; i < str.length - this.multigramLength +1; i++){
				
				multigrams.push(str.substr(i, this.multigramLength));
			}
			
			return multigrams.sort();
		},
		
		// Returns an array indicating which strings are similar in 2 sets of strings
		//
		// Strings1 ['AB', 'CD', 'EF', 'GH', 'IJ']
		//            0     1     2      3     4
		//            |     |     |      |     |
		//          [ 0,    2,   null,  null,  3 ]   Overlap
		//            |      \                /
		//            |       `-.          .-'
		//            |          \        /
		//            0     1     2      3
		// Strings2 ['AA', 'XY', 'CD', 'IJ']
		//
		overlap: function(strings1, strings2){
			
			// Get multigrams for each string
			//
			// strings1 ['hello', 'world']
			// strings2 ['helicopters', 'are', 'wonderful']
			//
			// multigrams1 [ ['he', 'el', 'll', 'lo'], ['wo', 'or', 'rl', 'ld'] ]
			// multigrams2 [ ['he', 'el', 'li', 'ic', 'co', 'op', 'pt',  'te', 'er', rs'],
			//               ['ar', 're'], ['wo', 'on', 'nd', 'de', 'er', 'rf', 'fu', 'ul'] ]
			//
			var multigrams1 = [];
			var multigrams2 = [];
			
			for (var n = 0; n < strings1.length; n++){
				multigrams1.push(this.split(strings1[n]));
			}
			
			for (var n = 0; n < strings2.length; n++){
				multigrams2.push(this.split(strings2[n]));
			}
			
			// Get the dice coefficient of each possible pair of strings
			//
			// strings1 ['hello', 'world']
			// strings2 ['helicopters', 'are', 'wonderful']
			//
			// coefficients [ [ .3,  0,  0 ],
			//                [  0,  0, .2 ]  ]
			//
			var coefficients = [];
			
			for (var i = 0; i < multigrams1.length; i++){
				
				coefficients.push([]);
				
				for (var j = 0; j < multigrams2.length; j++){
					
					coefficients[i].push(this.coefficient(multigrams1[i], multigrams2[j]));
				}
			}
			
			// Find coefficients that are maximums in both their row and column
			// and from these maximums determine the overlap betwen strings1 and strings2
			//
			// coefficients [ [0.7, 0.4, 0.6, 0.1, 0.2],   A
			//                [0.9, 0.3, 0.8, 0.1, 0.2],   B
			//                [0.1, 0.4, 0.5, 0.6, 0.3],   C
			//                [0.2, 0.6, 0.1, 0.9, 0.4]  ] D
			//                  B    C    A    D    E
			//
			// overlap [ 2, 0, 1, 3 ]
			//
			//
			// This will take several runs to eliminate all posibilities
			//
			// On the first run:
			//
			// Each row's maximum coefficient's j index [0, 0, 3, 3]
			// rows [ 0,                A
			//        0,                B
			//                 3,       C
			//                 3    ]   D
			//        B  C  A  D  E
			//
			// Each column's maximum coefficient's i index [1, 3, 1, 3, 3]
			// columns [                  A
			//           1,    1,         B
			//                            C
			//              3,    3, 3 ]  D
			//           B  C  A  D  E
			//
			var overlap = [];
			for (var n = 0; n < strings1.length; n++) overlap.push(null);
			
			var removed = 0;
			var total = coefficients.length * coefficients[0].length;
			
			while (removed < total){
				
				var rows = [];
				
				for (var i = 0; i < coefficients.length; i++){
					
					var max = coefficients[i][0];
					var max_j = 0;
					
					for (var j = 1; j < coefficients[i].length; j++){
						
						if (coefficients[i][j] > max){
							
							max = coefficients[i][j];
							max_j = j;
						}
					}
					
					rows.push(max_j);
				}
				
					
				for (var j = 0; j < coefficients[0].length; j++){
					
					var max = coefficients[0][j];
					var max_i = 0;
					
					for (var i = 1; i < coefficients.length; i++){
						
						if (coefficients[i][j] > max){
							
							max = coefficients[i][j];
							max_i = i;
						}
					}
					
					// If we have a coefficient that is the maximum value in both its row and column
					if (rows[max_i] == j){
						
						// If this coefficient meets the minimum matching requirement
						// then save its index in the overlap array
						if (max >= this.matchMinimum) overlap[max_i] = j;
						
						// Remove all coefficients on this row and column
						// So we can do another run and find more maximums
						for (var i = 0; i < coefficients.length; i++){
							
							coefficients[i][j] = -1;
							removed++;
						}
						
						for (var k = 0; k < coefficients[0].length; k++){
							
							coefficients[max_i][k] = -1;
							removed++;
						}
					}
				}
			}
			
			return overlap;
		},
		
		// Dice coefficient between 2 strings or 2 arrays of multigrams
		coefficient: function(input1, input2){
			
			if (input1 == input2) return 1;
			
			var multigrams1 = [];
			var multigrams2 = [];
			
			if (typeof input1 === 'string') multigrams1 = this.split(input1);
			else multigrams1 = input1;
			
			if (typeof input2 === 'string') multigrams2 = this.split(input2);
			else multigrams2 = input2;
			
			var intersection = 0;
			
			var length1 = multigrams1.length;
			var length2 = multigrams2.length;
			
			if (length1 < 1 || length2 < 1) return 0;
			
			var i = 0;
			var j = 0;
			
			// The while loop assumes the multigrams are sorted
			while (i < length1 && j < length2){
				
				if (multigrams1[i] == multigrams2[j]){ intersection++; i++; j++; }
				else if (multigrams1[i] < multigrams2[j]) i++;
				else j++;
			}
			
			return (2 * intersection) / (length1 + length2);
		}
	};
	
	// Node.js exported module
	if (typeof module === 'object' && module.exports) module.exports = dice;
	
	// Globals
	else this.dice = dice;

})();
