const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./main.js');

// Test cases
const testCases = [    
    { n: 5, expected: 15 },    
    { n: 0, expected: 0 },
    { n: -1, expected: 0 } // For recursion function
];

// Test function
function runTests() {
    console.log('🧪 Testing Sum Functions\n');
    console.log('='.repeat(50));
    
    const functions = [
        { name: 'sum_to_n_a (Mathematical Formula)', func: sum_to_n_a },
        { name: 'sum_to_n_b (Array Reduce)', func: sum_to_n_b },
        { name: 'sum_to_n_c (Recursion)', func: sum_to_n_c }
    ];
    
    functions.forEach(({ name, func }) => {
        console.log(`\n📊 Testing: ${name}`);
        console.log('-'.repeat(40));        
        let allPassed = true;
        
        testCases.forEach(({ n, expected }) => {
            try {
                const result = func(n);
                const passed = result === expected;
                
                if (passed) {
                    console.log(`✅ n=${n}: ${result} (PASSED)`);
                } else {
                    console.log(`❌ n=${n}: Expected ${expected}, Got ${result} (FAILED)`);
                    allPassed = false;
                }
            } catch (error) {
                console.log(`💥 n=${n}: Error - ${error.message}`);
                allPassed = false;
            }
        });
        
        console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed!'}`);
    });    
}

// Test to check method result.
function manualTest() {
    console.log('\n🔧 Test to verify method result');
    
    const testValues = testCases.map(testCase => testCase.n);
    
    testValues.forEach(n => {
        console.log(`\nInput: n = ${n}`);
        console.log(`sum_to_n_a(${n}) = ${sum_to_n_a(n)}`);
        console.log(`sum_to_n_b(${n}) = ${sum_to_n_b(n)}`);
        console.log(`sum_to_n_c(${n}) = ${sum_to_n_c(n)}`);
    });
}

// Run tests
console.log(`test require.main: ${require.main}`)

if (require.main === module) {
    runTests();
    manualTest();
}

module.exports = { runTests, manualTest };
