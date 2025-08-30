// Implementation 1: Using mathematical formula (Gauss's formula)
// Check mathematical formula here: https://letstalkscience.ca/educational-resources/backgrounders/gauss-summation
var sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
};

// Implementation 2: Using Array methods and reduce
// Step1: Array.from =>  creates a new Array then convert 
// Step2: Transforms the index to start from 1 instead of 0
// Step3: use reduce to calculate
var sum_to_n_b = function(n) {
    return Array.from({length: n}, (_, i) => i + 1).reduce((sum, num) => sum + num, 0);
};

// Implementation 3: Using recursion
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};

// Export functions for testing
module.exports = {
    sum_to_n_a,
    sum_to_n_b,
    sum_to_n_c
};
