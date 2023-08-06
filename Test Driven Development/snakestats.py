def deviation(vals):
    n = len(vals)
    if n == 0:
        return 0
    mean = sum(vals) / n
    squaredDiffs = [(x - mean) ** 2 for x in vals]
    variance = sum(squaredDiffs) / n
    standardDeviation = variance ** 0.5
    return round(standardDeviation, 3)

def median(numbers):
    numbers.sort()
    n = len(numbers)
    if n % 2 == 0:
        rightIndex = n // 2
        leftIndex = rightIndex - 1
        return (numbers[leftIndex] + numbers[rightIndex]) / 2 
    else:
        middle = n // 2
        return numbers[middle]

def factorial(n):
    negative = False
    if n < 0:
        n = -n
        negative = True
    if n == 0:
        return 1
    for x in range(1, n + 1):
        if x == 1:
            result = 1
        result *= x
    if negative == True:
        return -result
    return result