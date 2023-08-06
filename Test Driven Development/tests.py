import unittest
import snakestats

class TestsForSnakeStats(unittest.TestCase):
    
    def testDeviation1(self):
        # TEST 1, check if result is within approximate values, NO ROUND VALUE
        res = deviation([2,-1,1.1])
        self.assertLessEqual(res, 1.3)
        self.assertLessEqual(1.2, res)

    def testDeviation2(self):
        # TEST 2, check if result is exactly the one returned, to 3sf
        res = deviation([2,-1,1.1])
        self.assertEqual(res, 1.257)

    def testDeviation3(self):
        # TEST 3, check if result is returned for an empty list
        res = deviation([])
        self.assertEqual(res, 0)

    def testMedian1(self):
        # TEST 1, returns result if number of items in list is odd
        res = median([1,2,3,4,5])
        self.assertEqual(res, 3)

    def testMedian2(self):
        # TEST 2, returns result if number of items in list is even
        res = median([1,2,3,4])
        self.assertEqual(res, 2.5)

    def testMedian3(self):
        # TEST 3, returns if items in list unordered
        res = median([1,4,3,2])
        self.assertEqual(res, 2.5)

    def testFactorial1(self):
        # TEST 1, check if result is correct for positive factorial
        res = factorial(5)
        self.assertEqual(res, 120)

    def testFactorial2(self):
        # TEST 2, check if result is correct for zero factorial
        res = factorial(0)
        self.assertEqual(res, 1)

    def testFactorial3(self):
        # TEST 3, check if result is correct for negative factorial
        res = factorial(-5)
        self.assertEqual(res, -120)

unittest.main(argv=['ignored', '-v'], exit=False)


