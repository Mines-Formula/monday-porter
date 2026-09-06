import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"

function UpdateIndexBalances({indexes, setIndexes}) {
    async function handleSubmit(evt) {
        evt.preventDefault();
        const form = evt.target;
        const formData = new FormData(form);
        let message = "";
        let sailInput = formData.get("SAIL");
        console.log(sailInput);
        let foundationInput = formData.get("Foundation");
        console.log(foundationInput);
        let descriptionInput = formData.get("description");
        if (descriptionInput == "") {
            message += "Must enter in the description\n";
        }
        if (message != "") {
            alert(message);
            return;
        }

        //authenticate the user
        const passwordInput = formData.get("password");
        const params = new URLSearchParams();
        params.append("password", passwordInput);
        const result = await fetch(`/api/authenticate?${params}`);
        const authenticated = await result.json();
        console.log(authenticated);
        if (!authenticated) {
            alert("Incorrect password");
            return;
        }

        //get the date and update revenue changes
        const d = new Date();
        const dateInput = (d.getMonth() + 1) +"/" +(d.getDate()) + "/" + (d.getFullYear());
        let sailRevenue;
        let sailIndex;
        let foundationRevenue;
        let foundationIndex;
        for (let i = 0; i < indexes.length; i++) {
            if (indexes[i].name == "SAIL") {
                sailRevenue = indexes[i].revenue;
                sailIndex = indexes[i].index;
            } else if (indexes[i].name == "Foundation") {
                foundationRevenue = indexes[i].revenue;
                foundationIndex = indexes[i].index;
            }
        }

        if (sailRevenue == parseFloat(sailInput) && foundationRevenue == parseFloat(foundationInput)) {
            alert("No changes were made to the revenues");
            return;
        }
        let res = await fetch('/api/revenueChanges');
        let revenueChanges = await res.json();
        let newRevenueChanges = revenueChanges;
        if (sailRevenue != parseFloat(sailInput)) {
            console.log("Found change in sail");
            const revenueChange = {
                date: dateInput,
                amount: sailInput,
                index: sailIndex,
                description: descriptionInput
            }
            newRevenueChanges = [...revenueChanges, revenueChange];
        }
        if (foundationRevenue != parseFloat(foundationInput)) {
            console.log("Found change in foundation");
            const revenueChange = {
                date: dateInput,
                amount: foundationInput,
                index: foundationIndex,
                description: descriptionInput
            }
            newRevenueChanges = [...revenueChanges, revenueChange];
        }

        //update index balances
        let newIndexes = indexes;
        let oldBudget = 0;
        for (let i = 0; i < indexes.length; i++) {
            let index = newIndexes[i];
            if (index.index == sailIndex) {
                const spent = index.spent;
                oldBudget += newIndexes[i].revenue;
                console.log(newIndexes[i].revenue);
                newIndexes[i].revenue = parseFloat(sailInput);
                newIndexes[i].balance = parseFloat(sailInput) - spent;
            } else if (index.index == foundationIndex) {
                const spent = index.spent;
                oldBudget += newIndexes[i].revenue;
                console.log(newIndexes[i].revenue);
                newIndexes[i].revenue = parseFloat(foundationInput);
                newIndexes[i].balance = parseFloat(foundationInput) - spent;
            }
        }

        //update unallocated funds
        let newTotalBudget = parseFloat(sailInput) + parseFloat(foundationInput);
        console.log("old budget: " + oldBudget);
        console.log("new budget: " + newTotalBudget);
        res = await fetch('/api/teamBudget');
        let teamBudget = await res.json();
        let unallocatedFunds = 0;
        for (let i = 0; i < teamBudget.length; i++) {
            if (teamBudget[i].section_name == "Funds") {
                for (let j = 0; j < teamBudget[i].items.length; j++) {
                    if (teamBudget[i].items[j].name == "Unallocated Funds") {
                        if (newTotalBudget >= oldBudget) {
                            console.log("Added money");
                            let difference = newTotalBudget - oldBudget;
                            let balance = teamBudget[i].items[j].value; 
                            teamBudget[i].items[j].value = balance + difference;
                            unallocatedFunds = balance + difference;
                        } else {
                            console.log("Removed money");
                            let difference = oldBudget - newTotalBudget;
                            let balance = teamBudget[i].items[j].value;
                            teamBudget[i].items[j].value = balance - difference;
                            unallocatedFunds = balance - difference;
                        }
                    }
                }
            }
        }
        res = await fetch('/api/subsystemBudgets');
        let subsystemBudgets = await res.json();
        for (let i = subsystemBudgets.length-1; i >= 0; i++) {
            if (subsystemBudgets[i].subsystem == "Unallocated Funds") {
                subsystemBudgets[i].budget = unallocatedFunds.toLocaleString('en-US');
                subsystemBudgets[i].remaining = unallocatedFunds.toLocaleString('en-US');
                break;
            }
        }

        //set everything
        const subsystemBudgetsPostRes = await fetch('/api/subsystemBudgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subsystemBudgets)
        }).then(res => {
            console.log(res);
        });
        const teamBudgetPostRes = await fetch('/api/teamBudget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamBudget)
        }).then(res => {
            console.log(res);
        });
        const indexPostRes = await fetch('/api/indexBalances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIndexes)
        }).then(res => {
            console.log(res);
        });
        const revenuePostRes = await fetch('/api/revenueChanges', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRevenueChanges)
        }).then(res => {
            console.log(res);
        });
        console.log("Sent the information");
        const resIndex = await fetch('/api/indexBalances');
        const data = await resIndex.json();
        console.log(data);
        setIndexes(data);
        
        alert("Successfuly added. Reload the page to see updates");
    }

    return (
        <Dialog.Root class="dialog">
        <Dialog.Trigger asChild>
            <Button backgroundColor="white" colorPalette="gray" variant="outline" size="sm">
            Change Index Balances
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
            <Dialog.Content>
                <Dialog.Header>
                <Dialog.Title>Change Index Balances</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <p>Required fields marked with *</p>
                    <form id="addRevenueChange" onSubmit={handleSubmit}>
                        {indexes.map((index) => (
                            <div class="inputArea">
                                <label for={index.name}>{index.index} {index.name}: *</label> 
                                <input type="number" step=".01" defaultValue={index.revenue} name={index.name} min="0.00" id={index.name}/>
                            </div>
                        ))}
                        <div class="inputArea">
                            <label for="description">Description: *</label> <input type="text" id="description" name="description"></input>
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
                <Button color="blue" type="submit" form="addRevenueChange" backgroundColor="white" variant="outline" size="sm">Submit</Button>
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

export default UpdateIndexBalances;