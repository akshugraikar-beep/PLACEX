import React, { useState, useEffect } from "react";
import { Brain, RotateCcw, Clock } from "lucide-react";

// QUANTITATIVE APTITUDE - 100 QUESTIONS
const QUANTITATIVE_QUESTIONS = [
  { id: 1, question: "What is 15% of 200?", options: ["30", "20", "15", "25"], correct: "30", explanation: "15% of 200 = (15/100) × 200 = 30" },
  { id: 2, question: "If a book costs Rs. 100 and has a 20% discount, what is the final price?", options: ["Rs. 80", "Rs. 70", "Rs. 90", "Rs. 75"], correct: "Rs. 80", explanation: "20% discount means pay 80% = 0.80 × 100 = 80" },
  { id: 3, question: "What is the average of 10, 20, 30, 40, 50?", options: ["30", "25", "35", "40"], correct: "30", explanation: "Sum = 150, Average = 150/5 = 30" },
  { id: 4, question: "If 5x = 25, what is x?", options: ["5", "4", "6", "3"], correct: "5", explanation: "x = 25/5 = 5" },
  { id: 5, question: "What is √144?", options: ["12", "11", "13", "14"], correct: "12", explanation: "12 × 12 = 144" },
  { id: 6, question: "A train travels 60 km in 1 hour. Distance in 2.5 hours?", options: ["150 km", "120 km", "100 km", "180 km"], correct: "150 km", explanation: "Distance = 60 × 2.5 = 150 km" },
  { id: 7, question: "Cost of 12 pens at Rs. 5 each?", options: ["Rs. 60", "Rs. 50", "Rs. 70", "Rs. 40"], correct: "Rs. 60", explanation: "12 × 5 = 60" },
  { id: 8, question: "What is 2³?", options: ["8", "6", "10", "4"], correct: "8", explanation: "2³ = 2 × 2 × 2 = 8" },
  { id: 9, question: "Ratio of 100 and 80?", options: ["5:4", "4:5", "2:3", "3:2"], correct: "5:4", explanation: "100:80 = 5:4" },
  { id: 10, question: "25% as decimal?", options: ["0.25", "2.5", "25", "0.025"], correct: "0.25", explanation: "25% = 25/100 = 0.25" },
  { id: 11, question: "If 3x + 2 = 14, x is?", options: ["4", "3", "5", "2"], correct: "4", explanation: "3x = 12, x = 4" },
  { id: 12, question: "Perimeter of square with side 5 cm?", options: ["20 cm", "25 cm", "15 cm", "10 cm"], correct: "20 cm", explanation: "Perimeter = 4 × 5 = 20 cm" },
  { id: 13, question: "2 cups flour makes 12 cookies. For 36 cookies?", options: ["6 cups", "4 cups", "8 cups", "5 cups"], correct: "6 cups", explanation: "36/12 = 3 times, so 2 × 3 = 6" },
  { id: 14, question: "HCF of 12 and 18?", options: ["6", "3", "12", "18"], correct: "6", explanation: "Common factors are 1,2,3,6. HCF = 6" },
  { id: 15, question: "If increased by 10% to 110, original was?", options: ["100", "99", "101", "105"], correct: "100", explanation: "110% of x = 110, x = 100" },
  { id: 16, question: "Area of rectangle 8cm × 5cm?", options: ["40 cm²", "26 cm²", "13 cm²", "80 cm²"], correct: "40 cm²", explanation: "Area = 8 × 5 = 40" },
  { id: 17, question: "Probability of even number on dice?", options: ["1/2", "1/3", "1/6", "2/3"], correct: "1/2", explanation: "Even: 2,4,6 = 3 out of 6 = 1/2" },
  { id: 18, question: "10% of 500?", options: ["50", "100", "5", "500"], correct: "50", explanation: "10% × 500 = 50" },
  { id: 19, question: "If 2x - 5 = 7, x is?", options: ["6", "5", "4", "7"], correct: "6", explanation: "2x = 12, x = 6" },
  { id: 20, question: "LCM of 4 and 6?", options: ["12", "24", "8", "6"], correct: "12", explanation: "Common multiple: 12" },
  { id: 21, question: "Score 80/100. Percentage?", options: ["80%", "85%", "75%", "90%"], correct: "80%", explanation: "80/100 × 100 = 80%" },
  { id: 22, question: "Cube root of 27?", options: ["3", "9", "6", "2"], correct: "3", explanation: "3 × 3 × 3 = 27" },
  { id: 23, question: "5 notebooks cost Rs. 50. Cost of 8?", options: ["Rs. 80", "Rs. 75", "Rs. 90", "Rs. 100"], correct: "Rs. 80", explanation: "Cost per = 50/5 = 10, 8 × 10 = 80" },
  { id: 24, question: "Simple interest on Rs. 1000 at 5% for 2 years?", options: ["Rs. 100", "Rs. 50", "Rs. 200", "Rs. 150"], correct: "Rs. 100", explanation: "SI = (1000 × 5 × 2)/100 = 100" },
  { id: 25, question: "0.5 × 0.5?", options: ["0.25", "0.5", "0.75", "1"], correct: "0.25", explanation: "0.5 × 0.5 = 0.25" },
  { id: 26, question: "If a = 2, b = 3, then a² + b²?", options: ["13", "12", "11", "15"], correct: "13", explanation: "4 + 9 = 13" },
  { id: 27, question: "50% of 80?", options: ["40", "50", "30", "60"], correct: "40", explanation: "50% × 80 = 40" },
  { id: 28, question: "If x/4 = 5, x is?", options: ["20", "15", "10", "25"], correct: "20", explanation: "x = 5 × 4 = 20" },
  { id: 29, question: "Circumference of circle, radius 7cm (π=22/7)?", options: ["44 cm", "22 cm", "88 cm", "154 cm"], correct: "44 cm", explanation: "2πr = 2 × (22/7) × 7 = 44" },
  { id: 30, question: "Shirt costs Rs. 200, 25% discount?", options: ["Rs. 150", "Rs. 175", "Rs. 125", "Rs. 100"], correct: "Rs. 150", explanation: "200 × 0.75 = 150" },
  { id: 31, question: "12 ÷ 0.4?", options: ["30", "25", "20", "35"], correct: "30", explanation: "12 ÷ 0.4 = 30" },
  { id: 32, question: "If 3x = 12, then 2x?", options: ["8", "12", "6", "4"], correct: "8", explanation: "x = 4, 2x = 8" },
  { id: 33, question: "Area of triangle, base 10, height 6?", options: ["30 cm²", "60 cm²", "15 cm²", "45 cm²"], correct: "30 cm²", explanation: "(1/2) × 10 × 6 = 30" },
  { id: 34, question: "What is 5⁴?", options: ["625", "125", "25", "3125"], correct: "625", explanation: "5 × 5 × 5 × 5 = 625" },
  { id: 35, question: "24 students in 6 groups. Per group?", options: ["4", "6", "3", "8"], correct: "4", explanation: "24 ÷ 6 = 4" },
  { id: 36, question: "1.5 + 2.3?", options: ["3.8", "3.5", "3.9", "4.0"], correct: "3.8", explanation: "1.5 + 2.3 = 3.8" },
  { id: 37, question: "Car travels 240 km in 4 hours. Speed?", options: ["60 km/h", "50 km/h", "70 km/h", "80 km/h"], correct: "60 km/h", explanation: "Speed = 240/4 = 60" },
  { id: 38, question: "18% of 100?", options: ["18", "20", "15", "25"], correct: "18", explanation: "18% of 100 = 18" },
  { id: 39, question: "If x + 10 = 25, x is?", options: ["15", "35", "5", "20"], correct: "15", explanation: "x = 25 - 10 = 15" },
  { id: 40, question: "Average of 5 and 15?", options: ["10", "20", "15", "5"], correct: "10", explanation: "(5 + 15)/2 = 10" },
  { id: 41, question: "Number × 3 = 27. Number is?", options: ["9", "8", "10", "6"], correct: "9", explanation: "27/3 = 9" },
  { id: 42, question: "60% of 50?", options: ["30", "35", "40", "25"], correct: "30", explanation: "60% × 50 = 30" },
  { id: 43, question: "Area of square with side 6?", options: ["36 cm²", "24 cm²", "12 cm²", "48 cm²"], correct: "36 cm²", explanation: "6² = 36" },
  { id: 44, question: "If 2x + 3 = 9, x is?", options: ["3", "4", "2", "5"], correct: "3", explanation: "2x = 6, x = 3" },
  { id: 45, question: "0.75 + 0.50?", options: ["1.25", "1.50", "1.00", "1.75"], correct: "1.25", explanation: "0.75 + 0.50 = 1.25" },
  { id: 46, question: "Spend Rs. 300 from Rs. 500. Percent left?", options: ["40%", "60%", "30%", "70%"], correct: "40%", explanation: "(200/500) × 100 = 40%" },
  { id: 47, question: "√16?", options: ["4", "8", "2", "6"], correct: "4", explanation: "4 × 4 = 16" },
  { id: 48, question: "300 pages book, 60 pages/day. Days to finish?", options: ["5 days", "4 days", "6 days", "3 days"], correct: "5 days", explanation: "300/60 = 5" },
  { id: 49, question: "33.33% of 300?", options: ["100", "99", "101", "110"], correct: "100", explanation: "(1/3) × 300 = 100" },
  { id: 50, question: "If 4x = 28, x is?", options: ["7", "6", "8", "5"], correct: "7", explanation: "28/4 = 7" },
  { id: 51, question: "What is 7² + 3²?", options: ["58", "50", "49", "52"], correct: "58", explanation: "49 + 9 = 58" },
  { id: 52, question: "If cost is Rs. 500 and profit is 25%, selling price?", options: ["Rs. 625", "Rs. 600", "Rs. 575", "Rs. 550"], correct: "Rs. 625", explanation: "SP = 500 × 1.25 = 625" },
  { id: 53, question: "3/4 of 120?", options: ["90", "80", "100", "75"], correct: "90", explanation: "(3/4) × 120 = 90" },
  { id: 54, question: "If distance = 100 km, time = 2.5 hrs, speed?", options: ["40 km/h", "50 km/h", "60 km/h", "35 km/h"], correct: "40 km/h", explanation: "100/2.5 = 40" },
  { id: 55, question: "What is 20% of 500?", options: ["100", "80", "120", "90"], correct: "100", explanation: "20% × 500 = 100" },
  { id: 56, question: "6x - 5 = 19, x is?", options: ["4", "5", "6", "3"], correct: "4", explanation: "6x = 24, x = 4" },
  { id: 57, question: "Volume of cube with side 3cm?", options: ["27 cm³", "9 cm³", "18 cm³", "36 cm³"], correct: "27 cm³", explanation: "3³ = 27" },
  { id: 58, question: "If A:B = 2:3 and B:C = 3:4, then A:C?", options: ["2:4", "1:2", "1:3", "3:4"], correct: "2:4", explanation: "A:C = 2:4" },
  { id: 59, question: "What is 144/12?", options: ["12", "10", "14", "11"], correct: "12", explanation: "144/12 = 12" },
  { id: 60, question: "Discount of 15% on Rs. 400?", options: ["Rs. 60", "Rs. 340", "Rs. 75", "Rs. 325"], correct: "Rs. 340", explanation: "400 × 0.85 = 340" },
  { id: 61, question: "What is the median of 5, 8, 3, 9, 1?", options: ["5", "8", "3", "9"], correct: "5", explanation: "Arranged: 1,3,5,8,9. Median = 5" },
  { id: 62, question: "If P = 2000, R = 5%, T = 2, SI?", options: ["Rs. 200", "Rs. 100", "Rs. 300", "Rs. 250"], correct: "Rs. 200", explanation: "SI = (2000 × 5 × 2)/100 = 200" },
  { id: 63, question: "7 × 8 - 9?", options: ["47", "56", "46", "50"], correct: "47", explanation: "56 - 9 = 47" },
  { id: 64, question: "What is √225?", options: ["15", "12", "18", "20"], correct: "15", explanation: "15 × 15 = 225" },
  { id: 65, question: "If x = 10 and y = 5, what is x + y?", options: ["15", "5", "50", "20"], correct: "15", explanation: "10 + 5 = 15" },
  { id: 66, question: "Mode of 2,3,3,4,5,5,5,6?", options: ["5", "3", "4", "6"], correct: "5", explanation: "5 appears 3 times" },
  { id: 67, question: "35 + 28 - 15?", options: ["48", "50", "45", "52"], correct: "48", explanation: "35 + 28 - 15 = 48" },
  { id: 68, question: "What is 9²?", options: ["81", "72", "90", "64"], correct: "81", explanation: "9 × 9 = 81" },
  { id: 69, question: "If 8x = 64, x is?", options: ["8", "7", "9", "6"], correct: "8", explanation: "64/8 = 8" },
  { id: 70, question: "Perimeter of circle (diameter 14cm)?", options: ["44 cm", "88 cm", "22 cm", "56 cm"], correct: "44 cm", explanation: "πd = (22/7) × 14 = 44" },
  { id: 71, question: "5/10 = ?", options: ["0.5", "0.25", "0.75", "1"], correct: "0.5", explanation: "5/10 = 1/2 = 0.5" },
  { id: 72, question: "Cost price = 500, loss = 20%, SP?", options: ["Rs. 400", "Rs. 450", "Rs. 500", "Rs. 550"], correct: "Rs. 400", explanation: "SP = 500 × 0.8 = 400" },
  { id: 73, question: "What is the range of 2,8,5,9,1,10?", options: ["9", "8", "10", "5"], correct: "9", explanation: "10 - 1 = 9" },
  { id: 74, question: "If y - 12 = 18, y is?", options: ["30", "6", "28", "32"], correct: "30", explanation: "y = 18 + 12 = 30" },
  { id: 75, question: "45 ÷ 9 + 3?", options: ["8", "6", "7", "9"], correct: "8", explanation: "5 + 3 = 8" },
  { id: 76, question: "What is 11 × 11?", options: ["121", "110", "100", "144"], correct: "121", explanation: "11 × 11 = 121" },
  { id: 77, question: "If a = 5, what is 3a?", options: ["15", "8", "10", "20"], correct: "15", explanation: "3 × 5 = 15" },
  { id: 78, question: "Surface area of cube (side 2cm)?", options: ["24 cm²", "8 cm²", "12 cm²", "16 cm²"], correct: "24 cm²", explanation: "6 × 2² = 24" },
  { id: 79, question: "What is 40% of 60?", options: ["24", "20", "30", "25"], correct: "24", explanation: "40% × 60 = 24" },
  { id: 80, question: "If 5 pens cost Rs. 10, cost of 12 pens?", options: ["Rs. 24", "Rs. 20", "Rs. 30", "Rs. 25"], correct: "Rs. 24", explanation: "Cost per pen = 2, 12 × 2 = 24" },
  { id: 81, question: "What is 3/5 as percentage?", options: ["60%", "50%", "75%", "80%"], correct: "60%", explanation: "(3/5) × 100 = 60%" },
  { id: 82, question: "If m = 7, what is m + 8?", options: ["15", "10", "20", "14"], correct: "15", explanation: "7 + 8 = 15" },
  { id: 83, question: "Diagonal of square (side 4cm)?", options: ["4√2 cm", "4 cm", "8 cm", "2√2 cm"], correct: "4√2 cm", explanation: "Diagonal = side√2 = 4√2" },
  { id: 84, question: "What is 99 + 1?", options: ["100", "98", "101", "102"], correct: "100", explanation: "99 + 1 = 100" },
  { id: 85, question: "If n × 4 = 44, n is?", options: ["11", "10", "12", "9"], correct: "11", explanation: "44/4 = 11" },
  { id: 86, question: "What is 15 × 2?", options: ["30", "28", "32", "25"], correct: "30", explanation: "15 × 2 = 30" },
  { id: 87, question: "If p = 20, what is p/4?", options: ["5", "4", "10", "8"], correct: "5", explanation: "20/4 = 5" },
  { id: 88, question: "What is 2 to power 5?", options: ["32", "30", "16", "25"], correct: "32", explanation: "2⁵ = 32" },
  { id: 89, question: "If q - 5 = 10, q is?", options: ["15", "5", "20", "10"], correct: "15", explanation: "q = 10 + 5 = 15" },
  { id: 90, question: "What is 88 ÷ 8?", options: ["11", "10", "12", "9"], correct: "11", explanation: "88/8 = 11" },
  { id: 91, question: "If 6r = 36, r is?", options: ["6", "7", "5", "4"], correct: "6", explanation: "36/6 = 6" },
  { id: 92, question: "What is √64?", options: ["8", "7", "9", "6"], correct: "8", explanation: "8 × 8 = 64" },
  { id: 93, question: "If s + 15 = 40, s is?", options: ["25", "20", "30", "35"], correct: "25", explanation: "s = 40 - 15 = 25" },
  { id: 94, question: "What is 22/2?", options: ["11", "10", "12", "9"], correct: "11", explanation: "22/2 = 11" },
  { id: 95, question: "If t = 3, what is 5t?", options: ["15", "10", "20", "12"], correct: "15", explanation: "5 × 3 = 15" },
  { id: 96, question: "What is 13 + 7?", options: ["20", "18", "22", "19"], correct: "20", explanation: "13 + 7 = 20" },
  { id: 97, question: "If u/2 = 9, u is?", options: ["18", "16", "20", "14"], correct: "18", explanation: "u = 9 × 2 = 18" },
  { id: 98, question: "What is 10² - 5²?", options: ["75", "50", "100", "25"], correct: "75", explanation: "100 - 25 = 75" },
  { id: 99, question: "If v + v = 10, v is?", options: ["5", "4", "6", "3"], correct: "5", explanation: "2v = 10, v = 5" },
  { id: 100, question: "What is 50 - 30 + 20?", options: ["40", "30", "50", "20"], correct: "40", explanation: "50 - 30 + 20 = 40" }
];

