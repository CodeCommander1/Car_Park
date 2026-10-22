#include <bits/stdc++.h>
using namespace std;

void displayMenu() {
    cout << "\n===============================\n";
    cout << "     STOCK PROFIT ANALYSER     \n";
    cout << "===============================\n";
    cout << "1. Enter Stock Details\n";
    cout << "2. Input Prices\n";
    cout << "3. Display Prices\n";
    cout << "4. Analyze Profit (Kadane’s Algo)\n";
    cout << "5. Show Detailed Trace\n";
    cout << "6. Show Statistical Summary\n";
    cout << "7. Visualize Price Chart\n";
    cout << "8. Save Report to File\n";
    cout << "9. Exit\n";
    cout << "Enter your choice: ";
}

int main() {
    string stockName, dateRange;
    vector<long long> prices;
    int choice;

    while (true) {
        displayMenu();

        if (!(cin >> choice)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid input! Please enter a number.\n";
            continue;
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        if (choice == 1) {
            cout << "Enter Stock Name: ";
            getline(cin, stockName);
            cout << "Enter Date Range (e.g., Jan-2024 to Jun-2024): ";
            getline(cin, dateRange);
        }

        else if (choice == 2) {
            int n;
            cout << "Enter number of days: ";
            cin >> n;
            prices.resize(n);
            cout << "Enter prices (space separated): ";
            for (int i = 0; i < n; ++i)
                cin >> prices[i];
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        }

        else if (choice == 3) {
            if (prices.empty()) cout << "No price data available.\n";
            else {
                cout << "Prices: ";
                for (auto p : prices) cout << p << " ";
                cout << endl;
            }
        }

        else if (choice == 4) {
            if (prices.empty()) {
                cout << "Please input prices first!\n";
                continue;
            }

            long long maxSum = LLONG_MIN, currSum = 0;
            int start = 0, end = 0, tempStart = 0;

            for (int i = 0; i < (int)prices.size(); ++i) {
                currSum += prices[i];
                if (currSum > maxSum) {
                    maxSum = currSum;
                    start = tempStart;
                    end = i;
                }
                if (currSum < 0) {
                    currSum = 0;
                    tempStart = i + 1;
                }
            }

            cout << "\nMaximum Profit Subarray:\n";
            cout << "Profit = " << maxSum << "\n";
            cout << "Range: [" << start << ", " << end << "]\n";
            cout << "Prices: ";
            for (int i = start; i <= end; ++i) cout << prices[i] << " ";
            cout << endl;
        }

        else if (choice == 5) {
            if (prices.empty()) {
                cout << "Please input prices first!\n";
                continue;
            }

            cout << "\nIteration Trace:\n";
            cout << "i\tPrice\tCurrSum\tMaxSum\n";

            long long maxSum = LLONG_MIN, currSum = 0;
            for (int i = 0; i < (int)prices.size(); ++i) {
                currSum += prices[i];
                maxSum = max(maxSum, currSum);
                cout << i << "\t" << prices[i] << "\t" << currSum << "\t" << maxSum << "\n";
                if (currSum < 0) currSum = 0;
            }
        }

        else if (choice == 6) {
            if (prices.empty()) {
                cout << "Please input prices first!\n";
                continue;
            }

            double avg = accumulate(prices.begin(), prices.end(), 0.0) / prices.size();
            long long minVal = *min_element(prices.begin(), prices.end());
            long long maxVal = *max_element(prices.begin(), prices.end());

            cout << "\nStatistical Summary:\n";
            cout << "Average Price: " << avg << "\n";
            cout << "Minimum Price: " << minVal << "\n";
            cout << "Maximum Price: " << maxVal << "\n";
        }

        else if (choice == 7) {
            if (prices.empty()) {
                cout << "Please input prices first!\n";
                continue;
            }

            cout << "\nPrice Chart:\n";
            for (auto p : prices) {
                cout << setw(3) << p << " | ";
                for (int i = 0; i < p; ++i) cout << "*";
                cout << "\n";
            }
        }

        else if (choice == 8) {
            if (prices.empty()) {
                cout << "Please input prices first!\n";
                continue;
            }

            ofstream out("Stock_Report.txt");
            if (!out) {
                cout << "Error creating file!\n";
                continue;
            }

            out << "Stock Name: " << stockName << "\n";
            out << "Date Range: " << dateRange << "\n";
            out << "Prices: ";
            for (auto p : prices) out << p << " ";
            out << "\n";

            out.close();
            cout << "Report saved to Stock_Report.txt\n";
        }

        else if (choice == 9) {
            cout << "Exiting program. Goodbye!\n";
            break;
        }

        else {
            cout << "Invalid choice! Please try again.\n";
        }
    }

   return 0;
}
