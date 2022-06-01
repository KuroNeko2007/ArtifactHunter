function gcd(num1, num2) {
	if(num1 === 0)
		return num2;
	return gcd(num2 % num1, num1);
}

/**
 * @param {number} satisfyingCondition Number of similar artifacts in a row to count as a match
 * @param {number} rolls Number of rolls you have
 * @param {number} artifactTypeCount Number of artifact types
 */
function calculateProbability(satisfyingCondition, rolls, artifactTypeCount) {
	// Variables we care about
	let total, matched;
	total = matched = 0;
	
	// Do the calculation asynchronously to prevent lag
	return new Promise((resolve, reject) => {
		// If it takes more than 30 sec, exit the function
		let rejectionTimeout = window.setTimeout(() => reject('Took too Long'), 30000); 
		
		// The array which contains the status of a particular set of rolls
		let state = new Array(rolls).fill(0);
		
		// Continues until I need it to
		while(true) {
			
			// Check if the current state is a match
			// rolls - satisfying condition + 1 is the number of sets formed
			// Unless proven otherwise, it is not a match
			let isMatch = false;
			for (var j = 0; j < rolls - satisfyingCondition + 1; j++) {
				let isSetMatch = true;
				for(let k = 1; k < satisfyingCondition; k++) {
					if(state[j + k - 1] !== state[j + k]) {
						isSetMatch = false;
						break;
					}
				}
				if(isSetMatch) {
					isMatch = true;
					break;
				}
			}
			
			if(isMatch) {
				matched++;
			}
			
			total++;
			
			
			// Check if it is the last state
			let isLastState = true;
			for(let l = 0; l < rolls; l++) {
				if(state[l] !== artifactTypeCount - 1) {
					isLastState = false;
					break;
				}
			}
			
			if(isLastState) {
				break;
			}
			
			// Increments the state
			for(let i = 0; i < rolls; i++) {
				state[i]++;
				// Continues if needed
				if(state[i] == artifactTypeCount) {
					state[i] = 0;
				} 
				// Else exit the for loop
				else {
					break
				}
			}
		}
		
		
		window.clearTimeout(rejectionTimeout);
		// Return the correct answer
		resolve({matched, total});
	});
}

function handleInput() {
	let output = document.querySelector('#output');
	
	output.innerHTML = 'Validating...';
	
	let satisfyingCondition = document.querySelector('#SatisfyingCount').valueAsNumber;
	let rolls = document.querySelector('#Rolls').valueAsNumber;
	let artifactTypeCount = document.querySelector('#ArtifactCount').valueAsNumber;
	
	if(isNaN(satisfyingCondition) || isNaN(rolls) || isNaN(artifactTypeCount)) {
		output.innerHTML = 'Invaild Input. All fields must be numbers.';
		return;
	}
	
	if(satisfyingCondition > rolls) {
		output.innerHTML = 'Invalid Input. Number of Artifacts required in a row must be smaller than the number of rolls.';
		return;
	}
	
	output.innerHTML = 'Calculating...';
	
	window.setTimeout(() => {
		let p = calculateProbability(satisfyingCondition, rolls, artifactTypeCount);
		p.then(
			response => {
				let factor = gcd(response.matched, response.total);
				output.innerHTML = `Matched: ${response.matched}, Total: ${response.total}, <br>
									Lowest Form: ${response.matched / factor} in ${response.total / factor}, <br>
									Probability: ${response.matched / response.total}`;
			}
		).catch(
			reason => {
				output.innerHTML = reason;
			}
		);
	}, 500);
}