// LOGICAL REASONING - 100 QUESTIONS
const LOGICAL_QUESTIONS = [
  { id: 1, question: "Complete the series: 2, 4, 6, 8, ?", options: ["10", "12", "9", "11"], correct: "10", explanation: "Even numbers in sequence" },
  { id: 2, question: "Which is odd one out? Apple, Mango, Carrot, Banana", options: ["Carrot", "Apple", "Mango", "Banana"], correct: "Carrot", explanation: "Carrot is vegetable, others are fruits" },
  { id: 3, question: "All dogs are animals. Max is a dog. Therefore Max is?", options: ["An animal", "A pet", "Friendly", "Brown"], correct: "An animal", explanation: "Logical conclusion from given facts" },
  { id: 4, question: "Complete: 1, 1, 2, 3, 5, 8, ?", options: ["13", "11", "12", "10"], correct: "13", explanation: "Fibonacci series: each is sum of previous two" },
  { id: 5, question: "If A = 1, B = 2, ..., Z = 26, what is BIRD?", options: ["2-9-18-4", "1-8-9-4", "3-9-18-5", "2-8-19-4"], correct: "2-9-18-4", explanation: "B=2, I=9, R=18, D=4" },
  { id: 6, question: "Odd one out: Walk, Run, Jump, Think", options: ["Think", "Walk", "Run", "Jump"], correct: "Think", explanation: "Think is mental, others are physical" },
  { id: 7, question: "Pattern: 5, 10, 20, 40, ?", options: ["80", "60", "50", "70"], correct: "80", explanation: "Each number doubles" },
  { id: 8, question: "Which doesn't belong? Circle, Square, Triangle, Sphere", options: ["Sphere", "Circle", "Square", "Triangle"], correct: "Sphere", explanation: "Sphere is 3D, others are 2D" },
  { id: 9, question: "Next in series: 10, 20, 30, 40, ?", options: ["50", "45", "55", "60"], correct: "50", explanation: "Increment by 10 each time" },
  { id: 10, question: "Odd one: Monday, February, Summer, Friday", options: ["February", "Monday", "Summer", "Friday"], correct: "February", explanation: "February is month, others are days/seasons" },
  { id: 11, question: "Find pattern: 100, 50, 25, 12.5, ?", options: ["6.25", "6.5", "7", "5.5"], correct: "6.25", explanation: "Each number halved" },
  { id: 12, question: "Which is different? Horse, Dog, Cat, Flower", options: ["Flower", "Horse", "Dog", "Cat"], correct: "Flower", explanation: "Flower is plant, others are animals" },
  { id: 13, question: "Complete: 1, 4, 9, 16, ?", options: ["25", "20", "24", "30"], correct: "25", explanation: "Perfect squares: 1², 2², 3², 4², 5²" },
  { id: 14, question: "Series: 11, 22, 44, 88, ?", options: ["176", "132", "120", "100"], correct: "176", explanation: "Each number doubles" },
  { id: 15, question: "Most different: Tomato, Radish, Carrot, Spinach", options: ["Tomato", "Radish", "Carrot", "Spinach"], correct: "Tomato", explanation: "Tomato is fruit, others are vegetables" },
  { id: 16, question: "If X is taller than Y, Y is taller than Z, then?", options: ["X > Z", "Z > X", "X = Z", "Cannot compare"], correct: "X > Z", explanation: "Transitive inequality" },
  { id: 17, question: "Analogy: Doctor is to patient as teacher is to?", options: ["Student", "School", "Books", "Desk"], correct: "Student", explanation: "Relationship analogy" },
  { id: 18, question: "Pattern: 121, 144, 169, ?", options: ["196", "180", "190", "200"], correct: "196", explanation: "11², 12², 13², 14²" },
  { id: 19, question: "If 2:3 = x:6, then x = ?", options: ["4", "6", "3", "9"], correct: "4", explanation: "Cross multiply: 2×6 = 3×x, x = 4" },
  { id: 20, question: "Pattern: 1, 3, 6, 10, ?", options: ["15", "14", "16", "18"], correct: "15", explanation: "Triangular numbers" },
  { id: 21, question: "Odd word: Fast, Quick, Swift, Speed, Slow", options: ["Slow", "Fast", "Quick", "Swift"], correct: "Slow", explanation: "Slow means opposite quality" },
  { id: 22, question: "Series: 0, 1, 1, 2, 3, 5, 8, ?", options: ["13", "10", "12", "14"], correct: "13", explanation: "Fibonacci sequence" },
  { id: 23, question: "What comes next: A1B2C3?", options: ["D4", "D5", "E4", "C4"], correct: "D4", explanation: "Pattern: letter number increment" },
  { id: 24, question: "Code: 123 = ABCD. Then 231 = ?", options: ["BCA", "CAB", "ABC", "ACB"], correct: "BCA", explanation: "Position swap" },
  { id: 25, question: "Pattern: 10, 9, 7, 4, ?", options: ["0", "1", "-1", "2"], correct: "0", explanation: "Decrease by 1, 2, 3, 4..." },
  { id: 26, question: "Series: 2, 6, 12, 20, ?", options: ["30", "28", "24", "32"], correct: "30", explanation: "Pattern: 1×2, 2×3, 3×4, 4×5, 5×6" },
  { id: 27, question: "City: Country as State: ?", options: ["Nation", "City", "Region", "Country"], correct: "Nation", explanation: "Analogy relationship" },
  { id: 28, question: "Odd one: Kilogram, Kilometer, Kilowatt, Kiloliter", options: ["Kilogram", "Kilometer", "Kilowatt", "Kiloliter"], correct: "Kilogram", explanation: "Kilogram is mass, others are distance/power/volume" },
  { id: 29, question: "If A > B > C > D, then A?", options: ["Is greater than D", "Equals D", "Is less than D", "Unknown"], correct: "Is greater than D", explanation: "Transitive relation" },
  { id: 30, question: "Complete: 1, 2, 4, 8, ?", options: ["16", "12", "10", "14"], correct: "16", explanation: "Powers of 2" },
  { id: 31, question: "Which violates logic? A=1, B=2, C=3, but D=5?", options: ["D=5", "A=1", "B=2", "C=3"], correct: "D=5", explanation: "Should be D=4 following pattern" },
  { id: 32, question: "Series: 3, 6, 12, 24, ?", options: ["48", "36", "40", "50"], correct: "48", explanation: "Each doubles" },
  { id: 33, question: "Most out of place: English, Math, Science, Sports, Lunch", options: ["Lunch", "English", "Math", "Sports"], correct: "Lunch", explanation: "Lunch is meal, others are subjects" },
  { id: 34, question: "Pattern: A, B, D, G, ?, ?", options: ["K, P", "L, Q", "K, Q", "L, P"], correct: "K, P", explanation: "+1, +2, +3, +4, +5" },
  { id: 35, question: "If today is Monday, day after 100 days?", options: ["Friday", "Monday", "Tuesday", "Wednesday"], correct: "Friday", explanation: "100 ÷ 7 = 14 weeks + 2 days" },
  { id: 36, question: "Logic: All A are B. Some B are C. Then?", options: ["Some A are C", "All A are C", "No A are C", "Cannot determine"], correct: "Cannot determine", explanation: "Insufficient info" },
  { id: 37, question: "Odd: Spring, Summer, Fall, Winter, Rain", options: ["Rain", "Spring", "Summer", "Fall"], correct: "Rain", explanation: "Rain is weather, others are seasons" },
  { id: 38, question: "Which doesn't fit? Red, Blue, Green, Circle", options: ["Circle", "Red", "Blue", "Green"], correct: "Circle", explanation: "Circle is shape, others are colors" },
  { id: 39, question: "Series: 2, 3, 5, 7, 11, ?", options: ["13", "12", "14", "15"], correct: "13", explanation: "Prime numbers" },
  { id: 40, question: "If X = 5, Y = 8, Z = 11, then ?", options: ["14", "12", "13", "15"], correct: "14", explanation: "Increment by 3" },
  { id: 41, question: "Odd: Apple, Orange, Banana, Potato", options: ["Potato", "Apple", "Orange", "Banana"], correct: "Potato", explanation: "Potato is not a fruit" },
  { id: 42, question: "Pattern: 10, 11, 13, 16, 20, ?", options: ["25", "22", "24", "26"], correct: "25", explanation: "Add 1, 2, 3, 4, 5..." },
  { id: 43, question: "Logic problem: X is father of Y. Y is mother of Z. Then Z is?", options: ["Grandchild of X", "Child of X", "Sibling of X", "Parent of X"], correct: "Grandchild of X", explanation: "Family relationship" },
  { id: 44, question: "Complete: 100, 99, 97, 94, ?", options: ["90", "91", "89", "92"], correct: "90", explanation: "Decrease by 1, 2, 3, 4..." },
  { id: 45, question: "Which is most different? Car, Bike, Train, Water", options: ["Water", "Car", "Bike", "Train"], correct: "Water", explanation: "Water is element, others are vehicles" },
  { id: 46, question: "Series: 5, 11, 23, 47, ?", options: ["95", "93", "90", "92"], correct: "95", explanation: "Double and add 1" },
  { id: 47, question: "If A < B, B > C, C = D, then?", options: ["A < D", "A > D", "Cannot determine", "A = D"], correct: "Cannot determine", explanation: "No direct relation established" },
  { id: 48, question: "Pattern: ZA, YB, XC, ?, ?", options: ["WD, VE", "WE, VF", "WD, VD", "WE, VE"], correct: "WD, VE", explanation: "Reverse alphabet + increment" },
  { id: 49, question: "Series: 1, 4, 9, 16, 25, ?", options: ["36", "35", "37", "38"], correct: "36", explanation: "Perfect squares: 1², 2², 3², 4², 5², 6²" },
  { id: 50, question: "Logic: If all birds fly and penguins are birds, then penguins?", options: ["Fly", "Cannot fly", "Are flightless", "Swim"], correct: "Fly", explanation: "According to logic statement" },
  { id: 51, question: "Series: 2, 4, 8, 16, ?", options: ["32", "24", "30", "20"], correct: "32", explanation: "Each doubles" },
  { id: 52, question: "Pattern: P, Q, S, U, ?", options: ["W", "V", "X", "Y"], correct: "W", explanation: "Skip one letter: +1, +2, +2, +2" },
  { id: 53, question: "Odd one: Red, Blue, Yellow, Triangle", options: ["Triangle", "Red", "Blue", "Yellow"], correct: "Triangle", explanation: "Triangle is shape, others are colors" },
  { id: 54, question: "If M is taller than N and N is taller than O?", options: ["M > O", "O > M", "M = O", "Unknown"], correct: "M > O", explanation: "Transitive property" },
  { id: 55, question: "Series: 5, 10, 15, 20, ?", options: ["25", "30", "20", "35"], correct: "25", explanation: "Add 5 each time" },
  { id: 56, question: "Analogy: Pen is to writer as brush is to?", options: ["Painter", "Art", "Canvas", "Paint"], correct: "Painter", explanation: "Tool and user relationship" },
  { id: 57, question: "Pattern: 1, 1, 2, 3, 5, 8, 13, ?", options: ["21", "20", "19", "22"], correct: "21", explanation: "Fibonacci continues" },
  { id: 58, question: "Odd one out: Cat, Dog, Chair, Bird", options: ["Chair", "Cat", "Dog", "Bird"], correct: "Chair", explanation: "Chair is furniture, others are animals" },
  { id: 59, question: "Series: 100, 200, 300, 400, ?", options: ["500", "450", "550", "600"], correct: "500", explanation: "Add 100 each time" },
  { id: 60, question: "If P:Q = 3:4 and Q:R = 4:5, then P:R?", options: ["3:5", "4:5", "3:4", "5:6"], correct: "3:5", explanation: "Ratio combination" },
  { id: 61, question: "Pattern: 99, 88, 77, 66, ?", options: ["55", "56", "54", "57"], correct: "55", explanation: "Decrease by 11" },
  { id: 62, question: "Odd: Winter, Spring, Monday, Summer", options: ["Monday", "Winter", "Spring", "Summer"], correct: "Monday", explanation: "Monday is day, others are seasons" },
  { id: 63, question: "Series: 3, 9, 27, 81, ?", options: ["243", "162", "200", "300"], correct: "243", explanation: "Multiply by 3" },
  { id: 64, question: "Which doesn't fit: Soccer, Cricket, Tennis, Basketball", options: ["Basketball", "Soccer", "Cricket", "Tennis"], correct: "Basketball", explanation: "All are sports - none is different" },
  { id: 65, question: "Pattern: 1, 4, 7, 10, ?", options: ["13", "12", "14", "15"], correct: "13", explanation: "Add 3 each time" },
  { id: 66, question: "Odd one: Piano, Guitar, Saxophone, Umbrella", options: ["Umbrella", "Piano", "Guitar", "Saxophone"], correct: "Umbrella", explanation: "Umbrella is object, others are instruments" },
  { id: 67, question: "Series: 10, 20, 30, 40, ?", options: ["50", "45", "55", "60"], correct: "50", explanation: "Add 10 each time" },
  { id: 68, question: "If today is Wed, day after 14 days?", options: ["Wednesday", "Monday", "Friday", "Thursday"], correct: "Wednesday", explanation: "14 days = 2 weeks" },
  { id: 69, question: "Pattern: 2, 5, 10, 17, ?", options: ["26", "25", "24", "27"], correct: "26", explanation: "Add 3, 5, 7, 9..." },
  { id: 70, question: "Odd: Cow, Horse, Buffalo, Table", options: ["Table", "Cow", "Horse", "Buffalo"], correct: "Table", explanation: "Table is furniture, others are animals" },
  { id: 71, question: "Series: 1, 8, 27, 64, ?", options: ["125", "120", "100", "110"], correct: "125", explanation: "Cubes: 1³, 2³, 3³, 4³, 5³" },
  { id: 72, question: "Logic: All roses are flowers. Some flowers die. Then?", options: ["All roses die", "Some roses die", "No roses die", "Cannot determine"], correct: "Cannot determine", explanation: "Insufficient info" },
  { id: 73, question: "Pattern: 3, 8, 15, 24, ?", options: ["35", "34", "33", "36"], correct: "35", explanation: "Add 5, 7, 9, 11..." },
  { id: 74, question: "Which is different: Table, Chair, Sofa, Book", options: ["Book", "Table", "Chair", "Sofa"], correct: "Book", explanation: "Book is not furniture" },
  { id: 75, question: "Series: 64, 32, 16, 8, ?", options: ["4", "2", "6", "5"], correct: "4", explanation: "Divide by 2" },
  { id: 76, question: "Analogy: Foot is to Leg as Hand is to?", options: ["Arm", "Body", "Wrist", "Finger"], correct: "Arm", explanation: "Part to whole relationship" },
  { id: 77, question: "Pattern: 12, 23, 34, 45, ?", options: ["56", "55", "54", "57"], correct: "56", explanation: "Add 11 each time" },
  { id: 78, question: "Odd: Apple, Orange, Lemon, Car", options: ["Car", "Apple", "Orange", "Lemon"], correct: "Car", explanation: "Car is vehicle, others are fruits" },
  { id: 79, question: "Series: 2, 6, 18, 54, ?", options: ["162", "160", "150", "140"], correct: "162", explanation: "Multiply by 3" },
  { id: 80, question: "If X > Y > Z, which is smallest?", options: ["Z", "X", "Y", "Cannot tell"], correct: "Z", explanation: "Z is last in decreasing order" },
  { id: 81, question: "Pattern: 1, 3, 7, 15, ?", options: ["31", "30", "29", "32"], correct: "31", explanation: "Add 2, 4, 8, 16..." },
  { id: 82, question: "Most different: Gold, Silver, Bronze, Steel", options: ["Steel", "Gold", "Silver", "Bronze"], correct: "Steel", explanation: "Steel is alloy, others are elements/metals" },
  { id: 83, question: "Series: 5, 6, 8, 11, ?", options: ["15", "14", "13", "16"], correct: "15", explanation: "Add 1, 2, 3, 4..." },
  { id: 84, question: "Complete: A, C, E, G, ?", options: ["I", "H", "J", "K"], correct: "I", explanation: "Alternate letters" },
  { id: 85, question: "Which doesn't belong: Winter, December, January, February", options: ["Winter", "December", "January", "February"], correct: "Winter", explanation: "Winter is season, others are months" },
  { id: 86, question: "Series: 7, 14, 28, 56, ?", options: ["112", "100", "110", "120"], correct: "112", explanation: "Double each time" },
  { id: 87, question: "Odd: Tennis, Badminton, Swimming, Reading", options: ["Reading", "Tennis", "Badminton", "Swimming"], correct: "Reading", explanation: "Reading is activity, others are sports" },
  { id: 88, question: "Pattern: 11, 22, 33, 44, ?", options: ["55", "54", "56", "57"], correct: "55", explanation: "Add 11 each time" },
  { id: 89, question: "Series: 1, 2, 4, 7, ?", options: ["11", "10", "12", "13"], correct: "11", explanation: "Add 1, 2, 3, 4..." },
  { id: 90, question: "If all students are honest and Tom is a student?", options: ["Tom is honest", "Tom may not be honest", "Tom is dishonest", "Cannot determine"], correct: "Tom is honest", explanation: "Logical conclusion" },
  { id: 91, question: "Pattern: 20, 19, 17, 14, ?", options: ["10", "11", "12", "13"], correct: "10", explanation: "Subtract 1, 2, 3, 4..." },
  { id: 92, question: "Odd: Earth, Mars, Venus, Moon", options: ["Moon", "Earth", "Mars", "Venus"], correct: "Moon", explanation: "Moon is satellite, others are planets" },
  { id: 93, question: "Series: 3, 12, 27, 48, ?", options: ["75", "74", "76", "70"], correct: "75", explanation: "Pattern: 3×1, 3×4, 3×9, 3×16, 3×25" },
  { id: 94, question: "Pattern: B, D, F, H, ?", options: ["J", "K", "I", "L"], correct: "J", explanation: "Alternate letters" },
  { id: 95, question: "Which is odd: Violin, Flute, Trumpet, Bicycle", options: ["Bicycle", "Violin", "Flute", "Trumpet"], correct: "Bicycle", explanation: "Bicycle is vehicle, others are instruments" },
  { id: 96, question: "Series: 10, 11, 13, 16, 20, ?", options: ["25", "24", "23", "26"], correct: "25", explanation: "Add 1, 2, 3, 4, 5..." },
  { id: 97, question: "If P is sister of Q and Q is sister of R?", options: ["P is sister of R", "P is brother of R", "P and R are related", "Cannot determine"], correct: "P is sister of R", explanation: "Family relationship" },
  { id: 98, question: "Pattern: 50, 45, 41, 38, ?", options: ["36", "35", "37", "38"], correct: "36", explanation: "Subtract 5, 4, 3, 2..." },
  { id: 99, question: "Odd: Red, Green, Blue, Round", options: ["Round", "Red", "Green", "Blue"], correct: "Round", explanation: "Round is shape, others are colors" },
  { id: 100, question: "Series: 9, 18, 27, 36, ?", options: ["45", "44", "46", "43"], correct: "45", explanation: "Add 9 each time" }
];

