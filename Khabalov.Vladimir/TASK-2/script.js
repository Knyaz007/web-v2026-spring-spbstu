function calculateExpression(expr) {
            // Удаляем все пробелы
            expr = expr.replace(/\s/g, '');
            
            if (expr.length === 0) {
                throw new Error("Выражение не может быть пустым");
            }
            
            // Разделяем на числа и операторы
            const numbers = [];
            const operators = [];
            let currentNumber = '';
            
            for (let i = 0; i < expr.length; i++) {
                const char = expr[i];
                
                if ((char >= '0' && char <= '9') || char === '.') {
                    currentNumber += char;
                } else if (char === '+' || char === '-' || char === '*' || char === '/') {
                    if (currentNumber === '') {
                        // Обработка унарного минуса в начале
                        if (char === '-' && numbers.length === 0 && operators.length === 0) {
                            currentNumber = '-';
                            continue;
                        }
                        throw new Error(`Ожидалось число перед оператором ${char}`);
                    }
                    numbers.push(parseFloat(currentNumber));
                    currentNumber = '';
                    operators.push(char);
                } else {
                    throw new Error(`Недопустимый символ: "${char}"`);
                }
            }
            
            if (currentNumber === '') {
                throw new Error("Выражение заканчивается оператором");
            }
            numbers.push(parseFloat(currentNumber));
            
            if (numbers.length !== operators.length + 1) {
                throw new Error("Некорректное выражение");
            }
            
            // Сначала умножение и деление
            let i = 0;
            while (i < operators.length) {
                if (operators[i] === '*' || operators[i] === '/') {
                    let result;
                    if (operators[i] === '*') {
                        result = numbers[i] * numbers[i + 1];
                    } else {
                        if (numbers[i + 1] === 0) {
                            throw new Error("Деление на ноль");
                        }
                        result = numbers[i] / numbers[i + 1];
                    }
                    
                    numbers.splice(i, 2, result);
                    operators.splice(i, 1);
                } else {
                    i++;
                }
            }
            
            // Затем сложение и вычитание
            let result = numbers[0];
            for (let i = 0; i < operators.length; i++) {
                if (operators[i] === '+') {
                    result += numbers[i + 1];
                } else if (operators[i] === '-') {
                    result -= numbers[i + 1];
                }
            }
            
            return result;
        }
        
        function calculate() {
            const input = document.getElementById('expression');
            const resultSpan = document.getElementById('result');
            const errorDiv = document.getElementById('error');
            
            const expression = input.value.trim();
            
            errorDiv.textContent = '';
            
            if (expression === '') {
                errorDiv.textContent = 'Пожалуйста, введите выражение';
                resultSpan.textContent = '—';
                return;
            }
            
            try {
                const result = calculateExpression(expression);
                
                // Форматируем результат
                let formattedResult;
                if (Number.isInteger(result)) {
                    formattedResult = result;
                } else {
                    formattedResult = parseFloat(result.toFixed(10)).toString();
                }
                
                resultSpan.textContent = formattedResult;
            } catch (error) {
                errorDiv.textContent = `Ошибка: ${error.message}`;
                resultSpan.textContent = '—';
            }
        }
        
        function clearInput() {
            document.getElementById('expression').value = '';
            document.getElementById('result').textContent = '—';
            document.getElementById('error').textContent = '';
        }
        
        function setExample(example) {
            document.getElementById('expression').value = example;
            calculate();
        }
        
        // Расчет по Enter
        document.getElementById('expression').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                calculate();
            }
        });
        
        // Автоматический расчет при загрузке
        window.addEventListener('load', calculate);