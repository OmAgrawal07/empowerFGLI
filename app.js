document.addEventListener("DOMContentLoaded", function() {
    let myPieChart;

    document.getElementById("budget-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const income = parseFloat(document.getElementById("income").value);
        const allocation = document.getElementById("allocation").value;
        const hasDebt = document.getElementById("hasDebt").value;
        const paysRent = document.getElementById("paysRent").value;

        let rentPayment = 0;
        let debtPayment = 0;

        if (paysRent === "yes") {
            rentPayment = parseFloat(document.getElementById("monthlyRent").value);
        }

        if (hasDebt === "yes") {
            const principal = parseFloat(document.getElementById("principal").value);
            const loanTerm = parseInt(document.getElementById("loanTerm").value);
            const monthlyInterestRate = (parseFloat(document.getElementById("monthlyInterestRate").value) / 100) / 12;

            const denominator = 1 - Math.pow(1 + monthlyInterestRate, -loanTerm);
            debtPayment = (monthlyInterestRate * principal) / denominator;
        }

        const remainingIncome = income - rentPayment - debtPayment;

        let savings = 0;
        let investment = 0;

        if (allocation === "save") {
            savings = 0.325 * remainingIncome;
            investment = 0.125 * remainingIncome;
        } else if (allocation === "invest") {
            savings = 0.20 * remainingIncome;
            investment = 0.25 * remainingIncome;
        }

        const expenses = remainingIncome - savings - investment;

        const data = {
            labels: ["Savings", "Investment", "Expenses", "Debt Payment", "Rent Payment"],
            datasets: [{
                data: [savings, investment, expenses, debtPayment, rentPayment],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4CAF50", "#FF5733"]
            }]
        };

        const options = {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return `$${Number(value.toFixed(2)).toLocaleString()}`;
                    }
                }
            },
            
            legend: {
                labels: {
                    fontColor: 'black',
                    fontFamily: 'Poppins, Arial, sans-serif',
                    fontSize: 14,
                    boxWidth: 0,
                }
            }
        };

        const canvas = document.getElementById("pie-chart");
        canvas.style.display = "block";

        const ctx = canvas.getContext("2d");

        if (myPieChart) {
            myPieChart.destroy();
        }

        myPieChart = new Chart(ctx, {
            type: "pie",
            data: data,
            options: options
        });
    });

    document.getElementById("hasDebt").addEventListener("change", function() {
        const debtForm = document.getElementById("debt-form");
        const hasDebt = this.value;

        if (hasDebt === "yes") {
            debtForm.style.display = "block";
        } else {
            debtForm.style.display = "none";
        }
    });

    document.getElementById("paysRent").addEventListener("change", function() {
        const rentForm = document.getElementById("rent-form");
        const paysRent = this.value;

        if (paysRent === "yes") {
            rentForm.style.display = "block";
        } else {
            rentForm.style.display = "none";
        }
    });

    document.getElementById("reset-button").addEventListener("click", function() {
        document.getElementById("budget-form").reset();
        document.getElementById("debt-form").style.display = "none";
        document.getElementById("rent-form").style.display = "none";
        document.getElementById("pie-chart").style.display = "none";

        if (myPieChart) {
            myPieChart.destroy();
        }
    });
});
