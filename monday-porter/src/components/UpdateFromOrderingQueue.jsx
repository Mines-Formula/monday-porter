function UpdateFromOrderingQueue() {
    async function update() {
        let res = await fetch('/api/orderingQueue');
        const data = await res.json();
        console.log(data);
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
            } else if (columns[i].title == "Requester") {
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
        res = await fetch('/api/subsystemBudgets');
        let subsystemBudgets = await res.json();
        //spenders
        res = await fetch('/api/spenders');
        let spenders = await res.json();
        //team budget
        res = await fetch('/api/teamBudget');
        let teamBudget = await res.json();
        //index balances
        res = await fetch('/api/indexBalances');
        let indexBalances = await res.json();
        //vendors
        res = await fetch('/api/vendors');
        let vendors = await res.json();
        if (data.fromBudget) {
            //set everything to zeroed values
            //subsystem budgets
            for (let i = 0; i < subsystemBudgets.length; i++) {
                subsystemBudgets[i].spent = "0.00";
                subsystemBudgets[i].remaining = subsystemBudgets[i].budget;
                subsystemBudgets[i].percentRemaining = "100";
            }
            //spenders
            for (let i = 0; i < spenders.length; i++) {
                spenders[i].spending = "0.00";
            }
            //team budget
            for (let i = 0; i < teamBudget.length; i++) {
                if (teamBudget[i].section_name == "Spending") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Discretionary Unspent") {
                            teamBudget[i].items[j].value = 0;
                        } else if (teamBudget[i].items[j].name == "Total spent") {
                            teamBudget[i].items[j].value = 0;
                        } else if (teamBudget[i].items[j].name == "Total Unspent") {
                            teamBudget[i].items[j].value = 0;
                        }
                   }
                }
            }
            //index balances
            for (let i = 0; i < indexBalances.length; i++) {
                indexBalances[i].spent = "0.00";
                indexBalances[i].balance = indexBalances[i].revenue;
            }
            //vendors
            for (let i = 0; i < vendors.length; i++) {
                vendors[i].spending = "0.00";
            }
        }
        for (let i = 0; i < orders.length; i++) {
            //get total cost
            let quantity = parseInt(orders[i].column_values[quantityIdx].text.replace(/,/g, ''));
            let cost = parseFloat(orders[i].column_values[priceIdx].text.replace(/,/g, '')) * quantity;
            //deal with subsystem budgets
            let subsystem = orders[i].column_values[subsystemIdx].text;
            for (let j = 0; j < subsystemBudgets.length; j++) {
                if (subsystemBudgets[j].subsystem == subsystem) {
                    let totalBudget = parseFloat(subsystemBudgets[j].budget.replace(/,/g, ''));
                    subsystemBudgets[j].spent = parseFloat(subsystemBudgets[j].spent.replace(/,/g, '')) + cost;
                    subsystemBudgets[j].remaining = parseFloat(subsystemBudgets[j].remaining.replace(/,/g, '')) - cost;
                    subsystemBudgets[j].percentRemaining = parseInt((subsystemBudgets[j].remaining / totalBudget) * 100);
                    subsystemBudgets[j].remaining = subsystemBudgets[j].remaining.toLocaleString('en-US');
                    subsystemBudgets[j].spent = subsystemBudgets[j].spent.toLocaleString('en-US');
                    subsystemBudgets[j].percentRemaining = subsystemBudgets[j].percentRemaining.toLocaleString('en-US');
                    break;
                }
            }
            //deal with index balances
            let index = orders[i].column_values[indexIdx].text;
            for (let j = 0; j < indexBalances.length; j++) {
                if (indexBalances[j].index == index) {
                    let totalRevenue = parseFloat(indexBalances[j].revenue.replace(/,/g, ''));
                    indexBalances[j].spent = parseFloat(indexBalances[j].spent.replace(/,/g, '')) + cost;
                    indexBalances[j].balance = totalRevenue - indexBalances[j].spent;
                    indexBalances[j].spent = indexBalances[j].spent.toLocaleString('en-US');
                    indexBalances[j].balance = indexBalances[j].balance.toLocaleString('en-US');
                    break;
                }
            }
            //deal with vendors
            let vendor = orders[i].column_values[vendorIdx].text;
            for (let j = 0; j < vendors.length; j++) {
                if (vendors[j].name == vendor) {
                    vendors[j].spending = parseFloat(vendors[j].spending.replace(/,/g, '')) + cost;
                    vendors[j].spending = vendors[j].spending.toLocaleString('en-US');
                    break;
                }
            }
            //deal with spenders
            let spender = orders[i].column_values[leadIdx].text;
            for (let j = 0; j < spenders.length; j++) {
                if (spenders[j].name == spender) {
                    spenders[j].spending = parseFloat(spenders[j].spending.replace(/,/g, '')) + cost;
                    spenders[j].spending = spending[j].spending.toLocaleString('en-US');
                    break;
                }
            }
            //deal with team budget
            for (let i = 0; i < teamBudget.length; i++) {
                if (teamBudget[i].section_name == "Spending") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Discretionary Unspent") {
                            teamBudget[i].items[j].value -= cost;
                        } else if (teamBudget[i].items[j].name == "Total spent") {
                            teamBudget[i].items[j].value += cost;
                        } else if (teamBudget[i].items[j].name == "Total Unspent") {
                            teamBudget[i].items[j].value -= cost;
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
        });
        //spenders
        postRes = postRes = await fetch('/api/spenders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spenders)
        });
        //team budget
        postRes = await fetch('/api/teamBudget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamBudget)
        });
        //index balances
        postRes = await fetch('/api/indexBalances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(indexList)
        });
        //vendors
        postRes = await fetch('/api/vendors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendors)
        });
    }

    return (
        <button onClick={update}>Update pages from ordering queue</button>
    )
}

export default UpdateFromOrderingQueue;