// VERBAL ABILITY - 100 QUESTIONS
const VERBAL_QUESTIONS = [
  { id: 1, question: "Synonym of 'ANCIENT':", options: ["Modern", "Old", "New", "Recent"], correct: "Old", explanation: "Ancient means very old" },
  { id: 2, question: "Antonym of 'HAPPY':", options: ["Sad", "Joy", "Smile", "Laugh"], correct: "Sad", explanation: "Sad is opposite of happy" },
  { id: 3, question: "Fill blank: He ____ to the gym daily.", options: ["go", "goes", "gone", "going"], correct: "goes", explanation: "Third person singular present tense" },
  { id: 4, question: "Correct sentence:", options: ["She don't like him", "She doesn't like him", "She not like him", "She not liking him"], correct: "She doesn't like him", explanation: "Proper grammar with negative" },
  { id: 5, question: "Synonym of 'BENIGN':", options: ["Harmful", "Kind", "Evil", "Cruel"], correct: "Kind", explanation: "Benign means harmless/kind" },
  { id: 6, question: "Antonym of 'LOGICAL':", options: ["Rational", "Illogical", "Smart", "Wise"], correct: "Illogical", explanation: "Illogical is opposite of logical" },
  { id: 7, question: "Collective noun: 'A ____ of cattle'", options: ["flock", "herd", "colony", "murder"], correct: "herd", explanation: "Collective noun for cattle" },
  { id: 8, question: "Best word: 'The weather is very ____'", options: ["heat", "hot", "hotly", "hotness"], correct: "hot", explanation: "Adjective form needed" },
  { id: 9, question: "Synonym of 'AMBIGUOUS':", options: ["Clear", "Unclear", "Simple", "Complex"], correct: "Unclear", explanation: "Ambiguous means unclear meaning" },
  { id: 10, question: "Antonym of 'ABUNDANCE':", options: ["Plenty", "Scarcity", "Growth", "Wealth"], correct: "Scarcity", explanation: "Scarcity is opposite of abundance" },
  { id: 11, question: "Correct spelling:", options: ["Recieve", "Receive", "Recive", "Receeve"], correct: "Receive", explanation: "I before E except after C" },
  { id: 12, question: "Synonym of 'MEAGER':", options: ["Plenty", "Scarce", "Abundant", "Rich"], correct: "Scarce", explanation: "Meager means insufficient" },
  { id: 13, question: "Correct form: 'She is not ____ to play.'", options: ["allow", "allows", "allowed", "allowing"], correct: "allowed", explanation: "Passive voice needed" },
  { id: 14, question: "Antonym of 'PRAISE':", options: ["Approve", "Criticize", "Compliment", "Admire"], correct: "Criticize", explanation: "Criticize is opposite of praise" },
  { id: 15, question: "Correct tense: 'He _____ his homework.'", options: ["finish", "finishes", "finished", "finishing"], correct: "finishes", explanation: "Present tense third person" },
  { id: 16, question: "Synonym of 'ADVERSARY':", options: ["Friend", "Enemy", "Ally", "Partner"], correct: "Enemy", explanation: "Adversary means opponent" },
  { id: 17, question: "Antonym of 'VERBOSE':", options: ["Talkative", "Concise", "Detailed", "Lengthy"], correct: "Concise", explanation: "Concise is opposite of verbose" },
  { id: 18, question: "Correct: 'Neither Tom ____ Jerry came.'", options: ["nor", "or", "and", "but"], correct: "nor", explanation: "Neither...nor construction" },
  { id: 19, question: "Synonym of 'DORMANT':", options: ["Active", "Inactive", "Sleeping", "Alert"], correct: "Inactive", explanation: "Dormant means inactive" },
  { id: 20, question: "Correct spelling:", options: ["Professor", "Professer", "Proffesor", "Proffesor"], correct: "Professor", explanation: "Correct spelling of professor" },
  { id: 21, question: "Antonym of 'EXPLICIT':", options: ["Clear", "Obvious", "Vague", "Detailed"], correct: "Vague", explanation: "Vague is opposite of explicit" },
  { id: 22, question: "Synonym of 'FRAGILE':", options: ["Strong", "Delicate", "Solid", "Sturdy"], correct: "Delicate", explanation: "Fragile means easily broken" },
  { id: 23, question: "Conditional: 'If I ____ known, I would help.'", options: ["had", "have", "has", "would"], correct: "had", explanation: "Past perfect in conditional" },
  { id: 24, question: "Antonym of 'GENEROUS':", options: ["Kind", "Selfish", "Giving", "Noble"], correct: "Selfish", explanation: "Selfish is opposite of generous" },
  { id: 25, question: "Synonym of 'ZEALOUS':", options: ["Lazy", "Enthusiastic", "Apathetic", "Careless"], correct: "Enthusiastic", explanation: "Zealous means very enthusiastic" },
  { id: 26, question: "Correct word: 'He is _____ than his brother.'", options: ["taller", "more tall", "tallest", "tall"], correct: "taller", explanation: "Comparative form needed" },
  { id: 27, question: "Correct spelling:", options: ["Bizarre", "Bazaar", "Bisarre", "Bizzare"], correct: "Bizarre", explanation: "Correct spelling: bizarre" },
  { id: 28, question: "Antonym of 'TRANQUIL':", options: ["Peaceful", "Calm", "Chaotic", "Serene"], correct: "Chaotic", explanation: "Chaotic is opposite of tranquil" },
  { id: 29, question: "Synonym of 'DILIGENT':", options: ["Lazy", "Hard-working", "Careless", "Reckless"], correct: "Hard-working", explanation: "Diligent means hardworking" },
  { id: 30, question: "Correct: 'There are _____ apples.'", options: ["fewer", "less", "much", "many"], correct: "fewer", explanation: "Fewer for countable nouns" },
  { id: 31, question: "Antonym of 'CANDID':", options: ["Honest", "Deceptive", "Truthful", "Frank"], correct: "Deceptive", explanation: "Deceptive is opposite of candid" },
  { id: 32, question: "Synonym of 'PRUDENT':", options: ["Rash", "Wise", "Foolish", "Hasty"], correct: "Wise", explanation: "Prudent means careful/wise" },
  { id: 33, question: "Past tense: 'She _____ to France last year.'", options: ["go", "goes", "went", "going"], correct: "went", explanation: "Past tense needed" },
  { id: 34, question: "Antonym of 'LUCID':", options: ["Clear", "Obvious", "Murky", "Transparent"], correct: "Murky", explanation: "Murky is opposite of lucid" },
  { id: 35, question: "Synonym of 'EPHEMERAL':", options: ["Permanent", "Temporary", "Lasting", "Eternal"], correct: "Temporary", explanation: "Ephemeral means short-lived" },
  { id: 36, question: "Correct word: 'The ____ of history'", options: ["Course", "Coarse", "Cource", "Coarse"], correct: "Course", explanation: "Course (path) not coarse (rough)" },
  { id: 37, question: "Grammar: 'They are ____ to succeed'", options: ["likely", "likely", "likeable", "liking"], correct: "likely", explanation: "Adjective + infinitive" },
  { id: 38, question: "Antonym of 'PUNGENT':", options: ["Strong", "Weak", "Odorous", "Aromatic"], correct: "Weak", explanation: "Opposite intensity" },
  { id: 39, question: "Synonym of 'METICULOUS':", options: ["Careless", "Careful", "Sloppy", "Rough"], correct: "Careful", explanation: "Meticulous means very careful" },
  { id: 40, question: "Modifies adjective: 'The book was _____ interesting.'", options: ["very", "much", "too", "so"], correct: "very", explanation: "Very modifies adjectives" },
  { id: 41, question: "Antonym of 'FRIVOLOUS':", options: ["Light", "Serious", "Silly", "Trifling"], correct: "Serious", explanation: "Serious is opposite of frivolous" },
  { id: 42, question: "Synonym of 'SAUNTER':", options: ["Run", "Walk slowly", "Sprint", "Jump"], correct: "Walk slowly", explanation: "Saunter means leisurely walk" },
  { id: 43, question: "Question and answer: '____ you ready?' - 'Yes, ____.'", options: ["Are/I am", "Is/I is", "Are/I'm", "Is/I'm"], correct: "Are/I'm", explanation: "Question + answer agreement" },
  { id: 44, question: "Antonym of 'PROFUSE':", options: ["Abundant", "Sparse", "Copious", "Ample"], correct: "Sparse", explanation: "Sparse is opposite of profuse" },
  { id: 45, question: "Synonym of 'CANDOR':", options: ["Dishonesty", "Honesty", "Secrecy", "Silence"], correct: "Honesty", explanation: "Candor means frankness/honesty" },
  { id: 46, question: "Verb tense: 'She _____ the class.'", options: ["lead", "leads", "leading", "led"], correct: "leads", explanation: "Present tense needed" },
  { id: 47, question: "Antonym of 'INDUSTRIOUS':", options: ["Hardworking", "Lazy", "Careful", "Attentive"], correct: "Lazy", explanation: "Lazy is opposite of industrious" },
  { id: 48, question: "Synonym of 'PRISTINE':", options: ["Dirty", "Clean", "Used", "Worn"], correct: "Clean", explanation: "Pristine means spotlessly clean" },
  { id: 49, question: "Subject-verb: 'Neither of them _____ coming.'", options: ["are", "is", "were", "am"], correct: "is", explanation: "Singular subject takes singular verb" },
  { id: 50, question: "Antonym of 'ALOOF':", options: ["Distant", "Friendly", "Cold", "Remote"], correct: "Friendly", explanation: "Friendly is opposite of aloof" },
  { id: 51, question: "Synonym of 'ELOQUENT':", options: ["Quiet", "Expressive", "Silent", "Shy"], correct: "Expressive", explanation: "Eloquent means powerfully expressive" },
  { id: 52, question: "Correct: 'She is _____ than him.'", options: ["more clever", "clever", "cleverer", "most clever"], correct: "cleverer", explanation: "Comparative needed" },
  { id: 53, question: "Antonym of 'MEEK':", options: ["Timid", "Bold", "Shy", "Quiet"], correct: "Bold", explanation: "Bold is opposite of meek" },
  { id: 54, question: "Synonym of 'MUNDANE':", options: ["Exciting", "Ordinary", "Thrilling", "Adventure"], correct: "Ordinary", explanation: "Mundane means ordinary/dull" },
  { id: 55, question: "Correct spelling:", options: ["Occured", "Occurred", "Ocured", "Occurrd"], correct: "Occurred", explanation: "Double C double R" },
  { id: 56, question: "Antonym of 'VIGILANT':", options: ["Watchful", "Careless", "Alert", "Aware"], correct: "Careless", explanation: "Careless is opposite of vigilant" },
  { id: 57, question: "Synonym of 'PLACID':", options: ["Restless", "Calm", "Active", "Busy"], correct: "Calm", explanation: "Placid means calm/peaceful" },
  { id: 58, question: "Correct: 'If I _____ you, I would help.'", options: ["was", "were", "am", "being"], correct: "were", explanation: "Subjunctive mood" },
  { id: 59, question: "Antonym of 'PROLIFIC':", options: ["Productive", "Infertile", "Fertile", "Creative"], correct: "Infertile", explanation: "Infertile is opposite of prolific" },
  { id: 60, question: "Synonym of 'AUDACITY':", options: ["Fear", "Boldness", "Cowardice", "Weakness"], correct: "Boldness", explanation: "Audacity means daring boldness" },
  { id: 61, question: "Correct form: '_____ you finished?'", options: ["Is", "Are", "Have", "Has"], correct: "Have", explanation: "Present perfect question" },
  { id: 62, question: "Antonym of 'LETHARGIC':", options: ["Energetic", "Sluggish", "Tired", "Lazy"], correct: "Energetic", explanation: "Energetic is opposite of lethargic" },
  { id: 63, question: "Synonym of 'ENIGMA':", options: ["Answer", "Mystery", "Solution", "Truth"], correct: "Mystery", explanation: "Enigma means a puzzling mystery" },
  { id: 64, question: "Correct spelling:", options: ["Neccessary", "Necessary", "Necssary", "Necesary"], correct: "Necessary", explanation: "One C two S's" },
  { id: 65, question: "Antonym of 'JOVIAL':", options: ["Merry", "Morose", "Happy", "Cheerful"], correct: "Morose", explanation: "Morose is opposite of jovial" },
  { id: 66, question: "Synonym of 'FORTUITOUS':", options: ["Planned", "Accidental", "Intentional", "Deliberate"], correct: "Accidental", explanation: "Fortuitous means happening by chance" },
  { id: 67, question: "Correct: 'Neither option is _____ good.'", options: ["very", "enough", "too", "so"], correct: "good", explanation: "Negative form needs adjustment" },
  { id: 68, question: "Antonym of 'AUSPICIOUS':", options: ["Favorable", "Unlucky", "Blessed", "Fortunate"], correct: "Unlucky", explanation: "Unlucky is opposite of auspicious" },
  { id: 69, question: "Synonym of 'COPIOUS':", options: ["Scarce", "Abundant", "Limited", "Few"], correct: "Abundant", explanation: "Copious means plentiful" },
  { id: 70, question: "Correct form: '_____ than you expected?'", options: ["Better", "Best", "Good", "More good"], correct: "Better", explanation: "Comparative needed" },
  { id: 71, question: "Antonym of 'DOCILE':", options: ["Obedient", "Rebellious", "Mild", "Gentle"], correct: "Rebellious", explanation: "Rebellious is opposite of docile" },
  { id: 72, question: "Synonym of 'DIATRIBE':", options: ["Praise", "Tirade", "Compliment", "Flattery"], correct: "Tirade", explanation: "Diatribe means a forceful tirade" },
  { id: 73, question: "Correct: 'Either John _____ Mary is coming.'", options: ["nor", "or", "and", "but"], correct: "or", explanation: "Either...or construction" },
  { id: 74, question: "Antonym of 'STOIC':", options: ["Emotional", "Calm", "Unaffected", "Composed"], correct: "Emotional", explanation: "Emotional is opposite of stoic" },
  { id: 75, question: "Synonym of 'VERBOSE':", options: ["Concise", "Talkative", "Brief", "Short"], correct: "Talkative", explanation: "Verbose means excessively talkative" },
  { id: 76, question: "Correct spelling:", options: ["Occassion", "Occasion", "Ocasion", "Occation"], correct: "Occasion", explanation: "One C two S's" },
  { id: 77, question: "Antonym of 'SERENE':", options: ["Peaceful", "Turbulent", "Calm", "Tranquil"], correct: "Turbulent", explanation: "Turbulent is opposite of serene" },
  { id: 78, question: "Synonym of 'CACOPHONY':", options: ["Harmony", "Discord", "Music", "Melody"], correct: "Discord", explanation: "Cacophony means harsh discord" },
  { id: 79, question: "Correct: 'This book is _____ than that.'", options: ["interesting", "more interesting", "most interesting", "interestinger"], correct: "more interesting", explanation: "Comparative of polysyllabic adjective" },
  { id: 80, question: "Antonym of 'SQUALID':", options: ["Dirty", "Clean", "Filthy", "Grimy"], correct: "Clean", explanation: "Clean is opposite of squalid" },
  { id: 81, question: "Synonym of 'OBFUSCATE':", options: ["Clarify", "Confuse", "Explain", "Simplify"], correct: "Confuse", explanation: "Obfuscate means to confuse" },
  { id: 82, question: "Correct form: 'I wish I _____ come.'", options: ["can", "could", "will", "would"], correct: "could", explanation: "Subjunctive mood for wishes" },
  { id: 83, question: "Antonym of 'ACRIMONIOUS':", options: ["Bitter", "Kind", "Harsh", "Sarcastic"], correct: "Kind", explanation: "Kind is opposite of acrimonious" },
  { id: 84, question: "Synonym of 'EPHEMERAL':", options: ["Lasting", "Brief", "Permanent", "Eternal"], correct: "Brief", explanation: "Ephemeral means lasting a short time" },
  { id: 85, question: "Correct: 'If you _____, you will succeed.'", options: ["try", "tries", "trying", "tried"], correct: "try", explanation: "Conditional present tense" },
  { id: 86, question: "Antonym of 'FERVID':", options: ["Passionate", "Indifferent", "Zealous", "Ardent"], correct: "Indifferent", explanation: "Indifferent is opposite of fervid" },
  { id: 87, question: "Synonym of 'JUXTAPOSE':", options: ["Separate", "Compare by place", "Hide", "Conceal"], correct: "Compare by place", explanation: "Juxtapose means place side by side" },
  { id: 88, question: "Correct spelling:", options: ["Persistant", "Persistent", "Persistant", "Persistense"], correct: "Persistent", explanation: "Persistent is the correct form" },
  { id: 89, question: "Antonym of 'PERSPICACIOUS':", options: ["Shrewd", "Dull", "Keen", "Insightful"], correct: "Dull", explanation: "Dull is opposite of perspicacious" },
  { id: 90, question: "Synonym of 'PROPITIOUS':", options: ["Unfavorable", "Auspicious", "Unlucky", "Bad"], correct: "Auspicious", explanation: "Propitious means favorable/auspicious" },
  { id: 91, question: "Correct: 'She has been working for _____ hours.'", options: ["two", "too", "to", "tue"], correct: "two", explanation: "Number form needed" },
  { id: 92, question: "Antonym of 'EBULLIENT':", options: ["Joyful", "Sad", "Cheerful", "Happy"], correct: "Sad", explanation: "Sad is opposite of ebullient" },
  { id: 93, question: "Synonym of 'PELLUCID':", options: ["Unclear", "Clear", "Murky", "Opaque"], correct: "Clear", explanation: "Pellucid means transparently clear" },
  { id: 94, question: "Correct form: 'This is _____ difficult than that.'", options: ["more", "most", "less", "least"], correct: "more", explanation: "Comparative marker needed" },
  { id: 95, question: "Antonym of 'MALEVOLENT':", options: ["Wicked", "Benevolent", "Evil", "Cruel"], correct: "Benevolent", explanation: "Benevolent is opposite of malevolent" },
  { id: 96, question: "Synonym of 'CIRCUMLOCUTION':", options: ["Directness", "Roundabout speech", "Clarity", "Brevity"], correct: "Roundabout speech", explanation: "Circumlocution means indirect expression" },
  { id: 97, question: "Correct: 'She would help if she _____ able.'", options: ["is", "was", "were", "be"], correct: "were", explanation: "Subjunctive conditional" },
  { id: 98, question: "Antonym of 'PUSILLANIMOUS':", options: ["Cowardly", "Brave", "Timid", "Fearful"], correct: "Brave", explanation: "Brave is opposite of pusillanimous" },
  { id: 99, question: "Synonym of 'ASSUAGE':", options: ["Worsen", "Soothe", "Aggravate", "Intensify"], correct: "Soothe", explanation: "Assuage means to calm or soothe" },
  { id: 100, question: "Correct spelling:", options: ["Accelerate", "Accelrate", "Acelerate", "Accellerate"], correct: "Accelerate", explanation: "Accelerate is the correct form" }
];

