import { Button, Spinner } from "@chakra-ui/react"
import { useState, useEffect } from 'react'

function UpdateFromOrderingQueue() {
    const [updating, setUpdating] = useState(false)
    async function update() {
        setUpdating(true)
        let res = await fetch('/api/orderingQueue');
        const data = await res.json();
        console.log(res.ok);
        if (!res.ok) {
            let error = data.err.response.errors[0].message
            if (error == "Not authenticated") {
                alert("Must authorize the app first");
                setUpdating(false)
                return;
            }
            alert("There was an error recieving the data");
            setUpdating(false)
            return;
        }


        //need to get column idx for subsystem, lead, quantity, price, vendors
        let subsystemIdx;
        let leadIdx;
        let quantityIdx;
        let vendorIdx;
        let priceIdx;
        let indexIdx;
        let columns = data.columns;
        let orders = data.orders;
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].title == "Subsystem") {
                subsystemIdx = i-1;
            } else if (columns[i].title == "Lead") {
                leadIdx = i-1;
            } else if (columns[i].title == "Quantity") {
                quantityIdx = i-1;
            } else if (columns[i].title == "Vendor") {
                vendorIdx = i-1;
            } else if (columns[i].title == "Price") {
                priceIdx = i-1;
            } else if (columns[i].title == "Index") {
                indexIdx = i-1;
            }
        }
        //subsystem budgets
        console.log("Getting subsystemBudgets");
        res = await fetch('/api/subsystemBudgets');
        let subsystemBudgets = await res.json();
        //spenders
        console.log("Getting spenders")
        res = await fetch('/api/spending');
        let spenders = await res.json();
        //team budget
        console.log("Getting team budget")
        res = await fetch('/api/teamBudget');
        let teamBudget = await res.json();
        console.log(teamBudget);
        //index balances
        console.log("Getting index balances")
        res = await fetch('/api/indexBalances');
        let indexBalances = await res.json();
        console.log(indexBalances);
        //vendors
        console.log("Geting vendors")
        res = await fetch('/api/vendors');
        let vendors = await res.json();
        if (data.fromBudget) {
            console.log("Set everything to zeroed values");
            //set everything to zeroed values
            //subsystem budgets
            for (let i = 0; i < subsystemBudgets.length; i++) {
                console.log("Changing subsystemBudgets")
                subsystemBudgets[i].spent = "0.00";
                subsystemBudgets[i].remaining = subsystemBudgets[i].budget;
                subsystemBudgets[i].percentRemaining = "100";
            }
            //spenders
            for (let i = 0; i < spenders.length; i++) {
                console.log("Changing spenders")
                spenders[i].spending = "0.00";
            }
            //team budget
            let totalBudget = 0;
            let discretionaryBudget = 0;
            for (let i = 0; i < teamBudget.length; i++) {
                console.log("Changing teamBudget");
                if (teamBudget[i].section_name == "Budget") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Discretionary Budget") {
                            console.log(typeof(teamBudget[i].items[j].value));
                            discretionaryBudget = teamBudget[i].items[j].value;
                        } else if (teamBudget[i].items[j].name == "Total Budget") {
                            console.log(typeof(teamBudget[i].items[j].value));
                            totalBudget = teamBudget[i].items[j].value;
                        }
                   }
                }
                if (teamBudget[i].section_name == "Spending") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Discretionary Unspent") {
                            teamBudget[i].items[j].value = discretionaryBudget;
                        } else if (teamBudget[i].items[j].name == "Total Spent") {
                            teamBudget[i].items[j].value = 0;
                        } else if (teamBudget[i].items[j].name == "Total Unspent") {
                            teamBudget[i].items[j].value = totalBudget;
                        }
                   }
                }
            }
            //index balances
            for (let i = 0; i < indexBalances.length; i++) {
                console.log("Changing index Balances")
                indexBalances[i].spent = 0.00;
                indexBalances[i].balance = indexBalances[i].revenue;
            }
            //vendors
            for (let i = 0; i < vendors.length; i++) {
                console.log("Changing vendors")
                vendors[i].spending = "0.00";
            }
        };
        
        await change(subsystemIdx, leadIdx, quantityIdx, vendorIdx, priceIdx, indexIdx, orders, subsystemBudgets, indexBalances, teamBudget, vendors, spenders);

        setUpdating(false)
        alert("Update successful");
    }

    async function change(subsystemIdx, leadIdx, quantityIdx, vendorIdx, priceIdx, indexIdx, orders, subsystemBudgets, indexBalances,
        teamBudget, vendors, spenders
    ) {
        console.log("Entered the function");
        for (let i = 0; i < orders.length; i++) {
            //get total cost
            let quantity = parseInt(orders[i].column_values[quantityIdx].text.replace(/,/g, ''));
            let cost = parseFloat(orders[i].column_values[priceIdx].text.replace(/,/g, '')) * quantity;
            if (isNaN(cost)) {
                console.log("index " + i + " is not a number");
                continue;
            }
            cost = Math.round(cost * 100) / 100;
            //deal with subsystem budgets
            let subsystem = orders[i].column_values[subsystemIdx].text;
            for (let j = 0; j < subsystemBudgets.length; j++) {
                if (subsystemBudgets[j].subsystem == subsystem) {
                    let totalBudget = parseFloat(subsystemBudgets[j].budget.replace(/,/g, ''));
                    let spent = parseFloat(subsystemBudgets[j].spent.replace(/,/g, '')) + cost;
                    let remaining = parseFloat(subsystemBudgets[j].remaining.replace(/,/g, '')) - cost;
                    let percentRemaining = parseInt((remaining / totalBudget) * 100);
                    console.log("percent for " + subsystem + " is " + percentRemaining);
                    subsystemBudgets[j].remaining = remaining.toLocaleString('en-US');
                    subsystemBudgets[j].spent = spent.toLocaleString('en-US');
                    subsystemBudgets[j].percentRemaining = percentRemaining.toLocaleString('en-US');
                    break;
                }
            }
            //deal with index balances
            let index = orders[i].column_values[indexIdx].text;
            for (let j = 0; j < indexBalances.length; j++) {
                if (indexBalances[j].index == index) {
                    let totalRevenue = indexBalances[j].revenue;
                    let spent = indexBalances[j].spent;
                    spent += cost;
                    let balance = totalRevenue - spent;
                    console.log("balance " + balance);
                    spent = Math.round(spent * 100) / 100;
                    balance = Math.round(balance * 100) / 100;
                    console.log("balance rounded " + balance);
                    indexBalances[j].spent = spent;
                    indexBalances[j].balance = balance;
                    break;
                }
            }
            //deal with vendors
            let vendor = orders[i].column_values[vendorIdx].text;
            for (let j = 0; j < vendors.length; j++) {
                if (vendors[j].name == vendor) {
                    let spending = parseFloat(vendors[j].spending.replace(/,/g, '')) + cost;
                    vendors[j].spending = spending.toLocaleString('en-US');
                    break;
                }
            }
            //deal with spenders
            let spendersString = orders[i].column_values[leadIdx].text;
            let spendersList = spendersString.split(/[ ,;]+/)
            for (let j = 0; j < spenders.length; j++) {
                for (let k = 0; k < spendersList.length; k++) {
                    if (spenders[j].name == spendersList[k]) {
                        console.log("Found the spender");
                        let spending = parseFloat(spenders[j].spending.replace(/,/g, '')) + cost;
                        spenders[j].spending = spending.toLocaleString('en-US');
                        break;
                    }
                }
            }
            //deal with team budget
            for (let i = 0; i < teamBudget.length; i++) {
                if (teamBudget[i].section_name == "Spending") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Discretionary Unspent") {
                            let unspent = teamBudget[i].items[j].value;
                            teamBudget[i].items[j].value = unspent - cost;
                        } else if (teamBudget[i].items[j].name == "Total Spent") {
                            let spent = teamBudget[i].items[j].value;
                            teamBudget[i].items[j].value = spent + cost;
                        } else if (teamBudget[i].items[j].name == "Total Unspent") {
                            let unspent = teamBudget[i].items[j].value;
                            teamBudget[i].items[j].value = unspent - cost;
                        }
                   }
                }
            }
        }
        //set everything
        //subsystem budgets
        let postRes = await fetch('/api/subsystemBudgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subsystemBudgets)
        }).then(res => {
            console.log(res);
        });
        //spenders
        postRes = postRes = await fetch('/api/spending', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spenders)
        }).then(res => {
            console.log(res);
        });
        //team budget
        postRes = await fetch('/api/teamBudget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamBudget)
        }).then(res => {
            console.log(res);
        });
        //index balances
        postRes = await fetch('/api/indexBalances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(indexBalances)
        }).then(res => {
            console.log(res);
        });
        //vendors
        postRes = await fetch('/api/vendors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendors)
        }).then(res => {
            console.log(res);
        });
    }

    if (updating) {
        return(
            <>
                <Button onClick={update} backgroundColor="white" colorPalette="gray" variant="outline" size="sm" disabled>Update pages from ordering queue</Button>
                <Spinner/>
            </>
        )
    }
    else {
        return (
            <Button onClick={update} backgroundColor="white" colorPalette="gray" variant="outline" size="sm">Update pages from ordering queue</Button>
        )
    }
}

export default UpdateFromOrderingQueue;