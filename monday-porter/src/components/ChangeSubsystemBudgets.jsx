import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import 'src/App.css'

function ChangeSubsystemBudgets({subsystemBudgetsInput, setSubsystemBudgets}) {
    async function handleSubmit(evt) {
        //manage data input
        evt.preventDefault();
        const form = evt.target;
        const formData = new FormData(form);
        let message = "";
        let amountInput = formData.get("amount");
        if (amountInput == "0.00") {
            message += "Must enter in an amount\n";
        }
        let subsystemGive = formData.get("subsystem");
        if (subsystemGive == "") {
            message += "Must enter in a subsystem to give money to\n";
        }
        let explanationInput = formData.get("explanation");
        console.log(explanationInput);
        if (explanationInput == "") {
            message += "Must enter explanation for budget change\n";
        }
        let subsystemTake = formData.get("subsystemTake");
        if (subsystemTake == "") {
            message += "Must enter in a subsystem to take money from\n";
        }

        //authenticate the user
        const passwordInput = formData.get("password");
        const result = await fetch('/api/authenticate?password=' + passwordInput);
        const authenticated = await result.json();
        console.log(authenticated);
        if (!authenticated) {
            alert("Incorrect password");
            return;
        }

        let foundGive = false;
        let foundTake = false;
        let subsystemTakeIdx = -1;
        let subsystemGiveIdx = -1;
        let subsystemBudgets = subsystemBudgetsInput;
        for (let i = subsystemBudgets.length -1; i >= 0; i--) {
            if (subsystemBudgets[i].subsystem == subsystemTake) {
                let budget = parseFloat(subsystemBudgets[i].budget.replace(/,/g, ''));
                if (parseFloat(amountInput) > budget) {
                    message += "Cannot take out more money from "+ subsystemTake + " than there is in the budget\n";
                }
                foundTake = true;
                subsystemTakeIdx = i;
            } else if (subsystemBudgets[i].subsystem == subsystemGive) {
                subsystemGiveIdx = i;
                foundGive = true;
            }
            if (foundGive && foundTake) {
                break;
            }
        }
        if (!foundGive) {
            message += "Could not find subsystem " + subsystemGive + "\n";
        }
        if (!foundTake) {
            message += "Could not find subsystem " + subsystemTake + "\n";
        }
        if (message != "") {
            alert(message);
            return;
        }

        let amount = parseFloat(amountInput);
        //check if there is enough money to take
        if (amount > parseFloat(subsystemBudgets[subsystemTakeIdx].remaining.replace(/,/g, ''))) {
            alert("You cannot take more money out of a subsystem than there is money remaining");
            return;
        }  
        //take from the respective budget and update its percent
        let oldBudgetTake = parseFloat(subsystemBudgets[subsystemTakeIdx].budget.replace(/,/g, ''));
        let newBudgetTake = oldBudgetTake - amount;
        let spent = parseFloat(subsystemBudgets[subsystemTakeIdx].spent.replace(/,/g, ''));
        let remaining = newBudgetTake - spent;
        let percent = parseInt((remaining / newBudgetTake) * 100);
        subsystemBudgets[subsystemTakeIdx].budget = newBudgetTake.toLocaleString('en-US');
        subsystemBudgets[subsystemTakeIdx].remaining = remaining.toLocaleString('en-US');
        subsystemBudgets[subsystemTakeIdx].percentRemaining = percent;
        //give to the respective budget and update its percent
        let oldBudgetGive = parseFloat(subsystemBudgets[subsystemGiveIdx].budget.replace(/,/g, ''));
        let newBudgetGive = oldBudgetGive + amount;
        spent = parseFloat(subsystemBudgets[subsystemGiveIdx].spent.replace(/,/g, ''));
        remaining = newBudgetGive - spent;
        percent = parseInt((remaining / newBudgetGive) * 100);
        subsystemBudgets[subsystemGiveIdx].budget = newBudgetGive.toLocaleString('en-US');
        subsystemBudgets[subsystemGiveIdx].remaining = remaining.toLocaleString('en-US');
        subsystemBudgets[subsystemGiveIdx].percentRemaining = percent;
        //add budget event
        let res = await fetch('/api/budgetChange');
        let budgetChange = await res.json();
        const d = new Date();
        const dateInput = (d.getMonth() + 1) +"/" +(d.getDate()) + "/" + (d.getFullYear());
        let budgetChangeTake = {
            date: dateInput,
            category: subsystemTake,
            beforeAllocation: oldBudgetTake,
            afterAllocation: newBudgetTake,
            explanation: explanationInput
        }
        let budgetChangeGive = {
            date: dateInput,
            category: subsystemGive,
            beforeAllocation: oldBudgetGive,
            afterAllocation: newBudgetGive,
            explanation: explanationInput
        }
        let budgetChange1 = [...budgetChange, budgetChangeTake];
        let newBudgetChanges = [...budgetChange1, budgetChangeGive];
        //update subsystemBudgets and budgetEvents
        let postRes = await fetch('/api/budgetChange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBudgetChanges)
        })
        postRes = await fetch('/api/subsystemBudgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subsystemBudgets)
        })

        //if it removes from reserves, need to add amount to total budget
        if (subsystemTake == "Reserves") {
            console.log("Taking from reserves");
            res = await fetch('/api/teamBudget');
            let teamBudget = await res.json();
            for (let i = 0; i < teamBudget.length; i++) {
                if (teamBudget[i].section_name == "Budget") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Discretionary Budget") {
                            teamBudget[i].items[j].value += amount;
                        } else if (teamBudget[i].items[j].name == "Reserves Budget") {
                            teamBudget[i].items[j].value -= amount;
                        }
                   }
                } else if (teamBudget[i].section_name == "Spending") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Discretionary Unspent") {
                            teamBudget[i].items[j].value += amount;
                        } else if (teamBudget[i].items[j].name == "Reserves Unspent") {
                            teamBudget[i].items[j].value -= amount;
                        }
                   }
                }
            }
            postRes = await fetch('/api/teamBudget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamBudget)
            })
        } 
        if (subsystemTake == "Unallocated Funds") {
            res = await fetch('/api/teamBudget');
            let teamBudget = await res.json();
            for (let i = 0; i < teamBudget.length; i++) {
                if (subsystemGive == "Reserves") {
                    if (teamBudget[i].section_name == "Budget") {
                        for (let j = 0; j < teamBudget[i].items.length; j++) {
                            if (teamBudget[i].items[j].name == "Reserves Budget") {
                                teamBudget[i].items[j].value += amount;
                            }
                        }
                    } else if (teamBudget[i].section_name == "Spending") {
                        for (let j = 0; j < teamBudget[i].items.length; j++) {
                            if (teamBudget[i].items[j].name == "Reserves Unspent") {
                                teamBudget[i].items[j].value += amount;
                            }
                        }
                    }
                }
                if (teamBudget[i].section_name == "Funds") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Unallocated Funds") {
                            teamBudget[i].items[j].value -= amount;
                        }
                    }
                }
            }
            postRes = await fetch('/api/teamBudget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamBudget)
            })
        } else if (subsystemGive == "Unallocated Funds") {
            res = await fetch('/api/teamBudget');
            let teamBudget = await res.json();
            for (let i = 0; i < teamBudget.length; i++) {
                if (teamBudget[i].section_name == "Funds") {
                    for (let j = 0; j < teamBudget[i].items.length; j++) {
                        if (teamBudget[i].items[j].name == "Unallocated Funds") {
                            teamBudget[i].items[j].value += amount;
                        }
                    }
                }
            }
            postRes = await fetch('/api/teamBudget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamBudget)
            })
        }

        res = await fetch('/api/subsystemBudgets');
        let data = await res.json();
        setSubsystemBudgets(data);
        alert("Successfuly changed. Reload the page to see results");
    }

    return (
        <Dialog.Root class="dialog">
        <Dialog.Trigger asChild>
            <Button backgroundColor="white" colorPalette="gray" variant="outline" size="sm">
            Change Subsystem Budgets
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
            <Dialog.Content>
                <Dialog.Header>
                <Dialog.Title>Change Subsystem Budgets</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <p>Required fields marked with *</p>
                    <form id="addSubsystemBudgetChange" onSubmit={handleSubmit}>
                        <div class="inputArea">
                            <label for="amount">Amount to add: *</label> <input type="number" id="amount" step=".01" defaultValue="0.00" name="amount" min="0.00"></input>
                        </div>
                        <div class="inputArea">
                            <label for="index">Subsystem to add to: *</label>
                            <input type="text" id="subsystem" name="subsystem"></input>
                        </div>
                        <div class="inputArea">
                            <label for="subsystemTake">Subsystem to take from: *</label>
                            <input type="text" id="subsystemTake" name="subsystemTake"></input>
                        </div>
                        <div class="inputArea">
                            <label for="description">Explanation: *</label> <input type="text" id="explanation" name="explanation"></input>
                        </div>
                        <div class="inputArea">
                            <label for="password">Password: *</label> <input type="password" id="password" name="password"/>
                        </div>
                    </form>
                </Dialog.Body>
                <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button backgroundColor="white" colorPalette="gray" variant="outline" size="sm">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button color="blue" type="submit" form="addSubsystemBudgetChange" backgroundColor="white" variant="outline" size="sm">Submit</Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" backgroundColor="white" colorPalette="gray" variant="outline" />
                </Dialog.CloseTrigger>
            </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
        </Dialog.Root>
    )
}

export default ChangeSubsystemBudgets;