const SECTIONS = [
  { name: "Quantitative Aptitude", key: "quantitative", color: "from-blue-600 to-blue-700" },
  { name: "Logical Reasoning", key: "logical", color: "from-purple-600 to-purple-700" },
  { name: "Verbal Ability", key: "verbal", color: "from-green-600 to-green-700" }
];

const AptitudePreparationNew = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [usedQuestionHistory, setUsedQuestionHistory] = useState([]); // Track last 5 sections

  // Shuffle options while keeping track of correct answer
  const shuffleQuestionOptions = (question) => {
    const optionsWithIndices = question.options.map((opt, idx) => ({
      text: opt,
      isCorrect: opt === question.correct
    }));
    
    // Fisher-Yates shuffle
    for (let i = optionsWithIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
    }
    
    return {
      ...question,
      options: optionsWithIndices.map(o => o.text)
    };
  };

  // Get questions based on section with exclusion of recently used questions
  const getQuestionsBySection = (section) => {
    let questions = [];
    if (section === "quantitative") questions = QUANTITATIVE_QUESTIONS;
    else if (section === "logical") questions = LOGICAL_QUESTIONS;
    else if (section === "verbal") questions = VERBAL_QUESTIONS;
    
    // Flatten recently used question IDs (last 5 sections)
    const recentlyUsedIds = new Set(usedQuestionHistory.flat());
    
    // Filter out questions that were used recently
    const availableQuestions = questions.filter(q => !recentlyUsedIds.has(q.id));
    
    // If not enough questions available, use all (fallback)
    const questionsToUse = availableQuestions.length >= 10 ? availableQuestions : questions;
    
    return questionsToUse
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map(q => shuffleQuestionOptions(q));
  };

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showScore || isTimedOut) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimedOut(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showScore, isTimedOut]);

  // Auto move to next when time runs out
  useEffect(() => {
    if (isTimedOut) {
      const timer = setTimeout(() => {
        handleNext();
        setIsTimedOut(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isTimedOut]);

  const startQuiz = (section) => {
    const questions = getQuestionsBySection(section);
    const questionIds = questions.map(q => q.id);
    
    setQuizQuestions(questions);
    setSelectedSection(section);
    setQuizStarted(true);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowScore(false);
    setTimeLeft(60);
    setIsTimedOut(false);
    
    // Update history: add new questions to history, keep only last 5 sections
    setUsedQuestionHistory(prev => {
      const updated = [questionIds, ...prev];
      return updated.slice(0, 5); // Keep only last 5 sections
    });
  };

  const handleAnswerClick = (answer) => {
    if (!isTimedOut) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentIndex]: answer
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(60);
      setIsTimedOut(false);
    } else {
      setShowScore(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimeLeft(60);
      setIsTimedOut(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setSelectedSection(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowScore(false);
    setQuizQuestions([]);
    setTimeLeft(60);
    setIsTimedOut(false);
    // Keep usedQuestionHistory to prevent repeating in next 5 sections
  };

  // SECTION SELECTION SCREEN
  if (!quizStarted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 p-4">
        <div className="text-center max-w-5xl w-full">
          <Brain className="w-20 h-20 mx-auto text-blue-600 dark:text-blue-400 mb-8" />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Aptitude Test
          </h1>

          {/* Section Cards */}
          <div className="grid grid-cols-3 gap-10 mb-12 w-full mt-16">
            {SECTIONS.map((section) => (
              <div
                key={section.key}
                className={`bg-gradient-to-br ${section.color} rounded-2xl p-10 text-white cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl flex flex-col items-center justify-between h-96`}
                onClick={() => startQuiz(section.key)}
              >
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="text-3xl font-bold text-center leading-tight">{section.name}</h3>
                </div>
                <div className="flex items-center justify-center gap-3 w-full my-8">
                  <Clock size={22} />
                  <p className="font-semibold text-center text-lg">10 Questions • 60 sec each</p>
                </div>
                <button className="bg-white text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all hover:shadow-lg w-full text-lg">
                  Start Quiz →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SCORE SCREEN
  if (showScore) {
    const score = calculateScore();
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const sectionName = SECTIONS.find(s => s.key === selectedSection)?.name;
    let performance = "";
    if (percentage >= 80) performance = "Excellent! 🎉";
    else if (percentage >= 60) performance = "Good! 👍";
    else if (percentage >= 40) performance = "Average 🤔";
    else performance = "Keep Practicing! 💪";

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 p-4">
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Quiz Complete! 🎓
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{sectionName}</p>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {percentage}%
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {score} out of {quizQuestions.length} Correct
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {performance}
            </p>
          </div>

          {/* Answer Review */}
          <div className="mb-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Answer Review:
            </h3>
            <div className="space-y-4">
              {quizQuestions.map((q, idx) => {
                const isCorrect = selectedAnswers[idx] === q.correct;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? "border-green-300 bg-green-50 dark:bg-green-900"
                        : "border-red-300 bg-red-50 dark:bg-red-900"
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      Q{idx + 1}. {q.question}
                    </p>
                    <p className={`text-sm mb-1 ${isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                      Your Answer: <span className="font-bold">{selectedAnswers[idx] || "Not Answered"}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Correct Answer: <span className="font-bold">{q.correct}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Try Another Section
          </button>
        </div>
      </div>
    );
  }

  // QUESTION SCREEN
  const currentQuestion = quizQuestions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const sectionName = SECTIONS.find(s => s.key === selectedSection)?.name;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Top Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-center flex-1">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{sectionName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Question {currentIndex + 1} of {quizQuestions.length}</p>
          </div>
          
          {/* Timer */}
          <div className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg ${
            timeLeft <= 10 
              ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
              : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
          }`}>
            <Clock size={20} />
            {timeLeft < 10 ? "0" : ""}{timeLeft}s
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedAnswers[currentIndex] === option
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-400"
                } ${isTimedOut ? "opacity-60 pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${currentIndex}`}
                  value={option}
                  checked={selectedAnswers[currentIndex] === option}
                  onChange={() => handleAnswerClick(option)}
                  disabled={isTimedOut}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
                <span className="ml-3 text-lg text-gray-900 dark:text-white font-medium">
                  {option}
                </span>
              </label>
            ))}
          </div>

          {/* Time Expired Message */}
          {isTimedOut && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg font-semibold animate-pulse">
              ⏰ Time's up! Moving to next question...
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              className={`px-6 py-3 font-bold rounded-lg transition-all ${
                isAnswered || isTimedOut
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-105"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isAnswered && !isTimedOut}
            >
              {currentIndex === quizQuestions.length - 1 ? "Finish Quiz →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudePreparationNew;
