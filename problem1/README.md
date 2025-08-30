# Problem 1: Sum to N Functions
## Project Structure
```
src/problem1/
├── main.js      # Implementation of three sum functions.
├── test.js      # Test to verify function correctness.
```

### 1. **Mathematical Formula (Gauss's Formula)** - `sum_to_n_a`
```javascript
var sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
};
```

### 2. **Array Reduce Method** - `sum_to_n_b`
```javascript
var sum_to_n_b = function(n) {
    return Array.from({length: n}, (_, i) => i + 1).reduce((sum, num) => sum + num, 0);
};
```

### 3. **Recursion** - `sum_to_n_c`
```javascript
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};
```

# Step-by-Step to check result.
# Step 1. **Navigate to the problem1 directory**
   ```bash
   cd src/problem1
   ```

# Step 2. **Run the test suite**
   ```bash
   node test.js
   ```

### Expected Output
When you run `node test.js`, you should see output similar to:
```
🧪 Testing Sum Functions
==================================================

📊 Testing: sum_to_n_a (Mathematical Formula)
----------------------------------------
✅ n=5: 15 (PASSED)
✅ n=0: 0 (PASSED)
✅ n=-1: 0 (PASSED)

🎉 All tests passed!

📊 Testing: sum_to_n_b (Array Reduce)
----------------------------------------
✅ n=5: 15 (PASSED)
✅ n=0: 0 (PASSED)
✅ n=-1: 0 (PASSED)

🎉 All tests passed!

📊 Testing: sum_to_n_c (Recursion)
----------------------------------------
✅ n=5: 15 (PASSED)
✅ n=0: 0 (PASSED)
✅ n=-1: 0 (PASSED)

🎉 All tests passed!

🔧 Test to verify method result
Input: n = 5
sum_to_n_a(5) = 15
sum_to_n_b(5) = 15
sum_to_n_c(5) = 15

Input: n = 0
sum_to_n_a(0) = 0
sum_to_n_b(0) = 0
sum_to_n_c(0) = 0

Input: n = -1
sum_to_n_a(-1) = 0
sum_to_n_b(-1) = 0
sum_to_n_c(-1) = 0
```