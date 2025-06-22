#include <iostream> // For input and output
using namespace std;

int main() {
    // Declare variables to store numbers and the chosen operation
    double num1, num2;
    char operation;

    // Greet the user and explain the program
    cout << "Welcome to the Simple Calculator!" << endl;
    cout << "You can perform + (addition), - (subtraction), * (multiplication), and / (division)." << endl;

    // Ask the user to enter the first number
    cout << "Please enter the first number: ";
    cin >> num1;

    // Ask the user to choose an arithmetic operation
    cout << "Enter the operation (+, -, *, /): ";
    cin >> operation;

    // Ask the user to enter the second number
    cout << "Now enter the second number: ";
    cin >> num2;

    // Perform calculation based on the chosen operation
    cout << "Calculating result..." << endl;

    switch (operation) {
        case '+':
            cout << "The sum is: " << num1 + num2 << endl;
            break;
        case '-':
            cout << "The difference is: " << num1 - num2 << endl;
            break;
        case '*':
            cout << "The product is: " << num1 * num2 << endl;
            break;
        case '/':
            // Check for division by zero
            if (num2 != 0)
                cout << "The quotient is: " << num1 / num2 << endl;
            else
                cout << "Oops! Division by zero is not allowed." << endl;
            break;
        default:
            // Handle invalid operator input
            cout << "Invalid operation! Please run the program again and choose from +, -, *, /." << endl;
    }

    cout << "Thank you for using the calculator. Have a great day!" << endl;

    return 0;
}
