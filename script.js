let display=document.getElementById('input-box');
let buttons=document.querySelectorAll("button");


let button=Array.from(buttons);
let string="";
button.forEach(btn=>{
    btn.addEventListener("click",(e)=>{


        if(e.target.innerHTML=="DEL"){
            string=string.substring(0,string.length-1);
            display.value=string;
        }
        else if(e.target.innerHTML=="AC"){
            string='';
            display.value=string;
        }
        else if(e.target.innerHTML=="="){
            string=evaluateExpression(string);
            display.value=string;
        }

        //fixes the 7*-3 isseue and 7**3 this isseue
        else if ("%+-*/".includes(e.target.innerHTML)) {
            let lastChar = string[string.length - 1];
        
            // Prevent operators at the beginning (except '-')
            if (!string && e.target.innerHTML !== "-") {
                return;
            }
            // if(lastChar==="-"){
            //     return;
            // }
        
            // Allow negative numbers after *, /, %
            if ("*/%".includes(lastChar) && e.target.innerHTML === "-") {
                string += e.target.innerHTML;
                display.value = string;
                return;
            }
            let lastTwo=string[string.length-2];
            if ("%+-*/".includes(lastTwo)) {
                string = string.slice(0, -1);
            }
        
            // If the last character is already an operator, replace it
            if ("%+-*/".includes(lastChar)) {
                string = string.slice(0, -1);
            }
        
            // Append the new operator
            string += e.target.innerHTML;
            display.value = string;
        }
        
        
        
        // fixes the 6..3 isseue

        else if (e.target.innerHTML=== ".") {
            // Prevent multiple dots in the same number
            let lastNumber = string.split(/[\+\-\*\/]/).pop(); // Get the last number
            if (lastNumber.includes(".")) return; // If the number already has a dot, ignore the new one

            string += e.target.innerHTML;
            display.value = string;
        }
        else{   
        string+=e.target.innerHTML;
        // display.value=string;

        console.log(e.target.innerText);
        }
        updateDisplay();
    });
});
function evaluateExpression(expression) {
    try {
        let numbers = [];
        let operators = [];
        let num = "";
        let lastChar = "";

        for (let i = 0; i < expression.length; i++) {
            let char = expression[i];

            if ("0123456789.".includes(char)) {
                num += char; // Build the number
            } else {
                // Handle negative numbers correctly (e.g., "7*-3")
                if (char === "-" && (i === 0 || "+-*/".includes(lastChar))) {
                    num += char; // Treat as part of the number
                } else {
                    numbers.push(parseFloat(num)); // Store number
                    num = "";
                    operators.push(char); // Store operator
                }
            }
            lastChar = char;
        }
        numbers.push(parseFloat(num)); // Push last number

        if (numbers.includes(NaN)) return "Error"; // Prevent invalid inputs

        // Handling multiplication and division first
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === "*" || operators[i] === "/") {
                let result = operators[i] === "*" 
                    ? numbers[i] * numbers[i + 1] 
                    : numbers[i] / numbers[i + 1];

                numbers.splice(i, 2, result);
                operators.splice(i, 1);
                i--; // Adjust index after removal
            }
        }

        // Handling addition and subtraction
        while (operators.length > 0) {
            let result = operators[0] === "+"
                ? numbers[0] + numbers[1]
                : numbers[0] - numbers[1];

            numbers.splice(0, 2, result);
            operators.shift();
        }

        return numbers[0];
    } catch (error) {
        return "Error";
    }
}
function updateDisplay() {
    display.value = string;

    // Auto-scroll to keep the latest number visible
    setTimeout(() => {
        display.scrollLeft = display.scrollWidth;
    }, 0);
}
